import { describe, it, expect, vi, afterEach } from 'vitest';
import { SliderExporter, type ExportOptions, downloadFile } from '../export';
import type { SliderProject } from '../../types';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
});
// @ts-expect-error assigning to global
global.window = dom.window as any;
// @ts-expect-error assigning to global
global.document = dom.window.document as any;
// @ts-expect-error assigning to global
global.Blob = dom.window.Blob;
// @ts-expect-error assigning to global
global.HTMLAnchorElement = dom.window.HTMLAnchorElement;
// @ts-expect-error assigning to global
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

const project: SliderProject = {
  id: 'proj1',
  name: 'Sample Project',
  slides: [
    {
      id: 'slide1',
      name: 'Slide 1',
      background: { type: 'color', value: '#000000' },
      duration: 5000,
      layers: [
        {
          id: 'layer1',
          type: 'text',
          content: 'Hello World',
          style: {
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            opacity: 1,
            rotation: 0,
            zIndex: 1,
          },
          animation: {
            entrance: 'Fade In',
            exit: 'Fade Out',
            duration: 1000,
            delay: 0,
            easing: 'ease',
          },
        },
      ],
    },
  ],
  settings: {
    autoplay: true,
    loop: true,
    navigation: true,
    pagination: true,
    transitionType: 'fade',
    transitionDuration: 1000,
  },
};

const options: ExportOptions = {
  format: 'html',
  includeAnimations: true,
  includeStyles: true,
  autoplay: true,
  loop: false,
};

describe('SliderExporter utility functions', () => {
  it('exportToJSON produces formatted JSON', () => {
    const json = SliderExporter.exportToJSON(project);
    expect(json).toBe(JSON.stringify(project, null, 2));
    expect(JSON.parse(json)).toEqual(project);
  });

  it('generateJavaScript embeds autoplay and loop settings', () => {
    const js = SliderExporter.generateJavaScript(project, options);
    expect(js).toContain('this.autoplay = true');
    expect(js).toContain('this.loop = false');
  });

  it('exportAsVideo resolves with a Blob', async () => {
    const toBlobMock = vi
      .spyOn(global.HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation((cb: (b: Blob | null) => void) => cb(new Blob()));

    const blob = await SliderExporter.exportAsVideo(project);
    expect(blob).toBeInstanceOf(Blob);
    expect(toBlobMock).toHaveBeenCalled();
  });

  it('downloadFile creates, clicks, and revokes anchor', () => {
    const url = 'blob:mock';
    const createObjectURL = vi.fn(() => url);
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    const clickSpy = vi
      .spyOn(global.HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    downloadFile('data', 'file.txt');

    expect(createObjectURL).toHaveBeenCalled();
    const anchor = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(anchor.tagName).toBe('A');
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith(anchor);
    expect(revokeObjectURL).toHaveBeenCalledWith(url);
  });
});


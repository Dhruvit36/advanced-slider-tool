import { describe, it, expect } from 'vitest';
import { SliderExporter, ExportOptions } from '../src/utils/export';
import type { SliderProject } from '../src/types';

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
  loop: true,
};

describe('SliderExporter integration', () => {
  it('generates full HTML document with CSS and JS', () => {
    const output = SliderExporter.exportToHTML(project, options);
    expect(output).toContain('<!DOCTYPE html>');
    expect(output).toContain('.slider-container');
    expect(output).toContain('class SliderRevolution');
    expect(output).toContain('.fade-in {');
  });

  it('omits animation CSS when includeAnimations is false', () => {
    const css = SliderExporter.generateCSS(project, { ...options, includeAnimations: false });
    expect(css).not.toContain('.fade-in {');
  });
});

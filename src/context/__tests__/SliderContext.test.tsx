// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { sliderReducer, SliderProvider, useSlider } from '../SliderContext';
import type { Slide, Layer, SliderProject } from '../../types';

// Helper to create a basic layer
function createLayer(id: string): Layer {
  return {
    id,
    type: 'text',
    content: `Layer ${id}`,
    style: {
      x: 0,
      y: 0,
      width: 100,
      height: 20,
      opacity: 1,
      rotation: 0,
      zIndex: 0
    },
    animation: {
      entrance: 'none',
      exit: 'none',
      duration: 0,
      delay: 0,
      easing: 'linear'
    }
  };
}

function createProject(): SliderProject {
  return {
    id: 'proj1',
    name: 'Test Project',
    slides: [
      {
        id: 'slide1',
        name: 'Slide 1',
        background: { type: 'color', value: '#fff' },
        layers: [createLayer('layer1'), createLayer('layer2')],
        duration: 1000
      }
    ],
    settings: {
      autoplay: false,
      loop: false,
      navigation: false,
      pagination: false,
      transitionType: 'fade',
      transitionDuration: 500
    }
  };
}

describe('sliderReducer', () => {
  it('adds a slide on ADD_SLIDE', () => {
    const project = createProject();
    const state = {
      project,
      currentSlideIndex: 0,
      selectedLayerId: null,
      isPlaying: false,
      currentTime: 0
    };
    const newSlide: Slide = {
      id: 'slide2',
      name: 'Slide 2',
      background: { type: 'color', value: '#000' },
      layers: [],
      duration: 1000
    };
    const result = sliderReducer(state, { type: 'ADD_SLIDE', payload: newSlide });
    expect(result.project?.slides).toHaveLength(2);
    expect(result.project?.slides[1]).toEqual(newSlide);
  });

  it('updates a layer on UPDATE_LAYER', () => {
    const project = createProject();
    const state = {
      project,
      currentSlideIndex: 0,
      selectedLayerId: null,
      isPlaying: false,
      currentTime: 0
    };
    const result = sliderReducer(state, {
      type: 'UPDATE_LAYER',
      payload: {
        slideId: 'slide1',
        layerId: 'layer1',
        updates: { content: 'Updated', style: { x: 10 } }
      }
    });
    const layer = result.project!.slides[0].layers.find(l => l.id === 'layer1')!;
    expect(layer.content).toBe('Updated');
    expect(layer.style.x).toBe(10);
  });

  it('deletes a layer on DELETE_LAYER', () => {
    const project = createProject();
    const state = {
      project,
      currentSlideIndex: 0,
      selectedLayerId: null,
      isPlaying: false,
      currentTime: 0
    };
    const result = sliderReducer(state, {
      type: 'DELETE_LAYER',
      payload: { slideId: 'slide1', layerId: 'layer1' }
    });
    expect(result.project!.slides[0].layers).toHaveLength(1);
    expect(result.project!.slides[0].layers[0].id).toBe('layer2');
  });
});

function setupProvider() {
  const div = document.createElement('div');
  const root = createRoot(div);
  let ctx: ReturnType<typeof useSlider>;
  function TestComponent() {
    ctx = useSlider();
    return null;
  }
  act(() => {
    root.render(
      <SliderProvider>
        <TestComponent />
      </SliderProvider>
    );
  });
  return { ctx: () => ctx!, root };
}

describe('saveProject', () => {
  afterEach(() => vi.restoreAllMocks());

  it('triggers download with correct filename', () => {
    const { ctx, root } = setupProvider();
    const mockBlob = vi.fn(() => ({}));
    // @ts-ignore
    global.Blob = mockBlob;
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    // @ts-ignore
    global.URL.createObjectURL = createObjectURL;
    // @ts-ignore
    global.URL.revokeObjectURL = revokeObjectURL;
    const click = vi.fn();
    const anchor = document.createElement('a');
    anchor.click = click;
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue(anchor);

    act(() => {
      ctx().saveProject();
    });

    expect(mockBlob).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(anchor.download).toBe('My Slider.json');

    root.unmount();
    createElement.mockRestore();
  });
});

describe('loadProject', () => {
  afterEach(() => vi.restoreAllMocks());

  it('loads valid project JSON', () => {
    const { ctx, root } = setupProvider();
    const validProject = {
      id: '2',
      name: 'Loaded Project',
      slides: [],
      settings: {
        autoplay: true,
        loop: true,
        navigation: true,
        pagination: true,
        transitionType: 'slide',
        transitionDuration: 800
      }
    };

    act(() => {
      ctx().loadProject(JSON.stringify(validProject));
    });

    expect(ctx().state.project?.name).toBe('Loaded Project');
    root.unmount();
  });

  it('handles invalid project JSON', () => {
    const { ctx, root } = setupProvider();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      ctx().loadProject('invalid-json');
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(ctx().state.project?.name).toBe('My Slider');
    root.unmount();
  });
});


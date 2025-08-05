import React from 'react';
import { describe, it, expect } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useCanvasSettings } from '../useCanvasSettings';

// Enable React act(...) warnings support for this test environment
// @ts-ignore - global flag recognized by React
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function renderHook() {
  const result: { current: ReturnType<typeof useCanvasSettings> } = {
    current: null as unknown as ReturnType<typeof useCanvasSettings>,
  };

  function TestComponent() {
    result.current = useCanvasSettings();
    return null;
  }

  const container = document.createElement('div');
  const root = createRoot(container);
  act(() => {
    root.render(React.createElement(TestComponent));
  });

  const unmount = () => act(() => root.unmount());

  return { result, unmount };
}

describe('useCanvasSettings', () => {
  it('flips settings flags via toggle functions', () => {
    const { result, unmount } = renderHook();

    expect(result.current.settings.showGrid).toBe(true);
    act(() => result.current.toggleGrid());
    expect(result.current.settings.showGrid).toBe(false);

    expect(result.current.settings.showRulers).toBe(true);
    act(() => result.current.toggleRulers());
    expect(result.current.settings.showRulers).toBe(false);

    expect(result.current.settings.showGuides).toBe(true);
    act(() => result.current.toggleGuides());
    expect(result.current.settings.showGuides).toBe(false);

    expect(result.current.settings.snapToGrid).toBe(true);
    act(() => result.current.toggleSnapToGrid());
    expect(result.current.settings.snapToGrid).toBe(false);

    unmount();
  });

  it('updates grid size with setGridSize', () => {
    const { result, unmount } = renderHook();

    act(() => result.current.setGridSize(50));
    expect(result.current.settings.gridSize).toBe(50);

    unmount();
  });

  it('handles snapToGrid based on snap setting', () => {
    const { result, unmount } = renderHook();

    // Snap enabled by default
    expect(result.current.snapToGrid(33)).toBe(40);

    // Disable snap and ensure value remains unchanged
    act(() => result.current.toggleSnapToGrid());
    expect(result.current.snapToGrid(33)).toBe(33);

    unmount();
  });
});


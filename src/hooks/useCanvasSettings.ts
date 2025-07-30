import { useState } from 'react';

export interface CanvasSettings {
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showGuides: boolean;
}

export function useCanvasSettings() {
  const [settings, setSettings] = useState<CanvasSettings>({
    showGrid: true,
    showRulers: true,
    snapToGrid: true,
    gridSize: 20,
    showGuides: true
  });

  const toggleGrid = () => {
    setSettings(prev => ({ ...prev, showGrid: !prev.showGrid }));
  };

  const toggleRulers = () => {
    setSettings(prev => ({ ...prev, showRulers: !prev.showRulers }));
  };

  const toggleGuides = () => {
    setSettings(prev => ({ ...prev, showGuides: !prev.showGuides }));
  };

  const toggleSnapToGrid = () => {
    setSettings(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  };

  const setGridSize = (size: number) => {
    setSettings(prev => ({ ...prev, gridSize: size }));
  };

  const snapToGrid = (value: number) => {
    if (!settings.snapToGrid) return value;
    return Math.round(value / settings.gridSize) * settings.gridSize;
  };

  return {
    settings,
    setSettings,
    toggleGrid,
    toggleRulers,
    toggleGuides,
    toggleSnapToGrid,
    setGridSize,
    snapToGrid
  };
}

import React from 'react';

interface CanvasStatusBarProps {
  zoom: number;
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  showGuides: boolean;
  slideCount: number;
}

export function CanvasStatusBar({
  zoom,
  showGrid,
  gridSize,
  snapToGrid,
  showGuides,
  slideCount
}: CanvasStatusBarProps) {
  return (
    <div className="absolute bottom-4 right-4 z-20 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-xs">
      <div className="flex items-center space-x-4">
        <span>Zoom: {Math.round(zoom * 100)}%</span>
        {showGrid && <span className="text-blue-300">Grid: {gridSize}px</span>}
        {snapToGrid && <span className="text-green-300">Snap: ON</span>}
        {showGuides && <span className="text-pink-300">Guides: ON</span>}
        <span>Slides: {slideCount}</span>
      </div>
    </div>
  );
}

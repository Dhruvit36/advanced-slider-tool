import React from 'react';

interface CanvasGridProps {
  zoom: number;
  gridSize: number;
  showGrid: boolean;
}

export function CanvasGrid({ zoom, gridSize, showGrid }: CanvasGridProps) {
  if (!showGrid) return null;
  
  const gridLines: React.ReactElement[] = [];
  const canvasWidth = 1200;
  const canvasHeight = 600;
  
  // Vertical grid lines
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={x * zoom}
        y1={0}
        x2={x * zoom}
        y2={canvasHeight * zoom}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  }
  
  // Horizontal grid lines
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y * zoom}
        x2={canvasWidth * zoom}
        y2={y * zoom}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  }
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none canvas-grid"
      width={canvasWidth * zoom}
      height={canvasHeight * zoom}
      style={{ zIndex: 1 }}
    >
      {gridLines}
    </svg>
  );
}

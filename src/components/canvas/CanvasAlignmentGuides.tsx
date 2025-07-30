import React from 'react';

interface CanvasAlignmentGuidesProps {
  zoom: number;
  alignmentGuides: { x: number[], y: number[] };
  isDragging: boolean;
  showGuides: boolean;
}

export function CanvasAlignmentGuides({ 
  zoom, 
  alignmentGuides, 
  isDragging, 
  showGuides 
}: CanvasAlignmentGuidesProps) {
  if (!isDragging || !showGuides) return null;
  
  const canvasWidth = 1200;
  const canvasHeight = 600;
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth * zoom}
      height={canvasHeight * zoom}
      style={{ zIndex: 1000 }}
    >
      {/* Vertical alignment guides */}
      {alignmentGuides.x.map((x, index) => (
        <line
          key={`align-x-${index}`}
          x1={x * zoom}
          y1={0}
          x2={x * zoom}
          y2={canvasHeight * zoom}
          stroke="#ff0080"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}
      
      {/* Horizontal alignment guides */}
      {alignmentGuides.y.map((y, index) => (
        <line
          key={`align-y-${index}`}
          x1={0}
          y1={y * zoom}
          x2={canvasWidth * zoom}
          y2={y * zoom}
          stroke="#ff0080"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}
    </svg>
  );
}

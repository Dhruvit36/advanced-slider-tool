import React from 'react';

interface CanvasRulersProps {
  zoom: number;
  showRulers: boolean;
}

export function CanvasRulers({ zoom, showRulers }: CanvasRulersProps) {
  if (!showRulers) return null;
  
  const rulerSize = 30;
  const canvasWidth = 1200;
  const canvasHeight = 600;
  
  return (
    <>
      {/* Horizontal ruler - attached to top of canvas */}
      <div
        className="absolute bg-gray-100 border-b border-gray-300 shadow-sm"
        style={{
          top: -rulerSize,
          left: 0,
          width: canvasWidth * zoom,
          height: rulerSize,
          fontSize: 10,
          zIndex: 15,
          transformOrigin: 'top left'
        }}
      >
        {/* Major tick marks and labels */}
        {Array.from({ length: Math.floor(canvasWidth / 50) + 1 }, (_, i) => (
          <div key={`major-${i}`}>
            {/* Tick mark */}
            <div
              className="absolute bg-gray-400"
              style={{
                left: i * 50 * zoom,
                bottom: 0,
                width: 1,
                height: 8
              }}
            />
            {/* Number label */}
            <div
              className="absolute text-gray-600 text-xs select-none ruler-text"
              style={{
                left: i * 50 * zoom - 10,
                top: 2,
                fontSize: 10
              }}
            >
              {i * 50}
            </div>
          </div>
        ))}
        {/* Minor tick marks */}
        {Array.from({ length: Math.floor(canvasWidth / 10) + 1 }, (_, i) => (
          i % 5 !== 0 && (
            <div
              key={`minor-${i}`}
              className="absolute bg-gray-300"
              style={{
                left: i * 10 * zoom,
                bottom: 0,
                width: 1,
                height: 4
              }}
            />
          )
        ))}
      </div>
      
      {/* Vertical ruler - attached to left of canvas */}
      <div
        className="absolute bg-gray-100 border-r border-gray-300 shadow-sm"
        style={{
          top: 0,
          left: -rulerSize,
          width: rulerSize,
          height: canvasHeight * zoom,
          fontSize: 10,
          zIndex: 15,
          transformOrigin: 'top left'
        }}
      >
        {/* Major tick marks and labels */}
        {Array.from({ length: Math.floor(canvasHeight / 50) + 1 }, (_, i) => (
          <div key={`v-major-${i}`}>
            {/* Tick mark */}
            <div
              className="absolute bg-gray-400"
              style={{
                right: 0,
                top: i * 50 * zoom,
                height: 1,
                width: 8
              }}
            />
            {/* Number label */}
            <div
              className="absolute text-gray-600 text-xs transform -rotate-90 select-none ruler-text origin-center"
              style={{
                right: 2,
                top: i * 50 * zoom - 8,
                fontSize: 10,
                width: 20,
                textAlign: 'center'
              }}
            >
              {i * 50}
            </div>
          </div>
        ))}
        {/* Minor tick marks */}
        {Array.from({ length: Math.floor(canvasHeight / 10) + 1 }, (_, i) => (
          i % 5 !== 0 && (
            <div
              key={`v-minor-${i}`}
              className="absolute bg-gray-300"
              style={{
                right: 0,
                top: i * 10 * zoom,
                height: 1,
                width: 4
              }}
            />
          )
        ))}
      </div>
      
      {/* Corner piece - attached to top-left corner */}
      <div
        className="absolute bg-gray-200 border-r border-b border-gray-300 shadow-sm flex items-center justify-center"
        style={{
          top: -rulerSize,
          left: -rulerSize,
          width: rulerSize,
          height: rulerSize,
          zIndex: 16
        }}
      >
        <i className="fas fa-ruler-combined text-gray-500" style={{ fontSize: 12 }}></i>
      </div>
    </>
  );
}

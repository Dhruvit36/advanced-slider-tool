import { useState } from 'react';

export function useCanvasZoom(initialZoom: number = 1) {
  const [zoom, setZoom] = useState(initialZoom);

  const zoomIn = () => {
    setZoom(prev => Math.min(2, prev + 0.25));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(0.25, prev - 0.25));
  };

  const setZoomLevel = (level: number) => {
    setZoom(Math.max(0.25, Math.min(2, level)));
  };

  return {
    zoom,
    zoomIn,
    zoomOut,
    setZoom: setZoomLevel
  };
}

import { useState } from 'react';
import { Layer } from '../types';

export interface DraggingState {
  layerId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

export function useCanvasDragDrop() {
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<{x: number[], y: number[]}>({x: [], y: []});

  const startDragging = (dragState: DraggingState) => {
    setDragging(dragState);
  };

  const stopDragging = () => {
    setDragging(null);
    setAlignmentGuides({x: [], y: []});
  };

  const updateAlignmentGuides = (guides: {x: number[], y: number[]}) => {
    setAlignmentGuides(guides);
  };

  // Calculate alignment guides
  const calculateAlignmentGuides = (draggedLayer: Layer, allLayers: Layer[]) => {
    const otherLayers = allLayers.filter(l => l.id !== draggedLayer.id);
    const guides: {x: number[], y: number[]} = {x: [], y: []};
    
    otherLayers.forEach(layer => {
      // Vertical alignment guides (x positions)
      guides.x.push(layer.style.x); // Left edge
      guides.x.push(layer.style.x + layer.style.width / 2); // Center
      guides.x.push(layer.style.x + layer.style.width); // Right edge
      
      // Horizontal alignment guides (y positions)
      guides.y.push(layer.style.y); // Top edge
      guides.y.push(layer.style.y + layer.style.height / 2); // Center
      guides.y.push(layer.style.y + layer.style.height); // Bottom edge
    });
    
    return guides;
  };

  return {
    dragging,
    alignmentGuides,
    startDragging,
    stopDragging,
    updateAlignmentGuides,
    calculateAlignmentGuides
  };
}

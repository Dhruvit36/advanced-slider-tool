import React, { useState, useRef, useCallback } from 'react';
import { Layer } from '../../types';

interface AnimationBlockProps {
  layer: Layer;
  position: { left: string; width: string };
  maxTime: number;
  isSelected?: boolean;
  onMouseEnter: (e: React.MouseEvent, layerId: string) => void;
  onMouseLeave: () => void;
  onUpdateAnimation: (layerId: string, updates: { delay?: number; duration?: number }) => void;
  onSelectLayer?: (layerId: string) => void;
}

export function AnimationBlock({
  layer,
  position,
  maxTime,
  isSelected = false,
  onMouseEnter,
  onMouseLeave,
  onUpdateAnimation,
  onSelectLayer
}: AnimationBlockProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, delay: 0, duration: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const blockRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Get timeline container reference
  const getTimelineContainer = () => {
    return blockRef.current?.closest('[data-timeline-container]') as HTMLDivElement;
  };

  // Convert pixel position to time
  const pixelToTime = useCallback((pixelX: number, containerWidth: number) => {
    return (pixelX / containerWidth) * maxTime;
  }, [maxTime]);

  // Update tooltip position based on current mouse position
  const updateTooltipPosition = useCallback((mouseX: number, mouseY: number) => {
    setTooltipPosition({
      x: mouseX,
      y: mouseY - 50 // Position above the cursor with more space
    });
  }, []);

  // Snap to grid (every 100ms)
  const snapToGrid = useCallback((time: number) => {
    const gridSize = 100; // 100ms
    return Math.round(time / gridSize) * gridSize;
  }, []);

  // Handle block dragging (moving entire block)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest('.block-content')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Select the layer when clicking on the block
    if (onSelectLayer && !isSelected) {
      onSelectLayer(layer.id);
    }
    
    // Initialize tooltip position
    updateTooltipPosition(e.clientX, e.clientY);
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      delay: layer.animation.delay,
      duration: layer.animation.duration
    });
  };

  // Handle left resize (delay adjustment)
  const handleLeftResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Initialize tooltip position
    updateTooltipPosition(e.clientX, e.clientY);
    
    setIsResizing('left');
    setDragStart({
      x: e.clientX,
      delay: layer.animation.delay,
      duration: layer.animation.duration
    });
  };

  // Handle right resize (duration adjustment)
  const handleRightResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Initialize tooltip position
    updateTooltipPosition(e.clientX, e.clientY);
    
    setIsResizing('right');
    setDragStart({
      x: e.clientX,
      delay: layer.animation.delay,
      duration: layer.animation.duration
    });
  };

  // Handle mouse move during drag/resize
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = getTimelineContainer();
    if (!container || (!isDragging && !isResizing)) return;

    // Update tooltip position to follow cursor
    updateTooltipPosition(e.clientX, e.clientY);

    const containerRect = container.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaTime = pixelToTime(deltaX, containerRect.width);

    if (isDragging) {
      // Move entire block - enforce strict boundaries
      const rawDelay = dragStart.delay + deltaTime;
      const constrainedDelay = Math.max(0, Math.min(rawDelay, maxTime - layer.animation.duration));
      const snappedDelay = snapToGrid(constrainedDelay);
      onUpdateAnimation(layer.id, { delay: snappedDelay });
    } else if (isResizing === 'left') {
      // Resize from left (adjust delay and duration) - enforce boundaries
      const rawDelay = dragStart.delay + deltaTime;
      const maxAllowedDelay = dragStart.delay + dragStart.duration - 100;
      const constrainedDelay = Math.max(0, Math.min(rawDelay, maxAllowedDelay));
      const snappedDelay = snapToGrid(constrainedDelay);
      const newDuration = dragStart.duration - (snappedDelay - dragStart.delay);
      onUpdateAnimation(layer.id, { delay: snappedDelay, duration: Math.max(100, newDuration) });
    } else if (isResizing === 'right') {
      // Resize from right (adjust duration only) - enforce boundaries
      const rawDuration = dragStart.duration + deltaTime;
      const maxAllowedDuration = maxTime - dragStart.delay;
      const constrainedDuration = Math.max(100, Math.min(rawDuration, maxAllowedDuration));
      const snappedDuration = snapToGrid(constrainedDuration);
      onUpdateAnimation(layer.id, { duration: snappedDuration });
    }
  }, [isDragging, isResizing, dragStart, layer.id, layer.animation.duration, maxTime, onUpdateAnimation, pixelToTime, snapToGrid, updateTooltipPosition]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
    // Reset tooltip position
    setTooltipPosition({ x: 0, y: 0 });
  }, []);

  // Set up global mouse events
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'ew-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={blockRef}
      className={`absolute top-1 bottom-1 bg-gradient-to-r rounded-md shadow-md group border pointer-events-auto transition-all duration-150 ${
        isSelected 
          ? 'from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/30 scale-105 z-10' 
          : 'from-blue-500 to-blue-600 border-blue-400 hover:from-blue-600 hover:to-blue-700'
      } ${
        isDragging ? 'shadow-lg scale-105 z-10' : ''
      } ${isResizing ? 'shadow-lg z-10' : ''}`}
      style={{
        ...position,
        maxWidth: '100%', // Prevent overflow
        overflow: 'hidden' // Clip content if needed
      }}
      onMouseEnter={(e) => onMouseEnter(e, layer.id)}
      onMouseLeave={onMouseLeave}
      onMouseDown={handleMouseDown}
      data-animation-block
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-blue-300 hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center"
        onMouseDown={handleLeftResizeMouseDown}
        title="Adjust start time"
      >
        <div className="w-0.5 h-4 bg-white rounded-full opacity-60"></div>
      </div>

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-blue-300 hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center"
        onMouseDown={handleRightResizeMouseDown}
        title="Adjust duration"
      >
        <div className="w-0.5 h-4 bg-white rounded-full opacity-60"></div>
      </div>

      {/* Block content - Clean visual block without text since tooltip provides info */}
      <div className="block-content absolute inset-2 cursor-grab active:cursor-grabbing">
        {/* Visual indicator only - no text content */}
      </div>

      {/* Visual feedback for dragging */}
      {(isDragging || isResizing) && (
        <div 
          className="fixed bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none border border-gray-700"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, 0)',
            transition: 'none' // No transition during drag for immediate response
          }}
        >
          <div className="flex flex-col items-center space-y-1">
            {isDragging && (
              <>
                <div className="text-gray-300 text-xs">Moving Block</div>
                <div className="font-medium">Start: {(layer.animation.delay / 1000).toFixed(1)}s</div>
              </>
            )}
            {isResizing === 'left' && (
              <>
                <div className="text-gray-300 text-xs">Adjusting Start</div>
                <div className="font-medium">Start: {(layer.animation.delay / 1000).toFixed(1)}s</div>
                <div className="text-gray-400 text-xs">Duration: {(layer.animation.duration / 1000).toFixed(1)}s</div>
              </>
            )}
            {isResizing === 'right' && (
              <>
                <div className="text-gray-300 text-xs">Adjusting Duration</div>
                <div className="font-medium">Duration: {(layer.animation.duration / 1000).toFixed(1)}s</div>
                <div className="text-gray-400 text-xs">End: {((layer.animation.delay + layer.animation.duration) / 1000).toFixed(1)}s</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

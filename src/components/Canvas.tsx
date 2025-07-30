import React, { useRef, useEffect } from 'react';
import { useSlider } from '../context/SliderContext';
import { Layer } from '../types';
import { SlideThumbnails } from './SlideThumbnails';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useCanvasSettings } from '../hooks/useCanvasSettings';
import { useCanvasDragDrop } from '../hooks/useCanvasDragDrop';
import { useCanvasAnimations } from '../hooks/useCanvasAnimations';
import { useCanvasKeyboardShortcuts } from '../hooks/useCanvasKeyboardShortcuts';
import { CanvasGrid } from './canvas/CanvasGrid';
import { CanvasRulers } from './canvas/CanvasRulers';
import { CanvasAlignmentGuides } from './canvas/CanvasAlignmentGuides';
import { CanvasLayer } from './canvas/CanvasLayer';
import { CanvasControls } from './canvas/CanvasControls';
import { CanvasStatusBar } from './canvas/CanvasStatusBar';

interface Guide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
}

export function Canvas() {
  const { state, dispatch } = useSlider();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks
  const { zoom, zoomIn, zoomOut } = useCanvasZoom();
  const { 
    settings, 
    toggleGrid, 
    toggleRulers, 
    toggleGuides, 
    toggleSnapToGrid, 
    setGridSize, 
    snapToGrid 
  } = useCanvasSettings();
  const {
    dragging,
    alignmentGuides,
    startDragging,
    stopDragging,
    updateAlignmentGuides,
    calculateAlignmentGuides
  } = useCanvasDragDrop();
  const {
    animationStates,
    isPreviewMode,
    getAnimationClassName,
    previewAllAnimations,
    syncWithTimeline
  } = useCanvasAnimations();

  const currentSlide = state.project?.slides[state.currentSlideIndex];

  // Sync timeline with canvas animations
  useEffect(() => {
    if (currentSlide?.layers) {
      syncWithTimeline(state.currentTime, currentSlide.layers, state.isPlaying);
    }
  }, [state.currentTime, state.isPlaying, currentSlide?.layers, syncWithTimeline]);

  // Set up keyboard shortcuts
  useCanvasKeyboardShortcuts({
    onToggleGrid: toggleGrid,
    onToggleRulers: toggleRulers,
    onToggleGuides: toggleGuides,
    onToggleSnapToGrid: toggleSnapToGrid
  });

  const handleLayerMouseDown = (e: React.MouseEvent, layer: Layer) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({ type: 'SELECT_LAYER', payload: layer.id });
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate alignment guides for this layer
    const guides = calculateAlignmentGuides(layer, currentSlide?.layers || []);
    updateAlignmentGuides(guides);
    
    startDragging({
      layerId: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left - layer.style.x * zoom,
      offsetY: e.clientY - rect.top - layer.style.y * zoom
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !canvasRef.current || !currentSlide) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let newX = (e.clientX - rect.left - dragging.offsetX) / zoom;
    let newY = (e.clientY - rect.top - dragging.offsetY) / zoom;
    
    // Snap to grid
    if (settings.snapToGrid) {
      newX = snapToGrid(newX);
      newY = snapToGrid(newY);
    }
    
    // Snap to alignment guides
    const snapThreshold = 5;
    alignmentGuides.x.forEach(guideX => {
      if (Math.abs(newX - guideX) < snapThreshold) newX = guideX;
      if (Math.abs((newX + currentSlide.layers.find(l => l.id === dragging.layerId)?.style.width! / 2) - guideX) < snapThreshold) {
        newX = guideX - currentSlide.layers.find(l => l.id === dragging.layerId)?.style.width! / 2;
      }
      if (Math.abs((newX + currentSlide.layers.find(l => l.id === dragging.layerId)?.style.width!) - guideX) < snapThreshold) {
        newX = guideX - currentSlide.layers.find(l => l.id === dragging.layerId)?.style.width!;
      }
    });
    
    alignmentGuides.y.forEach(guideY => {
      if (Math.abs(newY - guideY) < snapThreshold) newY = guideY;
      if (Math.abs((newY + currentSlide.layers.find(l => l.id === dragging.layerId)?.style.height! / 2) - guideY) < snapThreshold) {
        newY = guideY - currentSlide.layers.find(l => l.id === dragging.layerId)?.style.height! / 2;
      }
      if (Math.abs((newY + currentSlide.layers.find(l => l.id === dragging.layerId)?.style.height!) - guideY) < snapThreshold) {
        newY = guideY - currentSlide.layers.find(l => l.id === dragging.layerId)?.style.height!;
      }
    });
    
    dispatch({
      type: 'UPDATE_LAYER',
      payload: {
        slideId: currentSlide.id,
        layerId: dragging.layerId,
        updates: {
          style: {
            ...currentSlide.layers.find(l => l.id === dragging.layerId)?.style!,
            x: Math.max(0, newX),
            y: Math.max(0, newY)
          }
        }
      }
    });
  };

  const handleMouseUp = () => {
    stopDragging();
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, alignmentGuides]);

  const renderLayer = (layer: Layer) => {
    const isSelected = state.selectedLayerId === layer.id;
    const animationState = animationStates[layer.id];

    return (
      <CanvasLayer
        layer={layer}
        zoom={zoom}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        animationState={animationState}
        isDragging={!!dragging}
        getAnimationClassName={getAnimationClassName}
        onMouseDown={handleLayerMouseDown}
      />
    );
  };

  const backgroundStyle: React.CSSProperties = {
    background: currentSlide?.background.type === 'gradient' 
      ? currentSlide.background.value
      : currentSlide?.background.type === 'color'
      ? currentSlide.background.value
      : `url(${currentSlide?.background.value}) center/cover`,
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-auto min-w-0">
      {/* Canvas Controls */}
      <CanvasControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        settings={settings}
        onToggleGrid={toggleGrid}
        onToggleRulers={toggleRulers}
        onToggleGuides={toggleGuides}
        onToggleSnapToGrid={toggleSnapToGrid}
        onSetGridSize={setGridSize}
        onPreviewAnimations={() => {
          if (currentSlide) {
            // Reset timeline and start playing
            dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
            dispatch({ type: 'SET_PLAYING', payload: true });
          }
        }}
        isPreviewMode={state.isPlaying}
      />

      {/* Canvas Area */}
      <div 
        className="flex items-center justify-center w-full h-full"
        style={{ 
          minWidth: `${1200 * zoom + 128}px`,
          minHeight: `${600 * zoom + 128}px`,
          paddingTop: '80px',
          paddingBottom: '80px',
          paddingLeft: '80px',
          paddingRight: '80px'
        }}
      >
        <div
          ref={canvasRef}
          className="relative bg-white shadow-2xl flex-shrink-0"
          style={{
            width: 1200 * zoom,
            height: 600 * zoom,
            transform: `scale(1)`,
            transformOrigin: 'center',
            ...backgroundStyle
          }}
          onClick={() => dispatch({ type: 'SELECT_LAYER', payload: null })}
        >
          {/* Rulers attached to canvas */}
          <CanvasRulers zoom={zoom} showRulers={settings.showRulers} />
          
          {/* Grid */}
          <CanvasGrid zoom={zoom} gridSize={settings.gridSize} showGrid={settings.showGrid} />

          {/* Navigation Arrows */}
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all z-20">
            <i className="fas fa-chevron-left text-xl text-gray-700"></i>
          </button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all z-20">
            <i className="fas fa-chevron-right text-xl text-gray-700"></i>
          </button>

          {/* Layers */}
          {currentSlide?.layers.map(layer => (
            <div key={layer.id}>
              {renderLayer(layer)}
            </div>
          ))}

          {/* Alignment guides */}
          <CanvasAlignmentGuides 
            zoom={zoom} 
            alignmentGuides={alignmentGuides} 
            isDragging={!!dragging} 
            showGuides={settings.showGuides} 
          />

          {/* Slide Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {state.project?.slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === state.currentSlideIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'SET_CURRENT_SLIDE', payload: index });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slide Thumbnails */}
      <SlideThumbnails />

      {/* Status Bar */}
      <CanvasStatusBar
        zoom={zoom}
        showGrid={settings.showGrid}
        gridSize={settings.gridSize}
        snapToGrid={settings.snapToGrid}
        showGuides={settings.showGuides}
        slideCount={state.project?.slides.length || 0}
      />
    </div>
  );
}

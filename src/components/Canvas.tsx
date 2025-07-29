import React, { useRef, useState, useEffect } from 'react';
import { useSlider } from '../context/SliderContext';
import { Layer } from '../types';
import { SlideThumbnails } from './SlideThumbnails';
import { Shape } from './Shape';
import { CleanDropdown } from './ui/CleanDropdown';

interface DraggingState {
  layerId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

interface Guide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
}

interface CanvasSettings {
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showGuides: boolean;
}

export function Canvas() {
  const { state, dispatch } = useSlider();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [zoom, setZoom] = useState(1);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [settings, setSettings] = useState<CanvasSettings>({
    showGrid: true,
    showRulers: true,
    snapToGrid: true,
    gridSize: 20,
    showGuides: true
  });
  const [alignmentGuides, setAlignmentGuides] = useState<{x: number[], y: number[]}>({x: [], y: []});

  const currentSlide = state.project?.slides[state.currentSlideIndex];

  // Snap to grid function
  const snapToGrid = (value: number) => {
    if (!settings.snapToGrid) return value;
    return Math.round(value / settings.gridSize) * settings.gridSize;
  };

  // Calculate alignment guides
  const calculateAlignmentGuides = (draggedLayer: Layer) => {
    if (!currentSlide) return {x: [], y: []};
    
    const otherLayers = currentSlide.layers.filter(l => l.id !== draggedLayer.id);
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

  const handleLayerMouseDown = (e: React.MouseEvent, layer: Layer) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({ type: 'SELECT_LAYER', payload: layer.id });
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate alignment guides for this layer
    const guides = calculateAlignmentGuides(layer);
    setAlignmentGuides(guides);
    
    setDragging({
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
    setDragging(null);
    setAlignmentGuides({x: [], y: []});
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
    
    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      left: layer.style.x * zoom,
      top: layer.style.y * zoom,
      width: layer.style.width * zoom,
      height: layer.style.height * zoom,
      fontSize: layer.style.fontSize ? layer.style.fontSize * zoom : undefined,
      fontWeight: layer.style.fontWeight,
      color: layer.style.color,
      backgroundColor: layer.style.backgroundColor,
      borderRadius: layer.style.borderRadius ? layer.style.borderRadius * zoom : undefined,
      opacity: layer.style.opacity,
      transform: `rotate(${layer.style.rotation}deg)`,
      zIndex: layer.style.zIndex,
      cursor: 'move',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: layer.type === 'button' ? 'center' : 'flex-start',
      border: isSelected ? '2px solid #0077ff' : 'none',
      boxSizing: 'border-box'
    };

    return (
      <div
        key={layer.id}
        style={layerStyle}
        onMouseDown={(e) => handleLayerMouseDown(e, layer)}
        className={`layer ${layer.type === 'button' ? 'hover:opacity-80 transition-opacity' : ''}`}
      >
        {layer.type === 'text' && (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            {layer.content}
          </div>
        )}
        {layer.type === 'button' && (
          <button className="w-full h-full">
            {layer.content}
          </button>
        )}
        {layer.type === 'image' && (
          <img 
            src={layer.content} 
            alt="Layer" 
            className="w-full h-full object-cover"
            draggable={false}
          />
        )}
        {layer.type === 'shape' && (
          <Shape
            type={(layer.shapeType || layer.content) as any}
            width={layer.style.width}
            height={layer.style.height}
            backgroundColor={layer.style.backgroundColor || '#000000'}
            borderRadius={layer.style.borderRadius}
          />
        )}
        {isSelected && (
          <>
            {/* Selection handles */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
          </>
        )}
      </div>
    );
  };

  // Render grid
  const renderGrid = () => {
    if (!settings.showGrid) return null;
    
    const gridLines: React.ReactElement[] = [];
    const canvasWidth = 1200;
    const canvasHeight = 600;
    
    // Vertical grid lines
    for (let x = 0; x <= canvasWidth; x += settings.gridSize) {
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
    for (let y = 0; y <= canvasHeight; y += settings.gridSize) {
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
  };

  // Render rulers
  const renderRulers = () => {
    if (!settings.showRulers) return null;
    
    const rulerSize = 30;
    const canvasWidth = 1200;
    const canvasHeight = 600;
    
    return (
      <>
        {/* Horizontal ruler */}
        <div
          className="absolute bg-gray-100 border-b border-gray-300 shadow-sm"
          style={{
            top: `calc(50% - ${(canvasHeight * zoom) / 2}px - ${rulerSize}px)`,
            left: `calc(50% - ${(canvasWidth * zoom) / 2}px)`,
            width: canvasWidth * zoom,
            height: rulerSize,
            fontSize: '10px',
            zIndex: 15
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
                  width: '1px',
                  height: '8px'
                }}
              />
              {/* Number label */}
              <div
                className="absolute text-gray-600 text-xs select-none ruler-text"
                style={{
                  left: i * 50 * zoom - 10,
                  top: 2,
                  fontSize: '10px'
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
                  width: '1px',
                  height: '4px'
                }}
              />
            )
          ))}
        </div>
        
        {/* Vertical ruler */}
        <div
          className="absolute bg-gray-100 border-r border-gray-300 shadow-sm"
          style={{
            top: `calc(50% - ${(canvasHeight * zoom) / 2}px)`,
            left: `calc(50% - ${(canvasWidth * zoom) / 2}px - ${rulerSize}px)`,
            width: rulerSize,
            height: canvasHeight * zoom,
            fontSize: '10px',
            zIndex: 15
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
                  height: '1px',
                  width: '8px'
                }}
              />
              {/* Number label */}
              <div
                className="absolute text-gray-600 text-xs transform -rotate-90 select-none ruler-text origin-center"
                style={{
                  right: 2,
                  top: i * 50 * zoom - 8,
                  fontSize: '10px',
                  width: '20px',
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
                  height: '1px',
                  width: '4px'
                }}
              />
            )
          ))}
        </div>
        
        {/* Corner */}
        <div
          className="absolute bg-gray-200 border-r border-b border-gray-300 shadow-sm flex items-center justify-center"
          style={{
            top: `calc(50% - ${(canvasHeight * zoom) / 2}px - ${rulerSize}px)`,
            left: `calc(50% - ${(canvasWidth * zoom) / 2}px - ${rulerSize}px)`,
            width: rulerSize,
            height: rulerSize,
            zIndex: 16
          }}
        >
          <i className="fas fa-ruler-combined text-gray-500 text-xs"></i>
        </div>
      </>
    );
  };

  // Render alignment guides
  const renderAlignmentGuides = () => {
    if (!dragging || !settings.showGuides) return null;
    
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
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case 'g':
          case 'G':
            e.preventDefault();
            setSettings(prev => ({ ...prev, showGrid: !prev.showGrid }));
            break;
          case 'r':
          case 'R':
            e.preventDefault();
            setSettings(prev => ({ ...prev, showRulers: !prev.showRulers }));
            break;
          case ';':
            e.preventDefault();
            setSettings(prev => ({ ...prev, showGuides: !prev.showGuides }));
            break;
          case 'Shift':
            if (e.shiftKey) {
              e.preventDefault();
              setSettings(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-white rounded-lg shadow-md px-3 py-2">
        <button
          onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
        >
          <i className="fas fa-minus"></i>
        </button>
        <span className="text-sm font-medium flex items-center">
          <i className="fas fa-search mr-1"></i>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Advanced Canvas Controls */}
      <div className="absolute top-4 left-80 z-20 flex items-center space-x-2">
        <button
          onClick={() => setSettings(prev => ({ ...prev, showGrid: !prev.showGrid }))}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.showGrid 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Grid (Ctrl+G)"
        >
          <i className="fas fa-grip-lines mr-1"></i>
          Grid
        </button>
        {settings.showGrid && (
          <CleanDropdown
            value={settings.gridSize.toString()}
            onChange={(value) => setSettings(prev => ({ ...prev, gridSize: parseInt(value) }))}
            options={[
              { value: '10', label: '10px' },
              { value: '20', label: '20px' },
              { value: '25', label: '25px' },
              { value: '50', label: '50px' }
            ]}
            variant="compact"
            className="ml-2"
          />
        )}
        <button
          onClick={() => setSettings(prev => ({ ...prev, showRulers: !prev.showRulers }))}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.showRulers 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Rulers (Ctrl+R)"
        >
          <i className="fas fa-ruler mr-1"></i>
          Rulers
        </button>
        <button
          onClick={() => setSettings(prev => ({ ...prev, showGuides: !prev.showGuides }))}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.showGuides 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Smart Guides (Ctrl+;)"
        >
          <i className="fas fa-crosshairs mr-1"></i>
          Guides
        </button>
        <button
          onClick={() => setSettings(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }))}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.snapToGrid 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Snap to Grid (Ctrl+Shift)"
        >
          <i className="fas fa-magnet mr-1"></i>
          Snap
        </button>
      </div>

      {/* Rulers */}
      {renderRulers()}

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
          {/* Grid */}
          {renderGrid()}

          {/* Navigation Arrows */}
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all z-20">
            <i className="fas fa-chevron-left text-xl text-gray-700"></i>
          </button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all z-20">
            <i className="fas fa-chevron-right text-xl text-gray-700"></i>
          </button>

          {/* Layers */}
          {currentSlide?.layers.map(renderLayer)}

          {/* Alignment guides */}
          {renderAlignmentGuides()}

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
      <div className="absolute bottom-4 right-4 z-20 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-xs">
        <div className="flex items-center space-x-4">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          {settings.showGrid && <span className="text-blue-300">Grid: {settings.gridSize}px</span>}
          {settings.snapToGrid && <span className="text-green-300">Snap: ON</span>}
          {settings.showGuides && <span className="text-pink-300">Guides: ON</span>}
          <span>Slides: {state.project?.slides.length || 0}</span>
        </div>
      </div>
    </div>
  );
}

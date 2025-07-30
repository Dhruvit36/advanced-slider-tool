import React, { useState, useRef, useEffect } from 'react';
import { useSlider } from '../context/SliderContext';
import { CleanDropdown } from './ui/CleanDropdown';

export function Timeline() {
  const { state, dispatch } = useSlider();
  const [isDragging, setIsDragging] = useState(false);
  const [timelineHeight, setTimelineHeight] = useState(128); // Default height in pixels
  const [timelineScale, setTimelineScale] = useState('100%');
  const [isResizing, setIsResizing] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Use global state instead of local state
  const isPlaying = state.isPlaying;
  const currentTime = state.currentTime;
  const currentSlide = state.project?.slides[state.currentSlideIndex];
  const maxTime = currentSlide?.duration || 15000;

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTime;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= maxTime) {
          dispatch({ type: 'SET_CURRENT_TIME', payload: maxTime });
          dispatch({ type: 'SET_PLAYING', payload: false });
          return;
        }
        
        dispatch({ type: 'SET_CURRENT_TIME', payload: elapsed });
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, maxTime]);

  const togglePlayback = () => {
    if (!isPlaying) {
      // If we're at the end (or very close to it), restart from beginning
      if (currentTime >= maxTime - 100) { // 100ms buffer
        dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
      }
      dispatch({ type: 'SET_PLAYING', payload: true });
    } else {
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  };

  const resetTimeline = () => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    dispatch({ type: 'SET_PLAYING', payload: false });
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || isDragging) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (x / width) * maxTime;
    
    dispatch({ type: 'SET_CURRENT_TIME', payload: Math.max(0, Math.min(newTime, maxTime)) });
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dispatch({ type: 'SET_PLAYING', payload: false });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (x / width) * maxTime;
    
    dispatch({ type: 'SET_CURRENT_TIME', payload: Math.max(0, Math.min(newTime, maxTime)) });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, maxTime]);

  // Timeline resize handlers
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newHeight = Math.max(100, Math.min(400, timelineHeight + (e.movementY * -1)));
    setTimelineHeight(newHeight);
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing, timelineHeight]);

  // Keyboard shortcuts for timeline height
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowUp':
            if (e.shiftKey) {
              e.preventDefault();
              setTimelineHeight(prev => Math.min(400, prev + 20));
            }
            break;
          case 'ArrowDown':
            if (e.shiftKey) {
              e.preventDefault();
              setTimelineHeight(prev => Math.max(100, prev - 20));
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return `${seconds.toFixed(1)}s`;
  };

  const getLayerPosition = (layer: any) => {
    const start = layer.animation.delay;
    const duration = layer.animation.duration;
    const startPercent = (start / maxTime) * 100;
    const widthPercent = (duration / maxTime) * 100;
    
    return { left: `${startPercent}%`, width: `${widthPercent}%` };
  };

  return (
    <div 
      className="bg-panel-dark border-t border-border-light flex flex-col flex-shrink-0 relative"
      style={{ height: `${timelineHeight}px` }}
    >
      {/* Resize Handle */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-transparent hover:bg-blue-400 cursor-ns-resize z-30 transition-colors duration-200 ${
          isResizing ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleResizeMouseDown}
        title="Drag to resize timeline"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-400 hover:bg-blue-400 transition-colors duration-200 rounded-b-full flex items-center justify-center">
          <i className="fas fa-grip-lines text-gray-600 hover:text-blue-600" style={{ fontSize: '6px', marginTop: '-2px' }}></i>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 border-b border-border-light">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={togglePlayback}
            className="bg-primary text-white px-2 sm:px-3 py-1 rounded hover:opacity-90 text-sm flex items-center"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} mr-1`}></i>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={resetTimeline}
            className="bg-gray-500 text-white px-2 sm:px-3 py-1 rounded hover:opacity-90 text-sm flex items-center"
          >
            <i className="fas fa-stop mr-1"></i>
            Stop
          </button>
          <span className="text-xs sm:text-sm text-gray-600 flex items-center">
            <i className="fas fa-clock mr-1"></i>
            {formatTime(currentTime)} / {formatTime(maxTime)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2">
            <i className="fas fa-ruler-horizontal text-xs text-gray-500"></i>
            <span className="text-xs text-gray-500">Scale:</span>
            <CleanDropdown
              value={timelineScale}
              onChange={setTimelineScale}
              options={[
                { value: '50%', label: '50%' },
                { value: '75%', label: '75%' },
                { value: '100%', label: '100%' },
                { value: '150%', label: '150%' },
                { value: '200%', label: '200%' }
              ]}
              variant="compact"
            />
          </div>
          <div className="flex items-center space-x-1">
            <i className="fas fa-arrows-alt-v text-xs text-gray-500"></i>
            <span className="text-xs text-gray-500">Height:</span>
            <span className="text-xs text-gray-600 font-mono">{timelineHeight}px</span>
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={() => setTimelineHeight(100)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 100 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Compact (100px)"
              >
                S
              </button>
              <button
                onClick={() => setTimelineHeight(150)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 150 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Medium (150px)"
              >
                M
              </button>
              <button
                onClick={() => setTimelineHeight(200)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 200 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Large (200px)"
              >
                L
              </button>
              <button
                onClick={() => setTimelineHeight(300)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 300 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Extra Large (300px)"
              >
                XL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="flex-1 relative">
        <div
          ref={timelineRef}
          className="h-full bg-gray-100 relative cursor-pointer border-b border-gray-200 select-none overflow-hidden"
          onClick={handleTimelineClick}
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 49px,
              #e5e7eb 49px,
              #e5e7eb 50px
            )`,
            backgroundSize: '50px 100%'
          }}
        >
          {/* Time Markers */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gray-200 border-b border-gray-300">
            {Array.from({ length: Math.ceil(maxTime / 1000) + 1 }, (_, i) => {
              // Calculate equal spacing: distribute markers evenly across 100% width
              const totalMarkers = Math.ceil(maxTime / 1000); // 15 markers (0-14s)
              const position = (i / totalMarkers) * 100; // Equal spacing from 0% to 100%
              
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-gray-400"
                  style={{ left: `${position}%` }}
                >
                  <span className="absolute top-0.5 left-1 text-xs text-gray-600 font-mono flex items-center">
                    <i className="fas fa-clock mr-1" style={{ fontSize: '8px' }}></i>
                    {i}s
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div 
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-red-400 to-red-500 opacity-40 transition-all duration-150 shadow-sm"
            style={{ width: `${(currentTime / maxTime) * 100}%` }}
          >
            {/* Progress indicator icon */}
            <div 
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
              style={{ right: '0px' }}
            >
              <i className="fas fa-play text-red-500" style={{ fontSize: '6px' }}></i>
            </div>
          </div>

          {/* Layer Tracks */}
          <div className="mt-7 space-y-1 p-2" style={{ maxHeight: `${timelineHeight - 80}px` }}>
            {currentSlide?.layers.map((layer, index) => (
              <div key={layer.id} className="relative h-8 bg-white rounded border border-gray-300 shadow-sm overflow-hidden flex-shrink-0 hover:shadow-md transition-shadow">
                <div className="absolute left-2 top-1.5 text-xs text-gray-600 z-10 font-medium flex items-center">
                  <i className={`fas ${
                    layer.type === 'text' ? 'fa-font' :
                    layer.type === 'button' ? 'fa-hand-pointer' :
                    layer.type === 'image' ? 'fa-image' :
                    'fa-shapes'
                  } mr-1`} style={{ 
                    color: layer.type === 'text' ? '#3b82f6' : 
                           layer.type === 'button' ? '#10b981' : 
                           layer.type === 'image' ? '#8b5cf6' : '#f59e0b',
                    fontSize: '10px'
                  }}></i>
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{
                    backgroundColor: layer.type === 'text' ? '#3b82f6' : 
                                   layer.type === 'button' ? '#10b981' : 
                                   layer.type === 'image' ? '#8b5cf6' : '#f59e0b'
                  }} />
                  {layer.type}: {layer.content.slice(0, 12)}...
                </div>
                
                {/* Animation Bar */}
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded opacity-70 transition-all duration-200 hover:opacity-90"
                  style={getLayerPosition(layer)}
                >
                  {/* Animation type indicator */}
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white">
                    <i className="fas fa-magic" style={{ fontSize: '8px' }}></i>
                  </div>
                </div>
                
                {/* Animation Start Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-green-500 rounded-l z-20 flex items-center justify-center"
                  style={{ left: `${(layer.animation.delay / maxTime) * 100}%` }}
                  title={`Start: ${layer.animation.delay}ms`}
                >
                  <i className="fas fa-play text-white" style={{ fontSize: '4px' }}></i>
                </div>
                
                {/* Animation End Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-red-500 rounded-r z-20 flex items-center justify-center"
                  style={{ 
                    left: `${((layer.animation.delay + layer.animation.duration) / maxTime) * 100}%` 
                  }}
                  title={`End: ${layer.animation.delay + layer.animation.duration}ms`}
                >
                  <i className="fas fa-stop text-white" style={{ fontSize: '4px' }}></i>
                </div>
              </div>
            ))}
            
            {/* Empty state when no layers */}
            {(!currentSlide?.layers || currentSlide.layers.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">
                  <i className="fas fa-layer-group"></i>
                </div>
                <p className="text-sm">No layers yet</p>
                <p className="text-xs text-gray-400">Add some elements to see them here</p>
              </div>
            )}
          </div>

          {/* Playhead Line */}
          <div
            className="absolute top-6 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none shadow-sm"
            style={{ left: `calc(${(currentTime / maxTime) * 100}% - 1px)` }}
          >
            {/* Playhead line indicator */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
              <i className="fas fa-caret-down text-red-500" style={{ fontSize: '8px' }}></i>
            </div>
          </div>
          
          {/* Playhead Handle - Enhanced design with smooth dragging */}
          <div
            ref={playheadRef}
            className={`absolute top-0 bottom-0 z-40 group transition-transform duration-150 ${
              isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:cursor-grab hover:scale-105'
            }`}
            style={{ 
              left: `calc(${(currentTime / maxTime) * 100}% - 8px)`,
              width: '16px'
            }}
            onMouseDown={handlePlayheadMouseDown}
          >
            {/* Playhead Top Handle - Rounded marker with icon */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className={`w-4 h-4 bg-red-500 border-2 border-white shadow-lg rounded-full transition-all duration-150 flex items-center justify-center ${
                isDragging ? 'scale-125 brightness-110' : 'group-hover:scale-110 group-hover:brightness-105'
              }`} 
              style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))'
              }}>
                <i className="fas fa-grip-lines-vertical text-white" style={{ fontSize: '4px' }}></i>
              </div>
            </div>
            
            {/* Time Tooltip - Shows during dragging */}
            {isDragging && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-40 animate-fadeIn flex items-center">
                <i className="fas fa-clock mr-1" style={{ fontSize: '8px' }}></i>
                {formatTime(currentTime)}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

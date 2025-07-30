import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSlider } from '../context/SliderContext';
import { TimelineControls } from './timeline/TimelineControls';
import { LayersPanel } from './timeline/LayersPanel';
import { TimelineMarkers } from './timeline/TimelineMarkers';
import { AnimationBlock } from './timeline/AnimationBlock';
import { Layer, Slide } from '../types';

export function Timeline() {
  const { state, dispatch } = useSlider();
  const [timelineHeight, setTimelineHeight] = useState(128);
  const [timelineScale, setTimelineScale] = useState('100%');
  const [isResizing, setIsResizing] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const timelineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Use global state
  const isPlaying = state.isPlaying;
  const currentTime = state.currentTime;
  const currentSlide: Slide | undefined = state.project?.slides[state.currentSlideIndex];
  
  const maxTime = useMemo(() => {
    return currentSlide?.duration || 15000;
  }, [currentSlide?.duration]);

  // Animation loop
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
  }, [isPlaying, maxTime, currentTime, dispatch]);

  // Timeline controls
  const togglePlayback = () => {
    if (!isPlaying) {
      if (currentTime >= maxTime - 100) {
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

  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return `${seconds.toFixed(1)}s`;
  };

  // Timeline click handler - Allow clicks to set timeline position
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const target = e.target as HTMLElement;
    // Check if click was on an animation block or track
    if (target.closest('[data-animation-block]') || target.closest('[data-animation-track]')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (x / width) * maxTime;
    
    dispatch({ type: 'SET_CURRENT_TIME', payload: Math.max(0, Math.min(newTime, maxTime)) });
    // Stop playback when manually clicking timeline
    dispatch({ type: 'SET_PLAYING', payload: false });
  };

  // Layer position calculation
  const getLayerPosition = (layer: Layer) => {
    const start = Math.max(0, Math.min(layer.animation.delay, maxTime));
    const duration = Math.max(100, Math.min(layer.animation.duration, maxTime - start));
    const startPercent = Math.max(0, Math.min((start / maxTime) * 100, 100));
    const widthPercent = Math.max(0, Math.min((duration / maxTime) * 100, 100 - startPercent));
    
    return { left: `${startPercent}%`, width: `${widthPercent}%` };
  };

  // Tooltip handlers
  const handleMouseEnter = (e: React.MouseEvent, layerId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredLayer(layerId);
  };

  const handleMouseLeave = () => {
    setHoveredLayer(null);
  };

  // Update layer animation properties
  const updateLayerAnimation = (layerId: string, updates: { delay?: number; duration?: number }) => {
    if (!currentSlide) return;
    
    dispatch({
      type: 'UPDATE_LAYER',
      payload: {
        slideId: currentSlide.id,
        layerId,
        updates: {
          animation: {
            ...currentSlide.layers.find(l => l.id === layerId)?.animation,
            ...updates
          }
        }
      }
    });
  };

  // Handle layer selection
  const handleSelectLayer = (layerId: string) => {
    dispatch({ type: 'SELECT_LAYER', payload: layerId });
  };

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

  // Memoized grid lines
  const timelineGridLines = useMemo(() => {
    const stableMaxTime = 15000;
    return Array.from({ length: Math.ceil(stableMaxTime / 1000) }, (_, i) => (
      <div
        key={`grid-${i}`}
        className="absolute top-0 bottom-0 w-px bg-gray-400"
        style={{ left: `${(i / Math.ceil(stableMaxTime / 1000)) * 100}%` }}
      />
    ));
  }, []);

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
      <TimelineControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        maxTime={maxTime}
        timelineHeight={timelineHeight}
        timelineScale={timelineScale}
        onTogglePlayback={togglePlayback}
        onReset={resetTimeline}
        onHeightChange={setTimelineHeight}
        onScaleChange={setTimelineScale}
        formatTime={formatTime}
      />

      {/* Timeline Track */}
      <div className="flex-1 relative flex">
        {/* Left Panel - Layer Information */}
        <LayersPanel 
          layers={currentSlide?.layers || []} 
          timelineHeight={timelineHeight} 
        />

        {/* Right Panel - Timeline Tracks */}
        <div className="flex-1 relative overflow-hidden" data-timeline-container>
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
            {/* Timeline Markers Background */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-200 border-b border-gray-300">
              <TimelineMarkers />
            </div>
            
            {/* Spacer for timeline markers */}
            <div className="h-6"></div>

            {/* Animation Tracks */}
            <div className="space-y-0 overflow-visible" style={{ maxHeight: `${timelineHeight - 80}px`, overflowY: 'auto' }}>
              {currentSlide?.layers.map((layer) => (
                <div 
                  key={layer.id} 
                  className="h-10 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 relative overflow-visible"
                  onClick={(e) => e.stopPropagation()}
                  data-animation-track
                >
                  <AnimationBlock
                    layer={layer}
                    position={getLayerPosition(layer)}
                    maxTime={maxTime}
                    isSelected={state.selectedLayerId === layer.id}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onUpdateAnimation={updateLayerAnimation}
                    onSelectLayer={handleSelectLayer}
                  />
                  
                  {/* Timeline grid lines for reference */}
                  <div className="absolute inset-0 pointer-events-none opacity-10">
                    {timelineGridLines}
                  </div>
                </div>
              ))}
              
              {/* Empty state for timeline tracks */}
              {(!currentSlide?.layers || currentSlide.layers.length === 0) && (
                <div 
                  className="text-center text-gray-500 py-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs text-gray-400">Timeline tracks will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredLayer && currentSlide && (
        <div 
          className="fixed pointer-events-none z-[9999]"
          style={{ 
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-slate-800 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-600 min-w-max">
            <div className="text-sm font-semibold text-white mb-2 flex items-center">
              <i className="fas fa-magic mr-2 text-blue-300"></i>
              {currentSlide.layers.find(l => l.id === hoveredLayer)?.animation.entrance}
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex justify-between items-center space-x-6">
                <span className="text-slate-400">Layer</span>
                <span className="font-medium text-white">
                  {currentSlide.layers.find(l => l.id === hoveredLayer)?.content.slice(0, 18)}
                </span>
              </div>
              <div className="flex justify-between items-center space-x-6">
                <span className="text-slate-400">Start</span>
                <span className="font-mono text-blue-300">
                  {((currentSlide.layers.find(l => l.id === hoveredLayer)?.animation.delay || 0) / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center space-x-6">
                <span className="text-slate-400">Duration</span>
                <span className="font-mono text-green-300">
                  {((currentSlide.layers.find(l => l.id === hoveredLayer)?.animation.duration || 0) / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center space-x-6">
                <span className="text-slate-400">End</span>
                <span className="font-mono text-purple-300">
                  {(((currentSlide.layers.find(l => l.id === hoveredLayer)?.animation.delay || 0) + 
                     (currentSlide.layers.find(l => l.id === hoveredLayer)?.animation.duration || 0)) / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

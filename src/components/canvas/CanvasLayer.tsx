import React from 'react';
import { Layer } from '../../types';
import { Shape } from '../Shape';
import { AnimationState } from '../../hooks/useCanvasAnimations';

interface CanvasLayerProps {
  layer: Layer;
  zoom: number;
  isSelected: boolean;
  isPreviewMode: boolean;
  animationState?: { isAnimating: boolean; currentAnimation: 'entrance' | 'exit' | null };
  isDragging: boolean;
  getAnimationClassName: (animationName: string) => string;
  onMouseDown: (e: React.MouseEvent, layer: Layer) => void;
}

export function CanvasLayer({
  layer,
  zoom,
  isSelected,
  isPreviewMode,
  animationState,
  isDragging,
  getAnimationClassName,
  onMouseDown
}: CanvasLayerProps) {
  // Build animation class names
  let animationClasses = '';
  if (animationState?.isAnimating && animationState.currentAnimation) {
    const animationName = animationState.currentAnimation === 'entrance' 
      ? layer.animation.entrance 
      : layer.animation.exit;
    animationClasses = getAnimationClassName(animationName);
  }
  
  // In preview mode, hide layers initially and show them during their entrance animation
  const shouldShow = !isPreviewMode || 
                    (animationState?.isAnimating && animationState.currentAnimation === 'entrance') ||
                    (animationState?.currentAnimation === null && isPreviewMode);
  
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
    opacity: shouldShow ? layer.style.opacity : 0,
    transform: `rotate(${layer.style.rotation}deg)`,
    zIndex: layer.style.zIndex,
    cursor: isDragging ? 'grabbing' : 'move',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: layer.type === 'button' ? 'center' : 'flex-start',
    border: isSelected && !isPreviewMode ? '2px solid #0077ff' : 'none',
    boxSizing: 'border-box',
    animationDuration: `${layer.animation.duration}ms`,
    animationDelay: isPreviewMode ? `${layer.animation.delay}ms` : '0ms',
    animationFillMode: 'forwards',
    animationTimingFunction: layer.animation.easing
  };

  return (
    <div
      key={layer.id}
      style={layerStyle}
      onMouseDown={(e) => !isPreviewMode && onMouseDown(e, layer)}
      className={`layer ${animationClasses} ${layer.type === 'button' ? 'hover:opacity-80 transition-opacity' : ''}`}
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
}

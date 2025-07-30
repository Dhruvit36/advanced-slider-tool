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
  // Build animation class names and custom styles
  let animationClasses = '';
  let customAnimationStyle: React.CSSProperties = {};
  
  if (animationState?.isAnimating && animationState.currentAnimation) {
    const animationName = animationState.currentAnimation === 'entrance' 
      ? layer.animation.entrance 
      : layer.animation.exit;
    animationClasses = getAnimationClassName(animationName);
    
    // Override CSS animation properties with layer-specific values
    customAnimationStyle = {
      animationDuration: `${layer.animation.duration}ms`,
      animationDelay: isPreviewMode ? `${layer.animation.delay}ms` : '0ms',
      animationTimingFunction: layer.animation.easing,
      animationFillMode: 'forwards'
    };
  }
  
  // In preview mode, handle layer visibility based on animation timing
  let shouldShow = true;
  if (isPreviewMode) {
    if (animationState?.isAnimating && animationState.currentAnimation === 'entrance') {
      // Currently animating entrance - show with animation
      shouldShow = true;
    } else if (animationState?.currentAnimation === null && animationState?.isAnimating === false) {
      // Animation has finished or not started yet - show static
      shouldShow = true;
    } else {
      // Before animation starts - hide
      shouldShow = false;
    }
  }
  
  // Helper function to build text decoration string
  const buildTextDecoration = (style: Layer['style']) => {
    const decorations: string[] = [];
    
    if (style.underlineOptions?.style && style.underlineOptions.style !== 'none') {
      decorations.push('underline');
    }
    
    if (style.strikethroughOptions?.style && style.strikethroughOptions.style !== 'none') {
      decorations.push('line-through');
    }
    
    return decorations.length > 0 ? decorations.join(' ') : 'none';
  };

  // Helper function to build transform string including character scaling
  const buildTransform = (style: Layer['style'], zoom: number) => {
    const transforms: string[] = [];
    
    // Base rotation
    transforms.push(`rotate(${style.rotation}deg)`);
    
    // Character scaling (horizontal and vertical scale)
    if (style.horizontalScale && style.horizontalScale !== 100) {
      const hScale = style.horizontalScale / 100;
      transforms.push(`scaleX(${hScale})`);
    }
    
    if (style.verticalScale && style.verticalScale !== 100) {
      const vScale = style.verticalScale / 100;
      transforms.push(`scaleY(${vScale})`);
    }
    
    // Character rotation (individual character rotation)
    if (style.characterRotation && style.characterRotation !== 0) {
      transforms.push(`rotate(${style.characterRotation}deg)`);
    }
    
    return transforms.join(' ');
  };

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    left: layer.style.x * zoom,
    top: layer.style.y * zoom,
    width: layer.style.width * zoom,
    height: layer.style.height * zoom,
    // Basic typography
    fontFamily: layer.style.fontFamily,
    fontSize: layer.style.fontSize ? layer.style.fontSize * zoom : undefined,
    fontWeight: layer.style.fontWeight,
    fontStyle: layer.style.fontStyle,
    color: layer.style.color,
    backgroundColor: layer.style.backgroundColor,
    // Text alignment and spacing
    textAlign: layer.style.textAlign,
    lineHeight: layer.style.lineHeight,
    letterSpacing: layer.style.letterSpacing ? `${layer.style.letterSpacing * zoom}px` : 
                   layer.style.characterSpacing ? `${layer.style.characterSpacing * zoom / 100}px` : undefined,
    wordSpacing: layer.style.wordSpacing ? `${layer.style.wordSpacing * zoom}px` : undefined,
    // Text decoration and transform
    textDecoration: buildTextDecoration(layer.style),
    textTransform: layer.style.textTransform,
    // Character position (superscript/subscript)
    verticalAlign: layer.style.position === 'superscript' ? 'super' : 
                   layer.style.position === 'subscript' ? 'sub' : 'baseline',
    // Baseline shift
    transform: buildTransform(layer.style, zoom),
    // Appearance
    borderRadius: layer.style.borderRadius ? layer.style.borderRadius * zoom : undefined,
    opacity: shouldShow ? layer.style.opacity : 0,
    zIndex: layer.style.zIndex,
    // CSS features for advanced typography
    fontVariant: layer.style.caps === 'small-caps' ? 'small-caps' : 
                 layer.style.caps === 'all-small-caps' ? 'all-small-caps' : 'normal',
    textRendering: 'optimizeLegibility',
    fontKerning: layer.style.kerning === 'auto' ? 'auto' : 
                 layer.style.kerning === 'optical' ? 'auto' :
                 layer.style.kerning === 'metrics' ? 'normal' : 'none',
    // Layout
    cursor: isDragging ? 'grabbing' : 'move',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: layer.type === 'button' ? 'center' : 
                    layer.style.textAlign === 'center' ? 'center' :
                    layer.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
    border: isSelected && !isPreviewMode ? '2px solid #0077ff' : 'none',
    boxSizing: 'border-box',
    ...customAnimationStyle
  };

  return (
    <div
      key={layer.id}
      style={layerStyle}
      onMouseDown={(e) => !isPreviewMode && onMouseDown(e, layer)}
      className={`layer ${animationClasses} ${layer.type === 'button' ? 'hover:opacity-80 transition-opacity' : ''}`}
    >
      {layer.type === 'text' && (
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            overflow: 'hidden',
            // Apply baseline shift if specified
            ...(layer.style.baseline && layer.style.baseline !== 0 ? {
              transform: `translateY(${-layer.style.baseline * zoom}px)`
            } : {}),
            // Apply text transform based on caps setting
            textTransform: layer.style.caps === 'caps' ? 'uppercase' :
                          layer.style.caps === 'all-small-caps' ? 'uppercase' :
                          layer.style.caps === 'unicase' ? 'uppercase' :
                          layer.style.textTransform || 'none'
          }}
        >
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

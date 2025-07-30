import { useState } from 'react';
import { Layer } from '../types';

export interface AnimationState {
  [layerId: string]: {
    isAnimating: boolean;
    currentAnimation: 'entrance' | 'exit' | null;
  };
}

export function useCanvasAnimations() {
  const [animationStates, setAnimationStates] = useState<AnimationState>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const getAnimationClassName = (animationName: string) => {
    return animationName.toLowerCase().replace(/\s+/g, '-');
  };

  const previewLayerAnimation = (layer: Layer, animationType: 'entrance' | 'exit') => {
    const animationName = animationType === 'entrance' ? layer.animation.entrance : layer.animation.exit;
    
    setAnimationStates(prev => ({
      ...prev,
      [layer.id]: {
        isAnimating: true,
        currentAnimation: animationType
      }
    }));

    // Reset animation after completion
    setTimeout(() => {
      setAnimationStates(prev => ({
        ...prev,
        [layer.id]: {
          isAnimating: false,
          currentAnimation: null
        }
      }));
    }, layer.animation.duration + layer.animation.delay);
  };

  const previewAllAnimations = (layers: Layer[]) => {
    if (!layers.length) return;
    
    setIsPreviewMode(true);
    
    // Sort layers by delay for proper animation sequence
    const sortedLayers = [...layers].sort((a, b) => a.animation.delay - b.animation.delay);
    
    sortedLayers.forEach((layer) => {
      setTimeout(() => {
        previewLayerAnimation(layer, 'entrance');
      }, layer.animation.delay);
    });

    // Reset preview mode after all animations complete
    const maxDuration = Math.max(...sortedLayers.map(l => l.animation.delay + l.animation.duration));
    setTimeout(() => {
      setIsPreviewMode(false);
    }, maxDuration + 500);
  };

  return {
    animationStates,
    isPreviewMode,
    getAnimationClassName,
    previewLayerAnimation,
    previewAllAnimations
  };
}

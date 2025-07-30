import { useState, useCallback } from 'react';
import { Layer } from '../types';
import { getAnimationClassName as getAnimationClass } from '../utils/animationMapper';

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
    return getAnimationClass(animationName);
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
    
    // Reset all animation states first
    setAnimationStates({});
    
    // Sort layers by delay for proper animation sequence
    const sortedLayers = [...layers].sort((a, b) => a.animation.delay - b.animation.delay);
    
    // Trigger entrance animations with proper timing
    sortedLayers.forEach((layer) => {
      setTimeout(() => {
        setAnimationStates(prev => ({
          ...prev,
          [layer.id]: {
            isAnimating: true,
            currentAnimation: 'entrance'
          }
        }));
        
        // Reset this layer's animation after its duration
        setTimeout(() => {
          setAnimationStates(prev => ({
            ...prev,
            [layer.id]: {
              isAnimating: false,
              currentAnimation: null
            }
          }));
        }, layer.animation.duration);
        
      }, layer.animation.delay);
    });

    // Reset preview mode after all animations complete
    const maxDuration = Math.max(...sortedLayers.map(l => l.animation.delay + l.animation.duration));
    setTimeout(() => {
      setIsPreviewMode(false);
      setAnimationStates({});
    }, maxDuration + 200);
  };

  const syncWithTimeline = useCallback((currentTime: number, layers: Layer[], isPlaying: boolean) => {
    if (!isPlaying) {
      // When not playing (manual scrubbing), show static states without animations
      setAnimationStates(prev => Object.keys(prev).length > 0 ? {} : prev);
      setIsPreviewMode(false);
      return;
    }
    
    // Only show animations and preview mode when actively playing
    setIsPreviewMode(true);
    const newStates: AnimationState = {};
    
    layers.forEach(layer => {
      const { delay, duration } = layer.animation;
      const layerStartTime = delay;
      const layerEndTime = delay + duration;
      
      if (currentTime >= layerStartTime && currentTime <= layerEndTime) {
        newStates[layer.id] = {
          isAnimating: true,
          currentAnimation: 'entrance'
        };
      } else if (currentTime < layerStartTime) {
        // Before animation starts - layer should be hidden
        newStates[layer.id] = {
          isAnimating: false,
          currentAnimation: null
        };
      } else {
        // After animation ends - layer should be visible and static
        newStates[layer.id] = {
          isAnimating: false,
          currentAnimation: null
        };
      }
    });
    
    // Only update if states have actually changed
    setAnimationStates(prev => {
      const hasChanged = Object.keys(newStates).some(id => 
        !prev[id] || 
        prev[id].isAnimating !== newStates[id].isAnimating ||
        prev[id].currentAnimation !== newStates[id].currentAnimation
      ) || Object.keys(prev).length !== Object.keys(newStates).length;
      
      return hasChanged ? newStates : prev;
    });
  }, []);

  return {
    animationStates,
    isPreviewMode,
    getAnimationClassName,
    previewLayerAnimation,
    previewAllAnimations,
    syncWithTimeline
  };
}

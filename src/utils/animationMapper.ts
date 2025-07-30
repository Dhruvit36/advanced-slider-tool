import { animationPresets } from './animations';

// Map animation names to CSS classes
export const animationClassMap: Record<string, string> = {
  // Entrance animations
  'Fade In': 'fade-in',
  'Slide In Left': 'slide-in-left',
  'Slide In Right': 'slide-in-right',
  'Slide In Up': 'slide-in-up',
  'Slide In Down': 'slide-in-down',
  'Scale In': 'scale-in',
  'Scale In Big': 'scale-in-big',
  'Bounce In': 'bounce-in',
  'Zoom In': 'zoom-in',
  'Flip In X': 'flip-in-x',
  'Flip In Y': 'flip-in-y',
  'Rotate In': 'rotate-in',
  
  // Exit animations
  'Fade Out': 'fade-out',
  'Slide Out Left': 'slide-out-left',
  'Slide Out Right': 'slide-out-right',
  'Slide Out Up': 'slide-out-up',
  'Slide Out Down': 'slide-out-down',
  'Scale Out': 'scale-out',
  'Scale Out Big': 'scale-out-big',
  'Bounce Out': 'bounce-out',
  'Zoom Out': 'zoom-out',
  'Flip Out X': 'flip-out-x',
  'Flip Out Y': 'flip-out-y',
  'Rotate Out': 'rotate-out'
};

// Generate CSS from animation presets
export function generateAnimationCSS(): string {
  let css = '';
  
  for (const preset of animationPresets) {
    const className = animationClassMap[preset.name];
    if (!className) continue;
    
    const animationName = className.replace(/^(.*?)$/, '$1-keyframes');
    
    // Add keyframes
    css += `
@keyframes ${animationName} {
${preset.keyframes}
}

`;
    
    // Add utility class
    css += `
.${className} {
  animation: ${animationName} ${preset.duration}ms ${preset.easing} forwards;
}

`;
  }
  
  return css;
}

// Get CSS class name for an animation
export function getAnimationClassName(animationName: string): string {
  return animationClassMap[animationName] || '';
}

// Get all available animation names
export function getAvailableAnimations(type?: 'entrance' | 'exit'): string[] {
  if (type) {
    return animationPresets
      .filter(preset => preset.type === type)
      .map(preset => preset.name);
  }
  return animationPresets.map(preset => preset.name);
}

// Check if an animation exists
export function isValidAnimation(animationName: string): boolean {
  return animationName in animationClassMap;
}

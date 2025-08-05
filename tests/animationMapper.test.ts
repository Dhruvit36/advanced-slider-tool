import { describe, it, expect } from 'vitest';
import {
  getAnimationClassName,
  getAvailableAnimations,
  isValidAnimation,
  generateAnimationCSS,
} from '../src/utils/animationMapper';

describe('animationMapper utilities', () => {
  it('returns the correct class name for a known animation', () => {
    expect(getAnimationClassName('Fade In')).toBe('fade-in');
  });

  it('validates whether an animation exists', () => {
    expect(isValidAnimation('Fade In')).toBe(true);
    expect(isValidAnimation('Unknown Animation')).toBe(false);
  });

  it('lists available entrance animations', () => {
    const entranceAnimations = getAvailableAnimations('entrance');
    expect(entranceAnimations).toContain('Fade In');
    expect(entranceAnimations).not.toContain('Fade Out');
  });

  it('generates CSS containing keyframes and utility classes', () => {
    const css = generateAnimationCSS();
    expect(css).toContain('@keyframes fade-in-keyframes');
    expect(css).toContain('.fade-in');
  });
});

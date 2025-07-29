import { AnimationPreset } from '../types';

export const animationPresets: AnimationPreset[] = [
  // Entrance Animations
  {
    name: 'Fade In',
    type: 'entrance',
    keyframes: `
      from { opacity: 0; }
      to { opacity: 1; }
    `,
    duration: 600,
    easing: 'ease-out'
  },
  {
    name: 'Slide In Left',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: translateX(-100px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  {
    name: 'Slide In Right',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: translateX(100px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  {
    name: 'Slide In Up',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: translateY(50px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  {
    name: 'Slide In Down',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: translateY(-50px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  {
    name: 'Scale In',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: scale(0.8); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  {
    name: 'Scale In Big',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: scale(1.3); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  {
    name: 'Rotate In',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: rotate(-10deg) scale(0.9); 
      }
      to { 
        opacity: 1; 
        transform: rotate(0deg) scale(1); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  {
    name: 'Flip In X',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: perspective(400px) rotateX(-90deg); 
      }
      to { 
        opacity: 1; 
        transform: perspective(400px) rotateX(0deg); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  {
    name: 'Flip In Y',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: perspective(400px) rotateY(-90deg); 
      }
      to { 
        opacity: 1; 
        transform: perspective(400px) rotateY(0deg); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  {
    name: 'Bounce In',
    type: 'entrance',
    keyframes: `
      0% {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
      }
      20% {
        transform: scale3d(1.1, 1.1, 1.1);
      }
      40% {
        transform: scale3d(0.9, 0.9, 0.9);
      }
      60% {
        opacity: 1;
        transform: scale3d(1.03, 1.03, 1.03);
      }
      80% {
        transform: scale3d(0.97, 0.97, 0.97);
      }
      100% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    `,
    duration: 1000,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  },
  {
    name: 'Zoom In',
    type: 'entrance',
    keyframes: `
      from { 
        opacity: 0; 
        transform: scale3d(0.1, 0.1, 0.1); 
      }
      50% {
        opacity: 1;
      }
      to { 
        transform: scale3d(1, 1, 1); 
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
  },
  
  // Exit Animations
  {
    name: 'Fade Out',
    type: 'exit',
    keyframes: `
      from { opacity: 1; }
      to { opacity: 0; }
    `,
    duration: 400,
    easing: 'ease-in'
  },
  {
    name: 'Slide Out Left',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
        transform: translateX(0); 
      }
      to { 
        opacity: 0; 
        transform: translateX(-100px); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  },
  {
    name: 'Slide Out Right',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
        transform: translateX(0); 
      }
      to { 
        opacity: 0; 
        transform: translateX(100px); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  },
  {
    name: 'Slide Out Up',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
        transform: translateY(0); 
      }
      to { 
        opacity: 0; 
        transform: translateY(-50px); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  },
  {
    name: 'Slide Out Down',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
        transform: translateY(0); 
      }
      to { 
        opacity: 0; 
        transform: translateY(50px); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  },
  {
    name: 'Scale Out',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
        transform: scale(1); 
      }
      to { 
        opacity: 0; 
        transform: scale(0.8); 
      }
    `,
    duration: 400,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  },
  {
    name: 'Zoom Out',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
      }
      50% {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
      }
      to { 
        opacity: 0;
        transform: scale3d(0.1, 0.1, 0.1); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
  },
  {
    name: 'Rotate Out',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
        transform: rotate(0deg) scale(1); 
      }
      to { 
        opacity: 0; 
        transform: rotate(10deg) scale(0.9); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  },
  {
    name: 'Flip Out X',
    type: 'exit',
    keyframes: `
      from { 
        opacity: 1; 
        transform: perspective(400px) rotateX(0deg); 
      }
      to { 
        opacity: 0; 
        transform: perspective(400px) rotateX(90deg); 
      }
    `,
    duration: 600,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  },
  {
    name: 'Bounce Out',
    type: 'exit',
    keyframes: `
      20% {
        transform: scale3d(0.9, 0.9, 0.9);
      }
      50%, 55% {
        opacity: 1;
        transform: scale3d(1.1, 1.1, 1.1);
      }
      100% {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
      }
    `,
    duration: 800,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  }
];

export const getAnimationCSS = (preset: AnimationPreset, name: string): string => {
  return `
    @keyframes ${name} {
      ${preset.keyframes}
    }
    
    .${name} {
      animation: ${name} ${preset.duration}ms ${preset.easing} forwards;
    }
  `;
};

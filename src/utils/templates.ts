import { Slide } from '../types';

export const slideTemplates: Slide[] = [
  {
    id: 'template-hero',
    name: 'Hero Section',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    layers: [
      {
        id: 'hero-title',
        type: 'text',
        content: 'Welcome to Our Amazing Service',
        style: {
          x: 100,
          y: 150,
          width: 800,
          height: 100,
          fontSize: 56,
          fontWeight: 'bold',
          color: '#ffffff',
          opacity: 1,
          rotation: 0,
          zIndex: 1
        },
        animation: {
          entrance: 'Slide In Left',
          exit: 'Fade Out',
          duration: 1000,
          delay: 200,
          easing: 'ease-out'
        }
      },
      {
        id: 'hero-subtitle',
        type: 'text',
        content: 'Create stunning presentations with our powerful editor',
        style: {
          x: 100,
          y: 270,
          width: 700,
          height: 60,
          fontSize: 28,
          fontWeight: 'normal',
          color: '#e0e0e0',
          opacity: 1,
          rotation: 0,
          zIndex: 2
        },
        animation: {
          entrance: 'Slide In Left',
          exit: 'Fade Out',
          duration: 1000,
          delay: 600,
          easing: 'ease-out'
        }
      },
      {
        id: 'hero-button',
        type: 'button',
        content: 'Get Started Now',
        style: {
          x: 100,
          y: 380,
          width: 200,
          height: 60,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: '#ff6b6b',
          borderRadius: 30,
          opacity: 1,
          rotation: 0,
          zIndex: 3
        },
        animation: {
          entrance: 'Scale In',
          exit: 'Scale Out',
          duration: 800,
          delay: 1000,
          easing: 'ease-out'
        }
      }
    ],
    duration: 15000
  },
  {
    id: 'template-features',
    name: 'Features Showcase',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    layers: [
      {
        id: 'features-title',
        type: 'text',
        content: 'Powerful Features',
        style: {
          x: 150,
          y: 100,
          width: 600,
          height: 80,
          fontSize: 48,
          fontWeight: 'bold',
          color: '#ffffff',
          opacity: 1,
          rotation: 0,
          zIndex: 1
        },
        animation: {
          entrance: 'Slide In Up',
          exit: 'Fade Out',
          duration: 800,
          delay: 0,
          easing: 'ease-out'
        }
      },
      {
        id: 'feature-1',
        type: 'text',
        content: '✨ Drag & Drop Editor',
        style: {
          x: 150,
          y: 220,
          width: 400,
          height: 50,
          fontSize: 24,
          fontWeight: 'normal',
          color: '#ffffff',
          opacity: 1,
          rotation: 0,
          zIndex: 2
        },
        animation: {
          entrance: 'Slide In Left',
          exit: 'Fade Out',
          duration: 600,
          delay: 300,
          easing: 'ease-out'
        }
      },
      {
        id: 'feature-2',
        type: 'text',
        content: '🎨 Beautiful Animations',
        style: {
          x: 150,
          y: 290,
          width: 400,
          height: 50,
          fontSize: 24,
          fontWeight: 'normal',
          color: '#ffffff',
          opacity: 1,
          rotation: 0,
          zIndex: 3
        },
        animation: {
          entrance: 'Slide In Left',
          exit: 'Fade Out',
          duration: 600,
          delay: 600,
          easing: 'ease-out'
        }
      },
      {
        id: 'feature-3',
        type: 'text',
        content: '📱 Responsive Design',
        style: {
          x: 150,
          y: 360,
          width: 400,
          height: 50,
          fontSize: 24,
          fontWeight: 'normal',
          color: '#ffffff',
          opacity: 1,
          rotation: 0,
          zIndex: 4
        },
        animation: {
          entrance: 'Slide In Left',
          exit: 'Fade Out',
          duration: 600,
          delay: 900,
          easing: 'ease-out'
        }
      }
    ],
    duration: 15000
  },
  {
    id: 'template-cta',
    name: 'Call to Action',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    layers: [
      {
        id: 'cta-title',
        type: 'text',
        content: 'Ready to Get Started?',
        style: {
          x: 200,
          y: 180,
          width: 600,
          height: 80,
          fontSize: 42,
          fontWeight: 'bold',
          color: '#ffffff',
          opacity: 1,
          rotation: 0,
          zIndex: 1
        },
        animation: {
          entrance: 'Rotate In',
          exit: 'Fade Out',
          duration: 1000,
          delay: 0,
          easing: 'ease-out'
        }
      },
      {
        id: 'cta-text',
        type: 'text',
        content: 'Join thousands of creators building amazing presentations',
        style: {
          x: 250,
          y: 280,
          width: 500,
          height: 60,
          fontSize: 20,
          fontWeight: 'normal',
          color: '#f0f9ff',
          opacity: 1,
          rotation: 0,
          zIndex: 2
        },
        animation: {
          entrance: 'Fade In',
          exit: 'Fade Out',
          duration: 800,
          delay: 500,
          easing: 'ease-out'
        }
      },
      {
        id: 'cta-button-1',
        type: 'button',
        content: 'Start Free Trial',
        style: {
          x: 320,
          y: 380,
          width: 180,
          height: 50,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: '#10b981',
          borderRadius: 25,
          opacity: 1,
          rotation: 0,
          zIndex: 3
        },
        animation: {
          entrance: 'Scale In',
          exit: 'Scale Out',
          duration: 600,
          delay: 800,
          easing: 'ease-out'
        }
      },
      {
        id: 'cta-button-2',
        type: 'button',
        content: 'Learn More',
        style: {
          x: 520,
          y: 380,
          width: 140,
          height: 50,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0891b2',
          backgroundColor: '#ffffff',
          borderRadius: 25,
          opacity: 1,
          rotation: 0,
          zIndex: 4
        },
        animation: {
          entrance: 'Scale In',
          exit: 'Scale Out',
          duration: 600,
          delay: 1000,
          easing: 'ease-out'
        }
      }
    ],
    duration: 15000
  }
];

export function useTemplateManager() {
  const applyTemplate = (templateId: string): Slide | null => {
    const template = slideTemplates.find(t => t.id === templateId);
    if (!template) return null;
    
    return {
      ...template,
      id: Date.now().toString(), // Generate new ID for the actual slide
      name: `${template.name} Copy`
    };
  };

  return {
    templates: slideTemplates,
    applyTemplate
  };
}

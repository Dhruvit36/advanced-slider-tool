import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { SliderProject, Slide, Layer } from '../types';
import { useUndoRedo } from '../hooks/useUndoRedo';

interface SliderState {
  project: SliderProject | null;
  currentSlideIndex: number;
  selectedLayerId: string | null;
  isPlaying: boolean;
  currentTime: number;
}

type SliderAction =
  | { type: 'SET_PROJECT'; payload: SliderProject }
  | { type: 'ADD_SLIDE'; payload: Slide }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'ADD_LAYER'; payload: { slideId: string; layer: Layer } }
  | { type: 'UPDATE_LAYER'; payload: { slideId: string; layerId: string; updates: Partial<Layer> } }
  | { type: 'DELETE_LAYER'; payload: { slideId: string; layerId: string } }
  | { type: 'SELECT_LAYER'; payload: string | null }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialState: SliderState = {
  project: {
    id: '1',
    name: 'My Slider',
    slides: [
      {
        id: '1',
        name: 'Slide 1',
        background: {
          type: 'gradient',
          value: 'linear-gradient(135deg, #8300e9 0%, #0077ff 100%)'
        },
        layers: [
          {
            id: '1',
            type: 'text',
            content: 'Welcome to Slider Revolution',
            style: {
              x: 50,
              y: 200,
              width: 500,
              height: 80,
              fontSize: 48,
              fontWeight: 'bold',
              color: '#ffffff',
              opacity: 1,
              rotation: 0,
              zIndex: 1
            },
            animation: {
              entrance: 'Slide In Left',
              exit: 'Fade Out',
              duration: 800,
              delay: 0,
              easing: 'ease-out'
            }
          },
          {
            id: '2',
            type: 'text',
            content: 'Create stunning presentations with ease',
            style: {
              x: 50,
              y: 300,
              width: 600,
              height: 40,
              fontSize: 24,
              fontWeight: 'normal',
              color: '#e0e0e0',
              opacity: 1,
              rotation: 0,
              zIndex: 2
            },
            animation: {
              entrance: 'Slide In Left',
              exit: 'Fade Out',
              duration: 800,
              delay: 200,
              easing: 'ease-out'
            }
          },
          {
            id: '3',
            type: 'button',
            content: 'Get Started',
            style: {
              x: 50,
              y: 380,
              width: 150,
              height: 50,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#0077ff',
              borderRadius: 25,
              opacity: 1,
              rotation: 0,
              zIndex: 3
            },
            animation: {
              entrance: 'Scale In',
              exit: 'Scale Out',
              duration: 600,
              delay: 400,
              easing: 'ease-out'
            }
          }
        ],
        duration: 5000
      }
    ],
    settings: {
      autoplay: true,
      loop: true,
      navigation: true,
      pagination: true,
      transitionType: 'slide',
      transitionDuration: 800
    }
  },
  currentSlideIndex: 0,
  selectedLayerId: null,
  isPlaying: false,
  currentTime: 0
};

function sliderReducer(state: SliderState, action: SliderAction): SliderState {
  switch (action.type) {
    case 'SET_PROJECT':
      return { ...state, project: action.payload };
    
    case 'ADD_SLIDE':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          slides: [...state.project.slides, action.payload]
        }
      };
    
    case 'DELETE_SLIDE':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          slides: state.project.slides.filter(slide => slide.id !== action.payload)
        }
      };
    
    case 'SET_CURRENT_SLIDE':
      return { ...state, currentSlideIndex: action.payload };
    
    case 'ADD_LAYER':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          slides: state.project.slides.map(slide =>
            slide.id === action.payload.slideId
              ? { ...slide, layers: [...slide.layers, action.payload.layer] }
              : slide
          )
        }
      };
    
    case 'UPDATE_LAYER':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          slides: state.project.slides.map(slide =>
            slide.id === action.payload.slideId
              ? {
                  ...slide,
                  layers: slide.layers.map(layer =>
                    layer.id === action.payload.layerId
                      ? { ...layer, ...action.payload.updates }
                      : layer
                  )
                }
              : slide
          )
        }
      };
    
    case 'DELETE_LAYER':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          slides: state.project.slides.map(slide =>
            slide.id === action.payload.slideId
              ? { ...slide, layers: slide.layers.filter(layer => layer.id !== action.payload.layerId) }
              : slide
          )
        }
      };
    
    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.payload };
    
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    
    default:
      return state;
  }
}

const SliderContext = createContext<{
  state: SliderState;
  dispatch: (action: SliderAction) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  loadProject: (projectData: string) => void;
} | null>(null);

export function SliderProvider({ children }: { children: any }) {
  const [uiState, setUiState] = useReducer((state: Pick<SliderState, 'currentSlideIndex' | 'selectedLayerId' | 'isPlaying' | 'currentTime'>, action: SliderAction) => {
    switch (action.type) {
      case 'SET_CURRENT_SLIDE':
        return { ...state, currentSlideIndex: action.payload };
      case 'SELECT_LAYER':
        return { ...state, selectedLayerId: action.payload };
      case 'SET_PLAYING':
        return { ...state, isPlaying: action.payload };
      case 'SET_CURRENT_TIME':
        return { ...state, currentTime: action.payload };
      default:
        return state;
    }
  }, {
    currentSlideIndex: 0,
    selectedLayerId: null,
    isPlaying: false,
    currentTime: 0
  });

  const {
    state: project,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory
  } = useUndoRedo(initialState.project!);

  const dispatch = useCallback((action: SliderAction) => {
    // Handle UI-only actions that don't affect project state
    if (['SET_CURRENT_SLIDE', 'SELECT_LAYER', 'SET_PLAYING', 'SET_CURRENT_TIME'].includes(action.type)) {
      setUiState(action);
      return;
    }

    // Handle undo/redo
    if (action.type === 'UNDO') {
      undo();
      return;
    }
    if (action.type === 'REDO') {
      redo();
      return;
    }

    // Handle project-changing actions
    const newProject = sliderReducer({ project, ...uiState }, action).project;
    if (newProject) {
      addToHistory(newProject);
    }
  }, [project, uiState, undo, redo, addToHistory]);

  const saveProject = useCallback(() => {
    try {
      const projectData = JSON.stringify(project, null, 2);
      const blob = new Blob([projectData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name || 'slider-project'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    }
  }, [project]);

  const loadProject = useCallback((projectData: string) => {
    try {
      const parsedProject = JSON.parse(projectData);
      // Validate the project structure
      if (parsedProject && parsedProject.id && parsedProject.slides) {
        addToHistory(parsedProject);
        setUiState({ type: 'SET_CURRENT_SLIDE', payload: 0 });
        setUiState({ type: 'SELECT_LAYER', payload: null });
      } else {
        throw new Error('Invalid project format');
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project. Please check the file format.');
    }
  }, [addToHistory]);

  const state: SliderState = {
    project,
    ...uiState
  };
  
  return (
    <SliderContext.Provider value={{ state, dispatch, canUndo, canRedo, undo, redo, saveProject, loadProject }}>
      {children}
    </SliderContext.Provider>
  );
}

export function useSlider() {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('useSlider must be used within a SliderProvider');
  }
  return context;
}

import React from 'react';
import { useSlider } from '../context/SliderContext';

export function SlideThumbnails() {
  const { state, dispatch } = useSlider();

  const addSlide = () => {
    if (!state.project) return;
    
    const newSlide = {
      id: Date.now().toString(),
      name: `Slide ${state.project.slides.length + 1}`,
      background: {
        type: 'gradient' as const,
        value: `linear-gradient(135deg, 
          hsl(${Math.random() * 360}, 70%, 60%) 0%, 
          hsl(${Math.random() * 360}, 70%, 60%) 100%)`
      },
      layers: [],
      duration: 5000
    };
    
    dispatch({ type: 'ADD_SLIDE', payload: newSlide });
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: state.project.slides.length });
  };

  const deleteSlide = (slideId: string) => {
    if (!state.project || state.project.slides.length <= 1) return;
    
    dispatch({ type: 'DELETE_SLIDE', payload: slideId });
    
    if (state.currentSlideIndex >= state.project.slides.length - 1) {
      dispatch({ type: 'SET_CURRENT_SLIDE', payload: Math.max(0, state.currentSlideIndex - 1) });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          {state.project?.slides.map((slide, index) => (
            <div key={slide.id} className="relative group">
              <div
                className={`w-16 h-10 rounded cursor-pointer border-2 transition-all ${
                  index === state.currentSlideIndex 
                    ? 'border-blue-500 shadow-md' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  background: slide.background.type === 'gradient' 
                    ? slide.background.value
                    : slide.background.type === 'color'
                    ? slide.background.value
                    : `url(${slide.background.value}) center/cover`,
                }}
                onClick={() => dispatch({ type: 'SET_CURRENT_SLIDE', payload: index })}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
              </div>
              
              {state.project && state.project.slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(slide.id);
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addSlide}
            className="w-16 h-10 border-2 border-dashed border-gray-400 rounded hover:border-gray-600 hover:bg-gray-50 flex items-center justify-center transition-all"
          >
            <span className="text-gray-600 text-lg">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

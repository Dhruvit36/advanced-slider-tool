import React, { useState } from 'react';
import { useSlider } from '../context/SliderContext';
import { useTemplateManager } from '../utils/templates';
import { ExportModal } from './ExportModal';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { state, dispatch } = useSlider();
  const { templates, applyTemplate } = useTemplateManager();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts();

  const addSlide = () => {
    if (!state.project) return;
    
    const newSlide = {
      id: Date.now().toString(),
      name: `Slide ${state.project.slides.length + 1}`,
      background: {
        type: 'gradient' as const,
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      layers: [],
      duration: 5000
    };
    
    dispatch({ type: 'ADD_SLIDE', payload: newSlide });
  };

  const addTemplateSlide = (templateId: string) => {
    const templateSlide = applyTemplate(templateId);
    if (templateSlide) {
      dispatch({ type: 'ADD_SLIDE', payload: templateSlide });
      setShowTemplates(false);
    }
  };

  const togglePlayback = () => {
    dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
  };

  return (
    <>
      <div className="bg-primary text-white px-2 sm:px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-6 min-w-0">
          <button className="lg:hidden" onClick={onMenuClick}>
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="font-bold text-sm sm:text-lg truncate">
            <i className="fas fa-layer-group mr-2"></i>
            Slider Revolution
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <button 
              onClick={addSlide}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-all flex items-center"
            >
              <i className="fas fa-plus mr-1"></i>
              Slide
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-all flex items-center">
              <i className="fas fa-copy mr-1"></i>
              Duplicate
            </button>
            <button 
              onClick={() => setShowTemplates(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-all flex items-center"
            >
              <i className="fas fa-templates mr-1"></i>
              Templates
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-4 min-w-0">
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={togglePlayback}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-all flex items-center"
            >
              <i className={`fas ${state.isPlaying ? 'fa-pause' : 'fa-play'} mr-1`}></i>
              {state.isPlaying ? 'Pause' : 'Preview'}
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-all flex items-center">
              <i className="fas fa-save mr-1"></i>
              Save
            </button>
            <button 
              onClick={() => setShowExport(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-all flex items-center"
            >
              <i className="fas fa-download mr-1"></i>
              Export
            </button>
            <button 
              onClick={() => setShowShortcuts(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-all flex items-center"
              title="Keyboard Shortcuts (F1)"
            >
              <i className="fas fa-keyboard mr-1"></i>
              Help
            </button>
          </div>

          <div className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded flex items-center">
            <i className="fas fa-images mr-1"></i>
            Slide {state.currentSlideIndex + 1} of {state.project?.slides.length || 0}
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Choose a Template</h2>
              <button 
                onClick={() => setShowTemplates(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div 
                    className="h-32 relative cursor-pointer"
                    style={{
                      background: template.background.type === 'gradient' 
                        ? template.background.value
                        : template.background.type === 'color'
                        ? template.background.value
                        : `url(${template.background.value}) center/cover`,
                    }}
                    onClick={() => addTemplateSlide(template.id)}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="bg-white text-gray-800 px-4 py-2 rounded font-medium">
                        Use Template
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.layers.length} layers • {template.duration / 1000}s duration
                    </p>
                    <button
                      onClick={() => addTemplateSlide(template.id)}
                      className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition-all"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />
      
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
}

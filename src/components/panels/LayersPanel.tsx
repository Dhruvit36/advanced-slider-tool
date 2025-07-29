import React, { useState } from 'react';
import { useSlider } from '../../context/SliderContext';
import { Layer } from '../../types';
import { shapeTypes } from '../Shape';

interface LayersPanelProps {
  currentSlide: any;
  selectedLayer: Layer | undefined;
  onAddLayer: (type: Layer['type']) => void;
  onDeleteLayer: (layerId: string) => void;
}

export function LayersPanel({ currentSlide, selectedLayer, onAddLayer, onDeleteLayer }: LayersPanelProps) {
  const { state, dispatch } = useSlider();
  const [selectedShapeType, setSelectedShapeType] = useState<string>('rectangle');

  const handleAddLayer = (type: Layer['type']) => {
    onAddLayer(type);
  };

  return (
    <div className="space-y-6">
      {/* Element Creation Section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center">
            <i className="fas fa-plus-circle mr-2 text-blue-500"></i>
            Add Elements
          </h3>
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
            {currentSlide?.layers.length || 0} layers
          </div>
        </div>
        
        {/* Shape Type Selector */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600 mb-2 block">Shape Type</label>
          <div className="grid grid-cols-2 gap-1">
            {shapeTypes.map((shape) => (
              <button
                key={shape.value}
                onClick={() => setSelectedShapeType(shape.value)}
                className={`p-2 text-xs rounded-md border transition-all ${
                  selectedShapeType === shape.value 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className="block text-center">{shape.icon}</span>
                <span className="block text-center mt-1">{shape.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Elements Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAddLayer('text')}
            className="group bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center"
          >
            <i className="fas fa-font text-blue-500 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">Text</span>
          </button>
          <button
            onClick={() => handleAddLayer('button')}
            className="group bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center"
          >
            <i className="fas fa-hand-pointer text-green-500 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-700 group-hover:text-green-700 font-medium">Button</span>
          </button>
          <button
            onClick={() => handleAddLayer('image')}
            className="group bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center"
          >
            <i className="fas fa-image text-purple-500 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-700 group-hover:text-purple-700 font-medium">Image</span>
          </button>
          <button
            onClick={() => handleAddLayer('shape')}
            className="group bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center"
          >
            <i className="fas fa-shapes text-orange-500 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-700 group-hover:text-orange-700 font-medium">Shape</span>
          </button>
        </div>
      </div>

      {/* Layers List Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center">
              <i className="fas fa-layer-group mr-2 text-gray-500"></i>
              Layer Stack
            </h3>
            <div className="flex items-center space-x-2">
              <button className="text-xs text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors">
                <i className="fas fa-eye"></i>
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors">
                <i className="fas fa-lock"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {currentSlide?.layers.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {currentSlide.layers.map((layer: Layer, index: number) => (
                <div
                  key={layer.id}
                  className={`group p-3 cursor-pointer transition-all duration-200 ${
                    state.selectedLayerId === layer.id 
                      ? 'bg-blue-50 border-l-3 border-l-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => dispatch({ type: 'SELECT_LAYER', payload: layer.id })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${
                        layer.type === 'text' ? 'bg-blue-500' :
                        layer.type === 'button' ? 'bg-green-500' :
                        layer.type === 'image' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}>
                        <i className={`fas ${
                          layer.type === 'text' ? 'fa-font' :
                          layer.type === 'button' ? 'fa-hand-pointer' :
                          layer.type === 'image' ? 'fa-image' :
                          'fa-shapes'
                        }`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {layer.type.charAt(0).toUpperCase() + layer.type.slice(1)} {index + 1}
                          </p>
                          <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                            z:{layer.style.zIndex}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {layer.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-xs text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors">
                        <i className="fas fa-copy"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLayer(layer.id);
                        }}
                        className="text-xs text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-layer-group text-gray-400 text-lg"></i>
              </div>
              <p className="text-sm text-gray-500 mb-2">No layers yet</p>
              <p className="text-xs text-gray-400">Add elements to start building your slide</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

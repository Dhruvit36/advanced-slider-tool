import React, { useState } from 'react';
import { useSlider } from '../context/SliderContext';
import { Layer } from '../types';
import { animationPresets } from '../utils/animations';
import { MediaLibrary } from './MediaLibrary';
import { shapeTypes } from './Shape';

type SidebarTab = 'layers' | 'properties' | 'animations' | 'media';

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch } = useSlider();
  const [activeTab, setActiveTab] = useState<SidebarTab>('layers');
  const [selectedShapeType, setSelectedShapeType] = useState<string>('rectangle');
  
  const currentSlide = state.project?.slides[state.currentSlideIndex];
  const selectedLayer = currentSlide?.layers.find(layer => layer.id === state.selectedLayerId);

  const addLayer = (type: Layer['type']) => {
    if (!currentSlide) return;
    
    const newLayer: Layer = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'New Text' : type === 'button' ? 'Button' : type === 'shape' ? selectedShapeType : '',
      shapeType: type === 'shape' ? selectedShapeType as any : undefined,
      style: {
        x: 100,
        y: 100,
        width: type === 'text' ? 200 : type === 'button' ? 120 : 100,
        height: type === 'text' ? 50 : type === 'button' ? 40 : 100,
        fontSize: type === 'text' ? 24 : type === 'button' ? 16 : undefined,
        fontWeight: type === 'button' ? 'bold' : 'normal',
        color: '#000000',
        backgroundColor: type === 'button' ? '#0077ff' : undefined,
        borderRadius: type === 'button' ? 5 : 0,
        opacity: 1,
        rotation: 0,
        zIndex: currentSlide.layers.length + 1
      },
      animation: {
        entrance: 'Fade In',
        exit: 'Fade Out',
        duration: 600,
        delay: 0,
        easing: 'ease-out'
      }
    };
    
    dispatch({
      type: 'ADD_LAYER',
      payload: { slideId: currentSlide.id, layer: newLayer }
    });
  };

  const updateLayerProperty = (property: string, value: any) => {
    if (!selectedLayer || !currentSlide) return;
    
    const updates: Partial<Layer> = {};
    
    if (property.startsWith('style.')) {
      const styleProp = property.replace('style.', '');
      updates.style = { ...selectedLayer.style, [styleProp]: value };
    } else if (property.startsWith('animation.')) {
      const animProp = property.replace('animation.', '');
      updates.animation = { ...selectedLayer.animation, [animProp]: value };
    } else {
      (updates as any)[property] = value;
    }
    
    dispatch({
      type: 'UPDATE_LAYER',
      payload: {
        slideId: currentSlide.id,
        layerId: selectedLayer.id,
        updates
      }
    });
  };

  const deleteLayer = (layerId: string) => {
    if (!currentSlide) return;
    
    dispatch({
      type: 'DELETE_LAYER',
      payload: { slideId: currentSlide.id, layerId }
    });
  };

  const renderLayersTab = () => (
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
            onClick={() => addLayer('text')}
            className="group bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center"
          >
            <i className="fas fa-font text-blue-500 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">Text</span>
          </button>
          <button
            onClick={() => addLayer('button')}
            className="group bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center"
          >
            <i className="fas fa-hand-pointer text-green-500 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-700 group-hover:text-green-700 font-medium">Button</span>
          </button>
          <button
            onClick={() => addLayer('image')}
            className="group bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center"
          >
            <i className="fas fa-image text-purple-500 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-700 group-hover:text-purple-700 font-medium">Image</span>
          </button>
          <button
            onClick={() => addLayer('shape')}
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
              {currentSlide.layers.map((layer, index) => (
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
                          <span className="text-xs font-medium text-gray-900 capitalize">{layer.type}</span>
                          <span className="text-xs text-gray-400">#{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-0.5">{layer.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors">
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors">
                        <i className="fas fa-copy text-xs"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(layer.id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fas fa-layer-group text-gray-400 text-xl"></i>
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">No layers yet</h4>
              <p className="text-xs text-gray-500 mb-4">Start building your slide by adding elements above</p>
              <button
                onClick={() => addLayer('text')}
                className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
              >
                Add first element
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPropertiesTab = () => (
    <div className="space-y-6">
      {selectedLayer ? (
        <>
          {/* Layer Info Header */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                selectedLayer.type === 'text' ? 'bg-blue-500' :
                selectedLayer.type === 'button' ? 'bg-green-500' :
                selectedLayer.type === 'image' ? 'bg-purple-500' :
                'bg-orange-500'
              }`}>
                <i className={`fas ${
                  selectedLayer.type === 'text' ? 'fa-font' :
                  selectedLayer.type === 'button' ? 'fa-hand-pointer' :
                  selectedLayer.type === 'image' ? 'fa-image' :
                  'fa-shapes'
                }`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 capitalize">{selectedLayer.type} Layer</h3>
                <p className="text-xs text-gray-500">Configure element properties</p>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Content</label>
              <input
                type="text"
                value={selectedLayer.content}
                onChange={(e) => updateLayerProperty('content', e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter content..."
              />
            </div>
          </div>

          {/* Position & Size */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <i className="fas fa-arrows-alt mr-2 text-gray-500"></i>
                Position & Size
              </h4>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">X Position</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedLayer.style.x}
                      onChange={(e) => updateLayerProperty('style.x', parseInt(e.target.value))}
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Y Position</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedLayer.style.y}
                      onChange={(e) => updateLayerProperty('style.y', parseInt(e.target.value))}
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Width</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedLayer.style.width}
                      onChange={(e) => updateLayerProperty('style.width', parseInt(e.target.value))}
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Height</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedLayer.style.height}
                      onChange={(e) => updateLayerProperty('style.height', parseInt(e.target.value))}
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography (for text/button) */}
          {(selectedLayer.type === 'text' || selectedLayer.type === 'button') && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                  <i className="fas fa-font mr-2 text-gray-500"></i>
                  Typography
                </h4>
              </div>
              <div className="p-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Font Size</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedLayer.style.fontSize}
                      onChange={(e) => updateLayerProperty('style.fontSize', parseInt(e.target.value))}
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <i className="fas fa-palette mr-2 text-gray-500"></i>
                Appearance
              </h4>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Text Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={selectedLayer.style.color}
                    onChange={(e) => updateLayerProperty('style.color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedLayer.style.color}
                    onChange={(e) => updateLayerProperty('style.color', e.target.value)}
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {selectedLayer.type === 'button' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Background Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={selectedLayer.style.backgroundColor}
                      onChange={(e) => updateLayerProperty('style.backgroundColor', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedLayer.style.backgroundColor}
                      onChange={(e) => updateLayerProperty('style.backgroundColor', e.target.value)}
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Opacity <span className="text-gray-400">({Math.round(selectedLayer.style.opacity * 100)}%)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedLayer.style.opacity}
                  onChange={(e) => updateLayerProperty('style.opacity', parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Rotation <span className="text-gray-400">({selectedLayer.style.rotation}°)</span>
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={selectedLayer.style.rotation}
                  onChange={(e) => updateLayerProperty('style.rotation', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="fas fa-sliders-h text-gray-400 text-xl"></i>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">No layer selected</h4>
          <p className="text-xs text-gray-500">Select a layer from the layers panel to edit its properties</p>
        </div>
      )}
    </div>
  );

  const renderAnimationsTab = () => (
    <div className="space-y-6">
      {selectedLayer ? (
        <>
          {/* Animation Info Header */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                <i className="fas fa-magic"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Animation Settings</h3>
                <p className="text-xs text-gray-500">Configure entrance and exit animations</p>
              </div>
            </div>
          </div>

          {/* Entrance Animation */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-200">
              <h4 className="text-sm font-semibold text-green-700 flex items-center">
                <i className="fas fa-sign-in-alt mr-2 text-green-600"></i>
                Entrance Animation
              </h4>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Animation Type</label>
                <select
                  value={selectedLayer.animation.entrance}
                  onChange={(e) => updateLayerProperty('animation.entrance', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  {animationPresets
                    .filter(preset => preset.type === 'entrance')
                    .map(preset => (
                      <option key={preset.name} value={preset.name}>
                        {preset.name}
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Delay <span className="text-gray-400">({selectedLayer.animation.delay}ms)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedLayer.animation.delay}
                    onChange={(e) => updateLayerProperty('animation.delay', parseInt(e.target.value))}
                    className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    min="0"
                    step="100"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exit Animation */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-red-50 px-4 py-3 border-b border-red-200">
              <h4 className="text-sm font-semibold text-red-700 flex items-center">
                <i className="fas fa-sign-out-alt mr-2 text-red-600"></i>
                Exit Animation
              </h4>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Animation Type</label>
                <select
                  value={selectedLayer.animation.exit}
                  onChange={(e) => updateLayerProperty('animation.exit', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  {animationPresets
                    .filter(preset => preset.type === 'exit')
                    .map(preset => (
                      <option key={preset.name} value={preset.name}>
                        {preset.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Animation Timing */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
              <h4 className="text-sm font-semibold text-blue-700 flex items-center">
                <i className="fas fa-clock mr-2 text-blue-600"></i>
                Timing & Duration
              </h4>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Duration <span className="text-gray-400">({selectedLayer.animation.duration}ms)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedLayer.animation.duration}
                    onChange={(e) => updateLayerProperty('animation.duration', parseInt(e.target.value))}
                    className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min="100"
                    step="100"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">ms</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Easing</label>
                <select
                  value={selectedLayer.animation.easing}
                  onChange={(e) => updateLayerProperty('animation.easing', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                  <option value="linear">Linear</option>
                </select>
              </div>
            </div>
          </div>

          {/* Animation Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center mx-auto">
                <i className="fas fa-play mr-2"></i>
                Preview Animation
              </button>
              <p className="text-xs text-gray-500 mt-2">Test your animation settings</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="fas fa-magic text-gray-400 text-xl"></i>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">No layer selected</h4>
          <p className="text-xs text-gray-500">Select a layer to configure its animations</p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`fixed lg:static top-0 right-0 h-full lg:h-auto lg:relative z-50 
        w-full sm:w-96 lg:w-80 bg-white text-gray-900 border-l border-gray-200 shadow-lg lg:shadow-none
        transform lg:translate-x-0 transition-transform duration-300 flex-shrink-0 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden bg-gray-50">
        <h2 className="text-lg font-semibold flex items-center text-gray-800">
          <i className="fas fa-cog mr-2 text-blue-500"></i>
          Element Editor
        </h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl transition-colors">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Professional Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 relative ${
              activeTab === 'layers' 
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <i className={`fas fa-layer-group ${
                activeTab === 'layers' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span>Layers</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 relative ${
              activeTab === 'properties' 
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <i className={`fas fa-sliders-h ${
                activeTab === 'properties' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span>Properties</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('animations')}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 relative ${
              activeTab === 'animations' 
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <i className={`fas fa-magic ${
                activeTab === 'animations' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span>Animations</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 relative ${
              activeTab === 'media' 
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <i className={`fas fa-folder-open ${
                activeTab === 'media' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span>Media</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 bg-gray-50">
          {activeTab === 'layers' && renderLayersTab()}
          {activeTab === 'properties' && renderPropertiesTab()}
          {activeTab === 'animations' && renderAnimationsTab()}
          {activeTab === 'media' && <MediaLibrary />}
        </div>
      </div>
    </div>
  );
}
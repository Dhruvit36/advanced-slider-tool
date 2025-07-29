import React, { useState } from 'react';
import { useSlider } from '../context/SliderContext';
import { Layer } from '../types';
import { LayersPanel } from './panels/LayersPanel';
import { PropertiesPanel } from './panels/PropertiesPanel';
import { AnimationsPanel } from './panels/AnimationsPanel';
import { MediaPanel } from './panels/MediaPanel';

type SidebarTab = 'layers' | 'properties' | 'animations' | 'media';

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch } = useSlider();
  const [activeTab, setActiveTab] = useState<SidebarTab>('layers');
  
  const currentSlide = state.project?.slides[state.currentSlideIndex];
  const selectedLayer = currentSlide?.layers.find(layer => layer.id === state.selectedLayerId);

  const addLayer = (type: Layer['type']) => {
    if (!currentSlide) return;
    
    const newLayer: Layer = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'New Text' : type === 'button' ? 'Button' : type === 'shape' ? 'rectangle' : '',
      shapeType: type === 'shape' ? 'rectangle' as any : undefined,
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'layers':
        return (
          <LayersPanel 
            currentSlide={currentSlide}
            selectedLayer={selectedLayer}
            onAddLayer={addLayer}
            onDeleteLayer={deleteLayer}
          />
        );
      case 'properties':
        return (
          <PropertiesPanel 
            selectedLayer={selectedLayer}
            onUpdateProperty={updateLayerProperty}
          />
        );
      case 'animations':
        return (
          <AnimationsPanel 
            selectedLayer={selectedLayer}
            onUpdateProperty={updateLayerProperty}
          />
        );
      case 'media':
        return <MediaPanel />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed lg:static top-0 right-0 h-full lg:h-auto lg:relative z-50 
        bg-white lg:bg-transparent border-l lg:border-l-0 border-gray-200 
        w-80 lg:w-full transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-sliders-h mr-2 text-gray-500"></i>
            Properties
          </h2>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
              activeTab === 'layers'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-layer-group mr-1.5"></i>
            Layers
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
              activeTab === 'properties'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-sliders-h mr-1.5"></i>
            Props
          </button>
          <button
            onClick={() => setActiveTab('animations')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
              activeTab === 'animations'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-magic mr-1.5"></i>
            Anim
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
              activeTab === 'media'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-photo-video mr-1.5"></i>
            Media
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {renderTabContent()}
      </div>
    </div>
  );
}

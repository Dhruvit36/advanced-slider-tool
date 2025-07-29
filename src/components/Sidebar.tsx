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
        w-full sm:w-96 lg:w-96 bg-white text-gray-900 border-l border-gray-200 shadow-lg lg:shadow-none
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
            className={`flex-1 min-w-0 px-1 py-3 text-xs font-medium text-center border-b-2 transition-colors relative ${
              activeTab === 'layers'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-1">
              <i className={`fas fa-layer-group text-sm ${
                activeTab === 'layers' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span className="text-xs">Layers</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 min-w-0 px-1 py-3 text-xs font-medium text-center border-b-2 transition-colors relative ${
              activeTab === 'properties'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-1">
              <i className={`fas fa-sliders-h text-sm ${
                activeTab === 'properties' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span className="text-xs">Props</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('animations')}
            className={`flex-1 min-w-0 px-1 py-3 text-xs font-medium text-center border-b-2 transition-colors relative ${
              activeTab === 'animations'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-1">
              <i className={`fas fa-magic text-sm ${
                activeTab === 'animations' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span className="text-xs">Anim</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 min-w-0 px-1 py-3 text-xs font-medium text-center border-b-2 transition-colors relative ${
              activeTab === 'media'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-1">
              <i className={`fas fa-folder-open text-sm ${
                activeTab === 'media' ? 'text-blue-600' : 'text-gray-400'
              }`}></i>
              <span className="text-xs">Media</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 bg-gray-50">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

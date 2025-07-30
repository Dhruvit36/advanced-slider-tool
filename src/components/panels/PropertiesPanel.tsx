import React from 'react';
import { Layer } from '../../types';
import { ColorPicker } from '../ui/ColorPicker';
import { TypographyEditor } from '../ui/TypographyEditor';

interface PropertiesPanelProps {
  selectedLayer: Layer | undefined;
  onUpdateProperty: (property: string, value: any) => void;
}

export function PropertiesPanel({ selectedLayer, onUpdateProperty }: PropertiesPanelProps) {
  if (!selectedLayer) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <i className="fas fa-sliders-h text-gray-400 text-xl"></i>
        </div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">No layer selected</h4>
        <p className="text-xs text-gray-500">Select a layer from the layers panel to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            onChange={(e) => onUpdateProperty('content', e.target.value)}
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
                  onChange={(e) => onUpdateProperty('style.x', parseInt(e.target.value))}
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
                  onChange={(e) => onUpdateProperty('style.y', parseInt(e.target.value))}
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
                  onChange={(e) => onUpdateProperty('style.width', parseInt(e.target.value))}
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
                  onChange={(e) => onUpdateProperty('style.height', parseInt(e.target.value))}
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
        <TypographyEditor 
          layer={selectedLayer}
          onUpdateProperty={onUpdateProperty}
        />
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
          {selectedLayer.type === 'button' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                <i className="fas fa-fill-drip mr-2 text-blue-600"></i>
                Background Color
              </label>
              <ColorPicker
                value={selectedLayer.style.backgroundColor || '#3b82f6'}
                onChange={(color) => onUpdateProperty('style.backgroundColor', color)}
              />
            </div>
          )}

          {/* Text Color for non-text layers */}
          {selectedLayer.type !== 'text' && selectedLayer.type !== 'button' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                <i className="fas fa-palette mr-2 text-purple-600"></i>
                Color
              </label>
              <ColorPicker
                value={selectedLayer.style.color || '#000000'}
                onChange={(color) => onUpdateProperty('style.color', color)}
              />
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
              onChange={(e) => onUpdateProperty('style.opacity', parseFloat(e.target.value))}
              className="w-full slider"
              style={{
                background: '#e5e7eb',
                height: '8px',
                borderRadius: '4px',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
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
              onChange={(e) => onUpdateProperty('style.rotation', parseInt(e.target.value))}
              className="w-full slider"
              style={{
                background: '#e5e7eb',
                height: '8px',
                borderRadius: '4px',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

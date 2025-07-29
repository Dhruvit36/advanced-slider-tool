import React from 'react';
import { Layer } from '../../types';
import { animationPresets } from '../../utils/animations';
import { CustomDropdown } from '../ui/CustomDropdown';

interface AnimationsPanelProps {
  selectedLayer: Layer | undefined;
  onUpdateProperty: (property: string, value: any) => void;
}

export function AnimationsPanel({ selectedLayer, onUpdateProperty }: AnimationsPanelProps) {
  if (!selectedLayer) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <i className="fas fa-magic text-gray-400 text-xl"></i>
        </div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">No layer selected</h4>
        <p className="text-xs text-gray-500">Select a layer to configure its animations</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <CustomDropdown
              value={selectedLayer.animation.entrance}
              onChange={(value) => onUpdateProperty('animation.entrance', value)}
              options={animationPresets
                .filter(preset => preset.type === 'entrance')
                .map(preset => ({
                  value: preset.name,
                  label: preset.name,
                  icon: 'fas fa-sign-in-alt',
                  description: `${preset.duration}ms duration`
                }))}
              variant="success"
              size="md"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Delay <span className="text-gray-400">({selectedLayer.animation.delay}ms)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={selectedLayer.animation.delay}
                onChange={(e) => onUpdateProperty('animation.delay', parseInt(e.target.value))}
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
            <CustomDropdown
              value={selectedLayer.animation.exit}
              onChange={(value) => onUpdateProperty('animation.exit', value)}
              options={animationPresets
                .filter(preset => preset.type === 'exit')
                .map(preset => ({
                  value: preset.name,
                  label: preset.name,
                  icon: 'fas fa-sign-out-alt',
                  description: `${preset.duration}ms duration`
                }))}
              variant="error"
              size="md"
            />
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
                onChange={(e) => onUpdateProperty('animation.duration', parseInt(e.target.value))}
                className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                min="100"
                step="100"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">ms</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Easing</label>
            <CustomDropdown
              value={selectedLayer.animation.easing}
              onChange={(value) => onUpdateProperty('animation.easing', value)}
              options={[
                { value: 'ease', label: 'Ease', icon: 'fas fa-wave-square', description: 'Smooth start and end' },
                { value: 'ease-in', label: 'Ease In', icon: 'fas fa-arrow-right', description: 'Slow start, fast end' },
                { value: 'ease-out', label: 'Ease Out', icon: 'fas fa-arrow-left', description: 'Fast start, slow end' },
                { value: 'ease-in-out', label: 'Ease In Out', icon: 'fas fa-arrows-alt-h', description: 'Slow start and end' },
                { value: 'linear', label: 'Linear', icon: 'fas fa-minus', description: 'Constant speed' }
              ]}
              variant="info"
              size="md"
            />
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
    </div>
  );
}

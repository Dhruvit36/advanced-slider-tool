import React, { useState } from 'react';
import { Layer } from '../../types';
import { ColorPicker } from './ColorPicker';

interface CharacterPanelProps {
  layer: Layer;
  onUpdateProperty: (property: string, value: any) => void;
}

export function CharacterPanel({ layer, onUpdateProperty }: CharacterPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'opentype'>('basic');
  const style = layer.style;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
          <i className="fas fa-text-height mr-2 text-gray-500"></i>
          Character Panel
        </h4>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'basic', label: 'Basic', icon: 'fa-font' },
          { id: 'advanced', label: 'Advanced', icon: 'fa-sliders-h' },
          { id: 'opentype', label: 'OpenType', icon: 'fa-code' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <i className={`fas ${tab.icon} mr-1`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Basic Character Controls */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            {/* Character Scaling */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Vertical Scale <span className="text-gray-400">({(style.verticalScale || 100)}%)</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={style.verticalScale || 100}
                  onChange={(e) => onUpdateProperty('style.verticalScale', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Horizontal Scale <span className="text-gray-400">({(style.horizontalScale || 100)}%)</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={style.horizontalScale || 100}
                  onChange={(e) => onUpdateProperty('style.horizontalScale', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Baseline Shift */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Baseline Shift <span className="text-gray-400">({(style.baseline || 0)}px)</span>
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={style.baseline || 0}
                onChange={(e) => onUpdateProperty('style.baseline', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Character Position */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Character Position</label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                {[
                  { value: 'normal', label: 'Normal', icon: 'fa-minus' },
                  { value: 'superscript', label: 'Super', icon: 'fa-superscript' },
                  { value: 'subscript', label: 'Sub', icon: 'fa-subscript' }
                ].map(pos => (
                  <button
                    key={pos.value}
                    onClick={() => onUpdateProperty('style.position', pos.value)}
                    className={`flex-1 p-2 text-xs transition-colors ${
                      (style.position || 'normal') === pos.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title={pos.label}
                  >
                    <i className={`fas ${pos.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Capitalization */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Capitalization</label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                {[
                  { value: 'none', label: 'None', icon: 'fa-font' },
                  { value: 'small-caps', label: 'Small Caps', icon: 'fa-text-height' },
                  { value: 'caps', label: 'All Caps', icon: 'fa-text-width' },
                  { value: 'all-small-caps', label: 'All Small Caps', icon: 'fa-compress-alt' },
                  { value: 'unicase', label: 'Unicase', icon: 'fa-equals' }
                ].map(cap => (
                  <button
                    key={cap.value}
                    onClick={() => onUpdateProperty('style.caps', cap.value)}
                    title={cap.label}
                    className={`flex items-center justify-center p-3 text-sm transition-colors flex-1 ${
                      (style.caps || 'none') === cap.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas ${cap.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advanced Character Controls */}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            {/* Tracking & Kerning */}
            <div className="space-y-3">
              {/* Tracking Section */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Tracking <span className="text-gray-400">({(style.characterSpacing || 0)})</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="500"
                  step="10"
                  value={style.characterSpacing || 0}
                  onChange={(e) => onUpdateProperty('style.characterSpacing', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              {/* Kerning Section */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Kerning</label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  {[
                    { value: 'auto', label: 'Auto', icon: 'fa-magic' },
                    { value: 'optical', label: 'Optical', icon: 'fa-eye' },
                    { value: 'metrics', label: 'Metrics', icon: 'fa-ruler' },
                    { value: '0', label: 'None', icon: 'fa-ban' }
                  ].map(kern => (
                    <button
                      key={kern.value}
                      onClick={() => onUpdateProperty('style.kerning', kern.value)}
                      title={kern.label}
                      className={`flex items-center justify-center p-2.5 text-sm transition-colors flex-1 ${
                        String(style.kerning || 'auto') === kern.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`fas ${kern.icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Character Rotation */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Character Rotation <span className="text-gray-400">({(style.characterRotation || 0)}°)</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={style.characterRotation || 0}
                onChange={(e) => onUpdateProperty('style.characterRotation', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Leading Type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Leading Type</label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                {[
                  { value: 'auto', label: 'Auto' },
                  { value: 'custom', label: 'Custom' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => onUpdateProperty('style.leadingType', type.value)}
                    className={`flex-1 p-2 text-xs transition-colors ${
                      (style.leadingType || 'auto') === type.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Underline Options */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-xs font-medium text-gray-600 mb-3">Underline Options</label>
              <div className="space-y-3">
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  {[
                    { value: 'none', label: 'None', icon: 'fa-ban' },
                    { value: 'single', label: 'Single Line', icon: 'fa-underline' },
                    { value: 'double', label: 'Double Line', icon: 'fa-equals' },
                    { value: 'dotted', label: 'Dotted Line', icon: 'fa-ellipsis-h' },
                    { value: 'dashed', label: 'Dashed Line', icon: 'fa-minus' },
                    { value: 'wavy', label: 'Wavy Line', icon: 'fa-wave-square' }
                  ].map(underline => (
                    <button
                      key={underline.value}
                      onClick={() => onUpdateProperty('style.underlineOptions', {
                        ...style.underlineOptions,
                        style: underline.value
                      })}
                      title={underline.label}
                      className={`flex items-center justify-center p-2.5 text-sm transition-colors flex-1 ${
                        (style.underlineOptions?.style || 'none') === underline.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`fas ${underline.icon}`}></i>
                    </button>
                  ))}
                </div>
                
                {style.underlineOptions?.style !== 'none' && (
                  <div className="space-y-3">
                    {/* Thickness Slider */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Thickness <span className="text-gray-400">({(style.underlineOptions?.thickness || 1).toFixed(1)}px)</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={style.underlineOptions?.thickness || 1}
                        onChange={(e) => onUpdateProperty('style.underlineOptions', {
                          ...style.underlineOptions,
                          thickness: parseFloat(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    {/* Color Picker */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
                      <ColorPicker
                        value={style.underlineOptions?.color || '#000000'}
                        onChange={(color) => onUpdateProperty('style.underlineOptions', {
                          ...style.underlineOptions,
                          color: color
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Strikethrough Options */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-xs font-medium text-gray-600 mb-3">Strikethrough Options</label>
              <div className="space-y-3">
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  {[
                    { value: 'none', label: 'None', icon: 'fa-ban' },
                    { value: 'single', label: 'Single Line', icon: 'fa-strikethrough' },
                    { value: 'double', label: 'Double Line', icon: 'fa-equals' },
                    { value: 'dotted', label: 'Dotted Line', icon: 'fa-ellipsis-h' },
                    { value: 'dashed', label: 'Dashed Line', icon: 'fa-minus' }
                  ].map(strike => (
                    <button
                      key={strike.value}
                      onClick={() => onUpdateProperty('style.strikethroughOptions', {
                        ...style.strikethroughOptions,
                        style: strike.value
                      })}
                      title={strike.label}
                      className={`flex items-center justify-center p-2.5 text-sm transition-colors flex-1 ${
                        (style.strikethroughOptions?.style || 'none') === strike.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`fas ${strike.icon}`}></i>
                    </button>
                  ))}
                </div>
                
                {style.strikethroughOptions?.style !== 'none' && (
                  <div className="space-y-3">
                    {/* Thickness Slider */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Thickness <span className="text-gray-400">({(style.strikethroughOptions?.thickness || 1).toFixed(1)}px)</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={style.strikethroughOptions?.thickness || 1}
                        onChange={(e) => onUpdateProperty('style.strikethroughOptions', {
                          ...style.strikethroughOptions,
                          thickness: parseFloat(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    {/* Color Picker */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
                      <ColorPicker
                        value={style.strikethroughOptions?.color || '#000000'}
                        onChange={(color) => onUpdateProperty('style.strikethroughOptions', {
                          ...style.strikethroughOptions,
                          color: color
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OpenType Features */}
        {activeTab === 'opentype' && (
          <div className="space-y-4">
            {/* OpenType Feature Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Ligatures</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={style.ligatures || false}
                    onChange={(e) => onUpdateProperty('style.ligatures', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Stylistic Alternates</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={style.alternates || false}
                    onChange={(e) => onUpdateProperty('style.alternates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Hyphenation</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={style.hyphenation || false}
                    onChange={(e) => onUpdateProperty('style.hyphenation', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Character Panel Presets */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Character Presets</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { 
                    name: 'Display Text', 
                    settings: { 
                      characterSpacing: 50, 
                      verticalScale: 120, 
                      horizontalScale: 95,
                      caps: 'small-caps'
                    } 
                  },
                  { 
                    name: 'Condensed', 
                    settings: { 
                      horizontalScale: 75, 
                      characterSpacing: -20,
                      verticalScale: 110
                    } 
                  },
                  { 
                    name: 'Extended', 
                    settings: { 
                      horizontalScale: 125, 
                      characterSpacing: 30,
                      verticalScale: 95
                    } 
                  },
                  { 
                    name: 'Elegant', 
                    settings: { 
                      ligatures: true, 
                      alternates: true,
                      characterSpacing: 15,
                      baseline: 2
                    } 
                  }
                ].map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      Object.entries(preset.settings).forEach(([key, value]) => {
                        onUpdateProperty(`style.${key}`, value);
                      });
                    }}
                    className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors border border-gray-300 text-left"
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-gray-500 text-xs">
                      {Object.entries(preset.settings).slice(0, 2).map(([key, value]) => 
                        `${key}: ${value}`
                      ).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                const resetProperties = [
                  'verticalScale', 'horizontalScale', 'baseline', 'characterRotation',
                  'characterSpacing', 'kerning', 'leadingType', 'caps', 'position',
                  'ligatures', 'alternates', 'hyphenation', 'underlineOptions', 'strikethroughOptions'
                ];
                resetProperties.forEach(prop => {
                  onUpdateProperty(`style.${prop}`, prop === 'kerning' || prop === 'leadingType' ? 'auto' : 
                    prop === 'verticalScale' || prop === 'horizontalScale' ? 100 :
                    prop === 'caps' || prop === 'position' ? 'normal' :
                    prop === 'underlineOptions' || prop === 'strikethroughOptions' ? { style: 'none' } :
                    prop.includes('Scale') ? 100 : 0);
                });
              }}
              className="w-full p-2 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
            >
              <i className="fas fa-undo mr-1"></i>
              Reset Character Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

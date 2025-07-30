import React from 'react';
import { Layer } from '../../types';
import { ColorPicker } from './ColorPicker';
import { CharacterPanel } from './CharacterPanel';
import { CleanDropdown } from './CleanDropdown';

interface TypographyEditorProps {
  layer: Layer;
  onUpdateProperty: (property: string, value: any) => void;
}

// Popular font families for the dropdown
const FONT_FAMILIES = [
  { value: 'Inter, sans-serif', label: 'Inter', category: 'Sans Serif' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica', category: 'Sans Serif' },
  { value: 'Arial, sans-serif', label: 'Arial', category: 'Sans Serif' },
  { value: 'system-ui, sans-serif', label: 'System UI', category: 'Sans Serif' },
  { value: 'Roboto, sans-serif', label: 'Roboto', category: 'Sans Serif' },
  { value: 'Poppins, sans-serif', label: 'Poppins', category: 'Sans Serif' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat', category: 'Sans Serif' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans', category: 'Sans Serif' },
  { value: 'Georgia, serif', label: 'Georgia', category: 'Serif' },
  { value: 'Times New Roman, serif', label: 'Times New Roman', category: 'Serif' },
  { value: 'Playfair Display, serif', label: 'Playfair Display', category: 'Serif' },
  { value: 'Merriweather, serif', label: 'Merriweather', category: 'Serif' },
  { value: 'Monaco, monospace', label: 'Monaco', category: 'Monospace' },
  { value: 'Fira Code, monospace', label: 'Fira Code', category: 'Monospace' },
  { value: 'Source Code Pro, monospace', label: 'Source Code Pro', category: 'Monospace' },
];

const FONT_WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
];

export function TypographyEditor({ layer, onUpdateProperty }: TypographyEditorProps) {
  const style = layer.style;

  return (
    <div className="space-y-4">
      {/* Character Panel - Photoshop-style character controls */}
      <CharacterPanel 
        layer={layer}
        onUpdateProperty={onUpdateProperty}
      />

      {/* Main Typography Controls */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <i className="fas fa-font mr-2 text-gray-500"></i>
            Typography
          </h4>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Font Family */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Font Family</label>
            <CleanDropdown
              value={style.fontFamily || 'Inter, sans-serif'}
              onChange={(value) => onUpdateProperty('style.fontFamily', value)}
              options={FONT_FAMILIES.map(font => ({ 
                value: font.value, 
                label: font.label 
              }))}
              placeholder="Select font family"
              variant="elegant"
            />
          </div>

          {/* Font Size & Weight Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Font Size</label>
              <div className="relative">
                <input
                  type="number"
                  value={style.fontSize || 16}
                  onChange={(e) => onUpdateProperty('style.fontSize', parseInt(e.target.value))}
                  className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min="8"
                  max="200"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Font Weight</label>
              <CleanDropdown
                value={String(style.fontWeight || '400')}
                onChange={(value) => onUpdateProperty('style.fontWeight', value)}
                options={FONT_WEIGHTS.map(weight => ({ 
                  value: weight.value, 
                  label: weight.label 
                }))}
                placeholder="Select weight"
                variant="elegant"
              />
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Text Alignment</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {[
                { value: 'left', icon: 'fa-align-left' },
                { value: 'center', icon: 'fa-align-center' },
                { value: 'right', icon: 'fa-align-right' },
                { value: 'justify', icon: 'fa-align-justify' }
              ].map(align => (
                <button
                  key={align.value}
                  onClick={() => onUpdateProperty('style.textAlign', align.value)}
                  className={`flex-1 p-2 text-sm transition-colors ${
                    (style.textAlign || 'left') === align.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fas ${align.icon}`}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Line Height <span className="text-gray-400">({(style.lineHeight || 1.5).toFixed(1)})</span>
              </label>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.1"
                value={style.lineHeight || 1.5}
                onChange={(e) => onUpdateProperty('style.lineHeight', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Letter Spacing <span className="text-gray-400">({(style.letterSpacing || 0)}px)</span>
              </label>
              <input
                type="range"
                min="-5"
                max="10"
                step="0.5"
                value={style.letterSpacing || 0}
                onChange={(e) => onUpdateProperty('style.letterSpacing', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <i className="fas fa-palette mr-2 text-purple-600"></i>
              Text Color
            </label>
            <ColorPicker
              value={style.color || '#000000'}
              onChange={(color) => onUpdateProperty('style.color', color)}
            />
          </div>

          {/* Typography Presets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Quick Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Heading', style: { fontSize: 32, fontWeight: '700', lineHeight: 1.2 } },
                { name: 'Subheading', style: { fontSize: 24, fontWeight: '600', lineHeight: 1.3 } },
                { name: 'Body', style: { fontSize: 16, fontWeight: '400', lineHeight: 1.5 } },
                { name: 'Caption', style: { fontSize: 12, fontWeight: '400', lineHeight: 1.4 } }
              ].map(preset => (
                <button
                  key={preset.name}
                  onClick={() => {
                    Object.entries(preset.style).forEach(([key, value]) => {
                      onUpdateProperty(`style.${key}`, value);
                    });
                  }}
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors border border-gray-300"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
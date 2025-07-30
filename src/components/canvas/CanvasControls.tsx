import React from 'react';
import { CleanDropdown } from '../ui/CleanDropdown';
import { CanvasSettings } from '../../hooks/useCanvasSettings';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  settings: CanvasSettings;
  onToggleGrid: () => void;
  onToggleRulers: () => void;
  onToggleGuides: () => void;
  onToggleSnapToGrid: () => void;
  onSetGridSize: (size: number) => void;
  onPreviewAnimations: () => void;
  isPreviewMode: boolean;
}

export function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  settings,
  onToggleGrid,
  onToggleRulers,
  onToggleGuides,
  onToggleSnapToGrid,
  onSetGridSize,
  onPreviewAnimations,
  isPreviewMode
}: CanvasControlsProps) {
  return (
    <>
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-white rounded-lg shadow-md px-3 py-2">
        <button
          onClick={onZoomOut}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
        >
          <i className="fas fa-minus"></i>
        </button>
        <span className="text-sm font-medium flex items-center">
          <i className="fas fa-search mr-1"></i>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Advanced Canvas Controls */}
      <div className="absolute top-4 left-80 z-20 flex items-center space-x-2">
        <button
          onClick={onPreviewAnimations}
          disabled={isPreviewMode}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isPreviewMode
              ? 'bg-purple-500 text-white shadow-md cursor-not-allowed opacity-75'
              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-md'
          }`}
          title="Preview Animations (Space)"
        >
          <i className={`fas ${isPreviewMode ? 'fa-spinner fa-spin' : 'fa-play'} mr-1`}></i>
          {isPreviewMode ? 'Previewing...' : 'Preview'}
        </button>
        
        <button
          onClick={onToggleGrid}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.showGrid 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Grid (Ctrl+G)"
        >
          <i className="fas fa-grip-lines mr-1"></i>
          Grid
        </button>
        
        {settings.showGrid && (
          <CleanDropdown
            value={settings.gridSize.toString()}
            onChange={(value) => onSetGridSize(parseInt(value))}
            options={[
              { value: '10', label: '10px' },
              { value: '20', label: '20px' },
              { value: '25', label: '25px' },
              { value: '50', label: '50px' }
            ]}
            variant="compact"
            className="ml-2"
          />
        )}
        
        <button
          onClick={onToggleRulers}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.showRulers 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Rulers (Ctrl+R)"
        >
          <i className="fas fa-ruler mr-1"></i>
          Rulers
        </button>
        
        <button
          onClick={onToggleGuides}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.showGuides 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Smart Guides (Ctrl+;)"
        >
          <i className="fas fa-crosshairs mr-1"></i>
          Guides
        </button>
        
        <button
          onClick={onToggleSnapToGrid}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            settings.snapToGrid 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Snap to Grid (Ctrl+Shift)"
        >
          <i className="fas fa-magnet mr-1"></i>
          Snap
        </button>
      </div>
    </>
  );
}

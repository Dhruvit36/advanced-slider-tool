import React from 'react';

interface LayersPanelProps {
  layers: Array<{
    id: string;
    type: string;
    content: string;
  }>;
  timelineHeight: number;
}

export function LayersPanel({ layers, timelineHeight }: LayersPanelProps) {
  return (
    <div className="w-60 bg-gray-50 border-r border-gray-300 flex flex-col">
      {/* Header for layer panel */}
      <div className="h-6 bg-gray-200 border-b border-gray-300 flex items-center px-3">
        <span className="text-xs font-medium text-gray-700">Layers</span>
      </div>
      
      {/* Layer List */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: `${timelineHeight - 80}px` }}>
        {layers.map((layer, index) => (
          <div 
            key={layer.id} 
            className="h-10 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 flex items-center px-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 w-full">
              <i className={`fas ${
                layer.type === 'text' ? 'fa-font' :
                layer.type === 'button' ? 'fa-hand-pointer' :
                layer.type === 'image' ? 'fa-image' :
                'fa-shapes'
              }`} style={{ 
                color: layer.type === 'text' ? '#3b82f6' : 
                       layer.type === 'button' ? '#10b981' : 
                       layer.type === 'image' ? '#8b5cf6' : '#f59e0b',
                fontSize: '12px'
              }}></i>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 truncate">
                  {layer.content.slice(0, 20)}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {layer.type}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  className="w-4 h-4 rounded border border-gray-300 hover:bg-blue-50 flex items-center justify-center transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Toggle visibility"
                >
                  <i className="fas fa-eye text-gray-400" style={{ fontSize: '8px' }}></i>
                </button>
                <button 
                  className="w-4 h-4 rounded border border-gray-300 hover:bg-red-50 flex items-center justify-center transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Lock layer"
                >
                  <i className="fas fa-lock text-gray-400" style={{ fontSize: '8px' }}></i>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty state when no layers */}
        {(!layers || layers.length === 0) && (
          <div 
            className="text-center text-gray-500 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl mb-2">
              <i className="fas fa-layer-group text-gray-300"></i>
            </div>
            <p className="text-xs font-medium">No layers yet</p>
            <p className="text-xs text-gray-400 mt-1">Add elements to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { CleanDropdown } from '../ui/CleanDropdown';

interface TimelineControlsProps {
  isPlaying: boolean;
  currentTime: number;
  maxTime: number;
  timelineHeight: number;
  timelineScale: string;
  onTogglePlayback: () => void;
  onReset: () => void;
  onHeightChange: (height: number) => void;
  onScaleChange: (scale: string) => void;
  formatTime: (ms: number) => string;
}

export function TimelineControls({
  isPlaying,
  currentTime,
  maxTime,
  timelineHeight,
  timelineScale,
  onTogglePlayback,
  onReset,
  onHeightChange,
  onScaleChange,
  formatTime
}: TimelineControlsProps) {
  return (
    <div className="border-b border-border-light">
      {/* Main Controls Row */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onTogglePlayback}
            className={`text-white px-3 py-1.5 rounded-lg hover:opacity-90 text-sm flex items-center transition-all duration-200 shadow-md ${
              isPlaying 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            }`}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} mr-2`}></i>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-lg hover:opacity-90 text-sm flex items-center transition-all duration-200 shadow-md"
          >
            <i className="fas fa-stop mr-2"></i>
            Stop
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2">
            <i className="fas fa-ruler-horizontal text-xs text-gray-500"></i>
            <span className="text-xs text-gray-500">Scale:</span>
            <CleanDropdown
              value={timelineScale}
              onChange={onScaleChange}
              options={[
                { value: '50%', label: '50%' },
                { value: '75%', label: '75%' },
                { value: '100%', label: '100%' },
                { value: '150%', label: '150%' },
                { value: '200%', label: '200%' }
              ]}
              variant="compact"
            />
          </div>
          <div className="flex items-center space-x-1">
            <i className="fas fa-arrows-alt-v text-xs text-gray-500"></i>
            <span className="text-xs text-gray-500">Height:</span>
            <span className="text-xs text-gray-600 font-mono">{timelineHeight}px</span>
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={() => onHeightChange(100)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 100 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Compact (100px)"
              >
                S
              </button>
              <button
                onClick={() => onHeightChange(150)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 150 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Medium (150px)"
              >
                M
              </button>
              <button
                onClick={() => onHeightChange(200)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 200 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Large (200px)"
              >
                L
              </button>
              <button
                onClick={() => onHeightChange(300)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  timelineHeight === 300 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Extra Large (300px)"
              >
                XL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

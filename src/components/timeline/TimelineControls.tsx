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
    <div className="flex items-center justify-between px-2 sm:px-4 py-2 border-b border-border-light">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onTogglePlayback}
          className="bg-primary text-white px-2 sm:px-3 py-1 rounded hover:opacity-90 text-sm flex items-center"
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} mr-1`}></i>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onReset}
          className="bg-gray-500 text-white px-2 sm:px-3 py-1 rounded hover:opacity-90 text-sm flex items-center"
        >
          <i className="fas fa-stop mr-1"></i>
          Stop
        </button>
        <span className="text-xs sm:text-sm text-gray-600 flex items-center">
          <i className="fas fa-clock mr-1"></i>
          {formatTime(currentTime)} / {formatTime(maxTime)}
        </span>
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
  );
}

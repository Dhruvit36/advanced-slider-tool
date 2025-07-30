import React from 'react';

interface TimelinePlayheadProps {
  currentTime: number;
  maxTime: number;
  isPlaying: boolean;
  timelineHeight: number;
}

export function TimelinePlayhead({ currentTime, maxTime, isPlaying, timelineHeight }: TimelinePlayheadProps) {
  const progressPercent = Math.min((currentTime / maxTime) * 100, 100);
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 100);
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds}`;
    }
    return `${remainingSeconds}.${milliseconds}s`;
  };

  return (
    <>
      {/* Playhead in timeline markers area - reverse triangle shape */}
      <div 
        className="absolute top-0 z-20 transition-all duration-150 ease-out"
        style={{ left: `calc(${progressPercent}% - 8px)` }}
      >
        {/* Reverse triangle playhead with rounded corners */}
        <div 
          className={`relative w-4 h-6 transition-all duration-200 ${
            isPlaying 
              ? 'filter drop-shadow-lg' 
              : 'filter drop-shadow-md'
          }`}
        >
          {/* Main triangle shape */}
          <svg 
            width="16" 
            height="24" 
            viewBox="0 0 16 24" 
            className={`transition-all duration-200 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          >
            <path
              d="M2 2 L14 2 Q15 2 15 3 L15 18 L8 22 L1 18 L1 3 Q1 2 2 2 Z"
              className={`transition-all duration-200 ${
                isPlaying 
                  ? 'fill-red-500 stroke-red-600' 
                  : 'fill-blue-500 stroke-blue-600'
              }`}
              strokeWidth="1"
            />
            {/* Inner highlight */}
            <path
              d="M3 3 L13 3 Q13.5 3 13.5 3.5 L13.5 17 L8 20.5 L2.5 17 L2.5 3.5 Q2.5 3 3 3 Z"
              className="fill-white opacity-30"
            />
          </svg>
          
          {/* Time display tooltip */}
          <div 
            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-mono text-white shadow-lg transition-all duration-200 whitespace-nowrap ${
              isPlaying 
                ? 'bg-red-600' 
                : 'bg-blue-600'
            }`}
          >
            {formatTime(currentTime)}
            {/* Tooltip arrow */}
            <div 
              className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-transparent ${
                isPlaying 
                  ? 'border-t-red-600' 
                  : 'border-t-blue-600'
              }`}
              style={{ borderTopWidth: '4px' }}
            ></div>
          </div>
          
          {/* Glowing effect when playing */}
          {isPlaying && (
            <div 
              className="absolute inset-0 rounded-lg opacity-50 animate-ping"
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
                transform: 'scale(1.5)'
              }}
            ></div>
          )}
        </div>
      </div>
    </>
  );
}

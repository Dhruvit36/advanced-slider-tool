import React, { memo } from 'react';

// Static Timeline Markers Component - completely frozen
export const TimelineMarkers = memo(() => {
  // Hardcoded markers for 0-15 seconds to prevent any recalculation
  const staticMarkers = [
    { position: 0, label: '0s' },
    { position: 6.67, label: '1s' },
    { position: 13.33, label: '2s' },
    { position: 20, label: '3s' },
    { position: 26.67, label: '4s' },
    { position: 33.33, label: '5s' },
    { position: 40, label: '6s' },
    { position: 46.67, label: '7s' },
    { position: 53.33, label: '8s' },
    { position: 60, label: '9s' },
    { position: 66.67, label: '10s' },
    { position: 73.33, label: '11s' },
    { position: 80, label: '12s' },
    { position: 86.67, label: '13s' },
    { position: 93.33, label: '14s' },
    { position: 100, label: '15s' }
  ];
  
  return (
    <>
      {staticMarkers.map((marker, i) => (
        <div
          key={`static-marker-${i}`}
          className="absolute top-0 bottom-0 border-l border-gray-400"
          style={{ left: `${marker.position}%` }}
        >
          <span className="absolute top-0.5 left-1 text-xs text-gray-600 font-mono flex items-center">
            <i className="fas fa-clock mr-1" style={{ fontSize: '8px' }}></i>
            {marker.label}
          </span>
        </div>
      ))}
    </>
  );
});

TimelineMarkers.displayName = 'TimelineMarkers';

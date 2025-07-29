import React from 'react';
import { MediaLibrary } from '../MediaLibrary';

export function MediaPanel() {
  return (
    <div className="space-y-6">
      {/* Media Library Header */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
            <i className="fas fa-photo-video"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Media Library</h3>
            <p className="text-xs text-gray-500">Browse and manage your media assets</p>
          </div>
        </div>
      </div>

      {/* Media Library Component */}
      <MediaLibrary />
    </div>
  );
}

import React from 'react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', action: 'Play/Pause animation preview' },
    { key: 'Delete', action: 'Delete selected layer' },
    { key: 'Ctrl + Z', action: 'Undo last action' },
    { key: 'Ctrl + Y', action: 'Redo last action' },
    { key: 'Ctrl + C', action: 'Copy selected layer' },
    { key: 'Ctrl + V', action: 'Paste layer' },
    { key: 'Ctrl + D', action: 'Duplicate selected layer' },
    { key: 'Ctrl + S', action: 'Save project' },
    { key: 'Ctrl + E', action: 'Export project' },
    { key: 'Ctrl + N', action: 'New slide' },
    { key: 'Ctrl + T', action: 'Add text layer' },
    { key: 'Ctrl + B', action: 'Add button layer' },
    { key: 'Ctrl + I', action: 'Add image layer' },
    { key: 'Arrow Keys', action: 'Move selected layer by 1px' },
    { key: 'Shift + Arrow', action: 'Move selected layer by 10px' },
    { key: 'Ctrl + +', action: 'Zoom in' },
    { key: 'Ctrl + -', action: 'Zoom out' },
    { key: 'Ctrl + 0', action: 'Reset zoom to 100%' },
    { key: 'Tab', action: 'Switch between sidebar tabs' },
    { key: 'Escape', action: 'Deselect layer / Close modals' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Keyboard Shortcuts</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">{shortcut.action}</span>
              <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Pro Tips:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Hold Shift while dragging to constrain movement to horizontal/vertical</li>
            <li>• Double-click text layers to edit content directly</li>
            <li>• Use Ctrl+Mouse wheel to zoom in/out quickly</li>
            <li>• Right-click layers for context menu options</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

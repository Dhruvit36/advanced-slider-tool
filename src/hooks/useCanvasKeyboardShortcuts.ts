import { useEffect } from 'react';

interface UseCanvasKeyboardShortcutsProps {
  onToggleGrid: () => void;
  onToggleRulers: () => void;
  onToggleGuides: () => void;
  onToggleSnapToGrid: () => void;
}

export function useCanvasKeyboardShortcuts({
  onToggleGrid,
  onToggleRulers,
  onToggleGuides,
  onToggleSnapToGrid
}: UseCanvasKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case 'g':
          case 'G':
            e.preventDefault();
            onToggleGrid();
            break;
          case 'r':
          case 'R':
            e.preventDefault();
            onToggleRulers();
            break;
          case ';':
            e.preventDefault();
            if (e.shiftKey) {
              onToggleSnapToGrid();
            } else {
              onToggleGuides();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleGrid, onToggleRulers, onToggleGuides, onToggleSnapToGrid]);
}

import { useState, useEffect } from 'react';
import { useSlider } from '../context/SliderContext';

export function useKeyboardShortcuts() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { state, dispatch, saveProject } = useSlider();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // F1 - Show shortcuts
      if (e.key === 'F1') {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      // Escape - Close modals/deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowShortcuts(false);
        dispatch({ type: 'SELECT_LAYER', payload: null });
        return;
      }

      // Space - Play/Pause (will be handled by individual preview buttons)
      if (e.key === ' ') {
        e.preventDefault();
        // Trigger custom event for animation preview
        const event = new CustomEvent('triggerAnimationPreview');
        document.dispatchEvent(event);
        return;
      }

      // Delete - Delete selected layer
      if (e.key === 'Delete' && state.selectedLayerId && state.project) {
        e.preventDefault();
        const currentSlide = state.project.slides[state.currentSlideIndex];
        if (currentSlide) {
          dispatch({
            type: 'DELETE_LAYER',
            payload: {
              slideId: currentSlide.id,
              layerId: state.selectedLayerId
            }
          });
        }
        return;
      }

      // Ctrl combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Ctrl+Shift+Z = Redo
              dispatch({ type: 'REDO' });
            } else {
              // Ctrl+Z = Undo
              dispatch({ type: 'UNDO' });
            }
            break;
          case 'y':
            e.preventDefault();
            // Ctrl+Y = Redo (alternative)
            dispatch({ type: 'REDO' });
            break;
          case 's':
            e.preventDefault();
            // Save project
            saveProject();
            break;
          case 'e':
            e.preventDefault();
            // TODO: Open export modal
            console.log('Export - not implemented yet');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state, dispatch, saveProject]);

  return { showShortcuts, setShowShortcuts };
}
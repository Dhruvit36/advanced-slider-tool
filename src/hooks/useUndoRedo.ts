import { useState, useCallback } from 'react';
import { SliderProject } from '../types';

interface HistoryState {
  past: SliderProject[];
  present: SliderProject;
  future: SliderProject[];
}

export function useUndoRedo(initialState: SliderProject) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    });
  }, [canRedo]);

  const addToHistory = useCallback((newState: SliderProject) => {
    setHistory(currentHistory => ({
      past: [...currentHistory.past, currentHistory.present],
      present: newState,
      future: []
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory({
      past: [],
      present: initialState,
      future: []
    });
  }, [initialState]);

  return {
    state: history.present,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory,
    clearHistory
  };
}

export default useUndoRedo;

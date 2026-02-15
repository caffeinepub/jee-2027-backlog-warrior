import { useState, useEffect, useCallback } from 'react';

interface CurrentlyWorkingChapter {
  chapterId: string;
  startTime: number; // timestamp in milliseconds
}

interface CurrentlyWorkingState {
  chapters: CurrentlyWorkingChapter[];
  version: number;
}

const STORAGE_KEY = 'currently-working-chapters';
const STORAGE_VERSION = 1;

function loadState(): CurrentlyWorkingState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { chapters: [], version: STORAGE_VERSION };
    }
    const parsed = JSON.parse(stored);
    if (parsed.version !== STORAGE_VERSION) {
      return { chapters: [], version: STORAGE_VERSION };
    }
    return parsed;
  } catch {
    return { chapters: [], version: STORAGE_VERSION };
  }
}

function saveState(state: CurrentlyWorkingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save currently working state:', error);
  }
}

export function useCurrentlyWorkingChapters() {
  const [state, setState] = useState<CurrentlyWorkingState>(loadState);
  const [now, setNow] = useState(Date.now());

  // Update 'now' every second for live elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const startWorking = useCallback((chapterId: string) => {
    setState(prev => {
      // Check if already working on this chapter
      const existing = prev.chapters.find(ch => ch.chapterId === chapterId);
      if (existing) {
        return prev; // Already working on it
      }
      return {
        ...prev,
        chapters: [...prev.chapters, { chapterId, startTime: Date.now() }],
      };
    });
  }, []);

  const stopWorking = useCallback((chapterId: string) => {
    setState(prev => ({
      ...prev,
      chapters: prev.chapters.filter(ch => ch.chapterId !== chapterId),
    }));
  }, []);

  const isWorking = useCallback((chapterId: string) => {
    return state.chapters.some(ch => ch.chapterId === chapterId);
  }, [state.chapters]);

  const getElapsedTime = useCallback((chapterId: string): number => {
    const chapter = state.chapters.find(ch => ch.chapterId === chapterId);
    if (!chapter) return 0;
    return Math.floor((now - chapter.startTime) / 1000); // elapsed seconds
  }, [state.chapters, now]);

  const getActiveChapters = useCallback(() => {
    return state.chapters.map(ch => ({
      chapterId: ch.chapterId,
      elapsedSeconds: Math.floor((now - ch.startTime) / 1000),
    }));
  }, [state.chapters, now]);

  return {
    startWorking,
    stopWorking,
    isWorking,
    getElapsedTime,
    getActiveChapters,
  };
}

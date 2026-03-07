import { useState, useEffect, useRef } from 'react';
import { INITIAL_CHAPTERS, type Chapter, type ChapterStatus } from '../data/chapters';

const STORAGE_KEY = 'jee-chapters';
const STORAGE_VERSION = 3;
const INSTANCE_ID = `instance-${Date.now()}-${Math.random()}`;

interface StoredChapters {
  version: number;
  chapters: Chapter[];
  lastModified: number;
  instanceId?: string;
}

export function useChapterData() {
  const isInitialMount = useRef(true);
  
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredChapters = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && Array.isArray(data.chapters) && data.chapters.length > 0) {
          return data.chapters;
        }
      }
    } catch (error) {
      console.error('Failed to load chapters:', error);
    }
    return INITIAL_CHAPTERS;
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      const data: StoredChapters = {
        version: STORAGE_VERSION,
        chapters,
        lastModified: Date.now(),
        instanceId: INSTANCE_ID,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save chapters:', error);
    }
  }, [chapters]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const data: StoredChapters = JSON.parse(e.newValue);
          if (data.instanceId !== INSTANCE_ID && data.version === STORAGE_VERSION) {
            setChapters(data.chapters);
          }
        } catch (error) {
          console.error('Failed to sync chapters:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateChapterStatus = (id: string, status: ChapterStatus) => {
    setChapters(prev =>
      prev.map(ch => (ch.id === id ? { ...ch, status } : ch))
    );
  };

  const updateChapterFields = (id: string, updates: Partial<Chapter>) => {
    setChapters(prev =>
      prev.map(ch => (ch.id === id ? { ...ch, ...updates } : ch))
    );
  };

  const addChapter = (chapter: Chapter) => {
    setChapters(prev => [...prev, chapter]);
  };

  const deleteChapter = (id: string) => {
    setChapters(prev => prev.filter(ch => ch.id !== id));
  };

  const deleteChaptersBySubjectId = (subjectId: string) => {
    setChapters(prev => prev.filter(ch => ch.subjectId !== subjectId));
  };

  return {
    chapters,
    updateChapterStatus,
    updateChapterFields,
    addChapter,
    deleteChapter,
    deleteChaptersBySubjectId,
  };
}

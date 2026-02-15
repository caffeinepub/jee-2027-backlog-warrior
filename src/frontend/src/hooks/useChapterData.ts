import { useState, useEffect } from 'react';
import { INITIAL_CHAPTERS, type Chapter, type ChapterStatus } from '../data/chapters';
import { LEGACY_SUBJECT_NAME_MAP } from '../data/subjects';

const STORAGE_KEY = 'jee-chapters-data';
const STORAGE_VERSION = 3;
const CHAPTER_UPDATE_EVENT = 'chapter-data-updated';

interface StoredChapters {
  version: number;
  chapters: Chapter[];
}

// Legacy chapter type for migration
interface LegacyChapter {
  id: string;
  name: string;
  totalLectures: number;
  lectureDuration: number;
  status: ChapterStatus;
  subject?: string;
  subjectId?: string;
  targetHoursOverride?: number;
}

function migrateChapters(chapters: LegacyChapter[]): Chapter[] {
  return chapters.map(ch => {
    const result: Chapter = {
      id: ch.id,
      name: ch.name,
      totalLectures: ch.totalLectures,
      lectureDuration: ch.lectureDuration,
      status: ch.status,
      subjectId: ch.subjectId || LEGACY_SUBJECT_NAME_MAP[ch.subject || 'Mathematics'] || 'mathematics',
    };
    
    // Preserve targetHoursOverride if it exists
    if (ch.targetHoursOverride !== undefined) {
      result.targetHoursOverride = ch.targetHoursOverride;
    }
    
    return result;
  });
}

function loadChaptersFromStorage(): Chapter[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      
      // Handle versioned storage
      if (data.version === STORAGE_VERSION) {
        return data.chapters;
      }
      
      // Handle legacy storage (array or old version)
      const legacyChapters = Array.isArray(data) ? data : (data.chapters || []);
      if (legacyChapters.length > 0) {
        return migrateChapters(legacyChapters);
      }
    }
  } catch (error) {
    console.error('Failed to load chapters:', error);
  }
  return INITIAL_CHAPTERS;
}

export function useChapterData() {
  const [chapters, setChapters] = useState<Chapter[]>(loadChaptersFromStorage);

  // Listen for chapter updates from other hook instances
  useEffect(() => {
    const handleChapterUpdate = () => {
      setChapters(loadChaptersFromStorage());
    };

    window.addEventListener(CHAPTER_UPDATE_EVENT, handleChapterUpdate);
    return () => window.removeEventListener(CHAPTER_UPDATE_EVENT, handleChapterUpdate);
  }, []);

  // Save to localStorage and notify other instances
  useEffect(() => {
    try {
      const data: StoredChapters = {
        version: STORAGE_VERSION,
        chapters,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      // Notify other hook instances of the update
      window.dispatchEvent(new CustomEvent(CHAPTER_UPDATE_EVENT));
    } catch (error) {
      console.error('Failed to save chapters:', error);
    }
  }, [chapters]);

  const updateChapterStatus = (chapterId: string, status: ChapterStatus) => {
    setChapters(prev =>
      prev.map(ch => (ch.id === chapterId ? { ...ch, status } : ch))
    );
  };

  const updateChapterFields = (
    chapterId: string,
    updates: { totalLectures?: number; targetHoursOverride?: number }
  ) => {
    setChapters(prev =>
      prev.map(ch => {
        if (ch.id === chapterId) {
          const updated = { ...ch };
          if (updates.totalLectures !== undefined) {
            updated.totalLectures = updates.totalLectures;
          }
          if (updates.targetHoursOverride !== undefined) {
            updated.targetHoursOverride = updates.targetHoursOverride;
          }
          return updated;
        }
        return ch;
      })
    );
  };

  const addChapter = (
    subjectId: string,
    name: string,
    totalLectures: number,
    lectureDuration: number = 90
  ): boolean => {
    const trimmedName = name.trim();
    if (!trimmedName || totalLectures <= 0) return false;

    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      name: trimmedName,
      totalLectures,
      lectureDuration,
      status: 'Not Started',
      subjectId,
    };

    setChapters(prev => [...prev, newChapter]);
    return true;
  };

  return {
    chapters,
    updateChapterStatus,
    updateChapterFields,
    addChapter,
  };
}

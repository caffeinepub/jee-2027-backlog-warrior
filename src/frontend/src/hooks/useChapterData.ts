import { useState, useEffect } from 'react';
import { INITIAL_CHAPTERS, type Chapter, type ChapterStatus } from '../data/chapters';
import { LEGACY_SUBJECT_NAME_MAP } from '../data/subjects';

const STORAGE_KEY = 'jee-chapters-data';
const STORAGE_VERSION = 2;

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
}

function migrateChapters(chapters: LegacyChapter[]): Chapter[] {
  return chapters.map(ch => {
    if (ch.subjectId) {
      return ch as Chapter;
    }
    // Migrate old subject field to subjectId
    const legacySubject = ch.subject || 'Mathematics';
    const subjectId = LEGACY_SUBJECT_NAME_MAP[legacySubject] || 'mathematics';
    return {
      ...ch,
      subjectId,
    } as Chapter;
  });
}

export function useChapterData() {
  const [chapters, setChapters] = useState<Chapter[]>(() => {
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
  });

  useEffect(() => {
    try {
      const data: StoredChapters = {
        version: STORAGE_VERSION,
        chapters,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save chapters:', error);
    }
  }, [chapters]);

  const updateChapterStatus = (chapterId: string, status: ChapterStatus) => {
    setChapters(prev =>
      prev.map(ch => (ch.id === chapterId ? { ...ch, status } : ch))
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
    addChapter,
  };
}

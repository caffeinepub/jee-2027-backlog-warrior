import { useState, useEffect } from 'react';
import { DEFAULT_SUBJECTS, type Subject } from '../data/subjects';

const STORAGE_KEY = 'jee-subjects';
const STORAGE_VERSION = 2;

interface StoredSubjectsV1 {
  version: 1;
  subjects: Array<{ id: string; name: string }>;
}

interface StoredSubjectsV2 {
  version: 2;
  subjects: Subject[];
}

type StoredSubjects = StoredSubjectsV1 | StoredSubjectsV2;

function migrateSubjects(data: StoredSubjects): Subject[] {
  if (data.version === 2) {
    return data.subjects;
  }
  
  // Migrate from v1 to v2: add isDefault flag
  if (data.version === 1) {
    const defaultIds = new Set(DEFAULT_SUBJECTS.map(s => s.id));
    return data.subjects.map(subject => ({
      ...subject,
      isDefault: defaultIds.has(subject.id),
    }));
  }
  
  return DEFAULT_SUBJECTS;
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredSubjects = JSON.parse(stored);
        if (data.version && Array.isArray(data.subjects) && data.subjects.length > 0) {
          return migrateSubjects(data);
        }
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
    return DEFAULT_SUBJECTS;
  });

  useEffect(() => {
    try {
      const data: StoredSubjectsV2 = {
        version: STORAGE_VERSION,
        subjects,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save subjects:', error);
    }
  }, [subjects]);

  const addSubject = (name: string): boolean => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    
    // Check for duplicate names (case-insensitive)
    const isDuplicate = subjects.some(
      s => s.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) return false;

    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name: trimmedName,
      isDefault: false,
    };
    
    setSubjects(prev => [...prev, newSubject]);
    return true;
  };

  const deleteSubject = (subjectId: string): boolean => {
    try {
      // Prevent deletion of default subjects
      const subject = subjects.find(s => s.id === subjectId);
      if (subject?.isDefault) {
        return false;
      }
      
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      return true;
    } catch (error) {
      console.error('Failed to delete subject:', error);
      return false;
    }
  };

  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(s => s.id === id);
  };

  const getSubjectByName = (name: string): Subject | undefined => {
    return subjects.find(s => s.name.toLowerCase() === name.toLowerCase());
  };

  return {
    subjects,
    addSubject,
    deleteSubject,
    getSubjectById,
    getSubjectByName,
  };
}

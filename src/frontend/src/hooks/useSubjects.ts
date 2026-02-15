import { useState, useEffect } from 'react';
import { DEFAULT_SUBJECTS, type Subject } from '../data/subjects';

const STORAGE_KEY = 'jee-subjects';
const STORAGE_VERSION = 1;

interface StoredSubjects {
  version: number;
  subjects: Subject[];
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredSubjects = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && Array.isArray(data.subjects) && data.subjects.length > 0) {
          return data.subjects;
        }
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
    return DEFAULT_SUBJECTS;
  });

  useEffect(() => {
    try {
      const data: StoredSubjects = {
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
    };
    
    setSubjects(prev => [...prev, newSubject]);
    return true;
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
    getSubjectById,
    getSubjectByName,
  };
}

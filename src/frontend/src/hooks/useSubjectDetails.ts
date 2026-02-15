import { useState, useEffect } from 'react';

export interface SubjectDetails {
  subjectId: string;
  totalLectures?: number;
  targetHours?: number;
  finishDate?: string;
  finishDateOverride?: boolean;
}

const STORAGE_KEY = 'jee-subject-details';
const STORAGE_VERSION = 1;

interface StoredSubjectDetails {
  version: number;
  details: Record<string, SubjectDetails>;
}

export function useSubjectDetails() {
  const [details, setDetails] = useState<Record<string, SubjectDetails>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredSubjectDetails = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && data.details) {
          return data.details;
        }
      }
    } catch (error) {
      console.error('Failed to load subject details:', error);
    }
    return {};
  });

  useEffect(() => {
    try {
      const data: StoredSubjectDetails = {
        version: STORAGE_VERSION,
        details,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save subject details:', error);
    }
  }, [details]);

  const getSubjectDetails = (subjectId: string): SubjectDetails | undefined => {
    return details[subjectId];
  };

  const updateSubjectDetails = (subjectId: string, updates: Partial<SubjectDetails>) => {
    setDetails(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        subjectId,
        ...updates,
      },
    }));
  };

  return {
    getSubjectDetails,
    updateSubjectDetails,
  };
}

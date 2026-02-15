export interface Subject {
  id: string;
  name: string;
}

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
];

// Legacy route mapping for backward compatibility
export const LEGACY_ROUTE_MAP: Record<string, string> = {
  '/math': 'mathematics',
  '/physics': 'physics',
  '/chemistry': 'chemistry',
};

// Legacy subject name mapping for data migration
export const LEGACY_SUBJECT_NAME_MAP: Record<string, string> = {
  'Mathematics': 'mathematics',
  'Physics': 'physics',
  'Chemistry': 'chemistry',
};

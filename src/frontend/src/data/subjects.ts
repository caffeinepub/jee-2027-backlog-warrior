import { BookOpen, Atom, FlaskConical, Brain, Calculator, Globe, Microscope, Dna, Zap, Beaker } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Subject {
  id: string;
  name: string;
  isDefault?: boolean;
}

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'mathematics', name: 'Mathematics', isDefault: true },
  { id: 'physics', name: 'Physics', isDefault: true },
  { id: 'chemistry', name: 'Chemistry', isDefault: true },
];

// Icon mapping for subjects
export const SUBJECT_ICON_MAP: Record<string, LucideIcon> = {
  'mathematics': Calculator,
  'physics': Atom,
  'chemistry': FlaskConical,
  'biology': Dna,
  'computer science': Brain,
  'geography': Globe,
  'science': Microscope,
  'electronics': Zap,
  'organic chemistry': Beaker,
};

export function getSubjectIcon(subjectName: string): LucideIcon {
  const lowerName = subjectName.toLowerCase();
  
  // Exact match
  if (SUBJECT_ICON_MAP[lowerName]) {
    return SUBJECT_ICON_MAP[lowerName];
  }
  
  // Partial match
  for (const [key, icon] of Object.entries(SUBJECT_ICON_MAP)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return icon;
    }
  }
  
  // Default icon
  return BookOpen;
}

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

export type ChapterStatus = 'Not Started' | 'Incomplete' | 'Tough' | 'Completed';

export interface Chapter {
  id: string;
  name: string;
  totalLectures: number;
  lectureDuration: number;
  status: ChapterStatus;
  subjectId: string;
}

export const INITIAL_CHAPTERS: Chapter[] = [
  // Mathematics (24 chapters)
  { id: 'math-1', name: 'Sets, Relations and Functions', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-2', name: 'Complex Numbers', totalLectures: 15, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-3', name: 'Quadratic Equations', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-4', name: 'Sequences and Series', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-5', name: 'Permutations and Combinations', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-6', name: 'Binomial Theorem', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-7', name: 'Matrices and Determinants', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-8', name: 'Probability', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-9', name: 'Trigonometry', totalLectures: 20, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-10', name: 'Coordinate Geometry - Straight Lines', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-11', name: 'Coordinate Geometry - Circles', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-12', name: 'Coordinate Geometry - Parabola', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-13', name: 'Coordinate Geometry - Ellipse', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-14', name: 'Coordinate Geometry - Hyperbola', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-15', name: 'Vector Algebra', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-16', name: '3D Geometry', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-17', name: 'Limits', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-18', name: 'Continuity and Differentiability', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-19', name: 'Application of Derivatives', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-20', name: 'Indefinite Integration', totalLectures: 20, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-21', name: 'Definite Integration', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-22', name: 'Area Under Curves', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-23', name: 'Differential Equations', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-24', name: 'Mathematical Reasoning', totalLectures: 6, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  
  // Physics (20 chapters)
  { id: 'phys-1', name: 'Units and Measurements', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-2', name: 'Kinematics', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-3', name: 'Laws of Motion', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-4', name: 'Work, Energy and Power', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-5', name: 'Rotational Motion', totalLectures: 20, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-6', name: 'Gravitation', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-7', name: 'Properties of Matter', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-8', name: 'Thermodynamics', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-9', name: 'Kinetic Theory of Gases', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-10', name: 'Oscillations', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-11', name: 'Waves', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-12', name: 'Electrostatics', totalLectures: 20, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-13', name: 'Current Electricity', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-14', name: 'Magnetic Effects of Current', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-15', name: 'Magnetism and Matter', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-16', name: 'Electromagnetic Induction', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-17', name: 'Optics', totalLectures: 22, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-18', name: 'Modern Physics', totalLectures: 24, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-19', name: 'Semiconductor Electronics', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phys-20', name: 'Communication Systems', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  
  // Chemistry (22 chapters)
  { id: 'chem-1', name: 'Some Basic Concepts', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-2', name: 'Atomic Structure', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-3', name: 'Chemical Bonding', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-4', name: 'States of Matter', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-5', name: 'Thermodynamics', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-6', name: 'Chemical Equilibrium', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-7', name: 'Ionic Equilibrium', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-8', name: 'Redox Reactions', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-9', name: 'Electrochemistry', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-10', name: 'Chemical Kinetics', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-11', name: 'Surface Chemistry', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-12', name: 'Periodic Table', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-13', name: 'Hydrogen', totalLectures: 6, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-14', name: 'S-Block Elements', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-15', name: 'P-Block Elements', totalLectures: 20, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-16', name: 'D and F Block Elements', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-17', name: 'Coordination Compounds', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-18', name: 'Organic Chemistry Basics', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-19', name: 'Hydrocarbons', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-20', name: 'Organic Compounds with Functional Groups', totalLectures: 24, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-21', name: 'Biomolecules', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-22', name: 'Polymers and Chemistry in Everyday Life', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
];

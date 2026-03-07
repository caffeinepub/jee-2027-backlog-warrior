export type ChapterStatus = 'Not Started' | 'Incomplete' | 'Tough' | 'Completed';

export interface Chapter {
  id: string;
  name: string;
  totalLectures: number;
  lectureDuration: number;
  status: ChapterStatus;
  subjectId: string;
  targetHoursOverride?: number;
}

export const INITIAL_CHAPTERS: Chapter[] = [
  // Mathematics chapters
  { id: 'math-1', name: 'Sets, Relations and Functions', totalLectures: 15, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-2', name: 'Complex Numbers', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-3', name: 'Quadratic Equations', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-4', name: 'Sequences and Series', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-5', name: 'Permutations and Combinations', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-6', name: 'Binomial Theorem', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-7', name: 'Matrices and Determinants', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-8', name: 'Probability', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-9', name: 'Trigonometry', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-10', name: 'Coordinate Geometry - Straight Lines', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-11', name: 'Coordinate Geometry - Circles', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-12', name: 'Coordinate Geometry - Parabola', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-13', name: 'Coordinate Geometry - Ellipse', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-14', name: 'Coordinate Geometry - Hyperbola', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-15', name: 'Vector Algebra', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-16', name: '3D Geometry', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-17', name: 'Limits', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-18', name: 'Continuity and Differentiability', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-19', name: 'Application of Derivatives', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-20', name: 'Indefinite Integration', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-21', name: 'Definite Integration', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-22', name: 'Area Under Curves', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },
  { id: 'math-23', name: 'Differential Equations', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'mathematics' },

  // Physics chapters
  { id: 'phy-1', name: 'Units and Measurements', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-2', name: 'Kinematics', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-3', name: 'Laws of Motion', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-4', name: 'Work, Energy and Power', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-5', name: 'Rotational Motion', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-6', name: 'Gravitation', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-7', name: 'Properties of Solids and Liquids', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-8', name: 'Thermodynamics', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-9', name: 'Kinetic Theory of Gases', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-10', name: 'Oscillations', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-11', name: 'Waves', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-12', name: 'Electrostatics', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-13', name: 'Current Electricity', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-14', name: 'Magnetic Effects of Current', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-15', name: 'Magnetism and Matter', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-16', name: 'Electromagnetic Induction', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-17', name: 'Alternating Current', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-18', name: 'Electromagnetic Waves', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-19', name: 'Ray Optics', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-20', name: 'Wave Optics', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-21', name: 'Dual Nature of Matter', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-22', name: 'Atoms and Nuclei', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-23', name: 'Semiconductor Electronics', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },
  { id: 'phy-24', name: 'Communication Systems', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'physics' },

  // Chemistry chapters
  { id: 'chem-1', name: 'Some Basic Concepts', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-2', name: 'Atomic Structure', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-3', name: 'Chemical Bonding', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-4', name: 'States of Matter', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-5', name: 'Thermodynamics', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-6', name: 'Chemical Equilibrium', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-7', name: 'Ionic Equilibrium', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-8', name: 'Redox Reactions', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-9', name: 'Electrochemistry', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-10', name: 'Chemical Kinetics', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-11', name: 'Surface Chemistry', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-12', name: 'Solid State', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-13', name: 'Solutions', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-14', name: 'Periodic Table', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-15', name: 'Hydrogen', totalLectures: 6, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-16', name: 'S-Block Elements', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-17', name: 'P-Block Elements', totalLectures: 18, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-18', name: 'D and F Block Elements', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-19', name: 'Coordination Compounds', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-20', name: 'General Organic Chemistry', totalLectures: 16, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-21', name: 'Hydrocarbons', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-22', name: 'Haloalkanes and Haloarenes', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-23', name: 'Alcohols, Phenols and Ethers', totalLectures: 14, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-24', name: 'Aldehydes and Ketones', totalLectures: 12, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-25', name: 'Carboxylic Acids', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-26', name: 'Amines', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-27', name: 'Biomolecules', totalLectures: 10, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-28', name: 'Polymers', totalLectures: 8, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
  { id: 'chem-29', name: 'Chemistry in Everyday Life', totalLectures: 6, lectureDuration: 90, status: 'Not Started', subjectId: 'chemistry' },
];

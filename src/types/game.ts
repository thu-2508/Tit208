import { PronunciationGroup, VerbItem } from '../data/verbs';

export interface StudentProfile {
  fullName: string;
  className: string;
  school: string;
}

export type AppScreen =
  | 'LOGIN'
  | 'INSTRUCTIONS'
  | 'PLAYING'
  | 'REVIEW_ROUND'
  | 'RESULTS'
  | 'REVIEW_ANSWERS'
  | 'CERTIFICATE'
  | 'TEACHER_REPORT'
  | 'TEACHER_SETUP'
  | 'PRONUNCIATION_RULES';

export type PerformanceTier =
  | 'Outstanding'
  | 'Excellent'
  | 'Good'
  | 'Keep Practising'
  | 'More Practice Needed';

export interface TeacherSettings {
  grade: string;
  wordCount: number; // 20, 30, 40, 50
  initialTimeMinutes: number; // 15, 20, 25, 30
  reviewTimeMode: 'fixed_5min' | '20s_per_word';
  showMeaningVi: boolean;
  listenCompareEnabled: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  shuffled: boolean;
  selectedVerbIds: number[];
}

export interface GameSummary {
  student: StudentProfile;
  activeVerbs: VerbItem[];
  initialPlacements: Record<number, PronunciationGroup | null>;
  initialCorrectMap: Record<number, boolean>;
  reviewPlacements: Record<number, PronunciationGroup | null>;
  reviewCorrectMap: Record<number, boolean>;
  audioPlayCounts: Record<number, number>;
  timeUsedSeconds: number;
  initialScore: number;
  reviewScore: number;
  finalScore: number;
  maxScore: number;
  percentage: number;
  completionDate: string;
  performanceLevel: PerformanceTier;
  sGroupStats: { correct: number; total: number };
  izGroupStats: { correct: number; total: number };
  zGroupStats: { correct: number; total: number };
  weakestGroup: PronunciationGroup;
  strongestGroup: PronunciationGroup;
  teacherCommentVi: string;
  teacherCommentEn: string;
  isEligibleForCertificate: boolean;
}

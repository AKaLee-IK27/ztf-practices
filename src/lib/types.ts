// Core domain types for ZTF Practice.
// JSON exam files in src/exams/**/*.json must conform to the Exam interface.

export type ExamType = 'technical' | 'za';
export type Language = 'en' | 'vi';
export type QuestionType = 'single' | 'multi';

export interface Option {
  /** Stable id, e.g. 'a', 'b'. Must be unique within a question. */
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topic?: string;
  type: QuestionType;
  prompt: string;
  /** Optional code snippet rendered with monospace + pre-wrap. */
  code?: string | null;
  options: Option[];
  /** Always an array. For single-correct, length === 1. */
  correct: string[];
  /** Required: shown in ResultsView for learning. */
  explanation: string;
}

export interface Exam {
  id: string;
  type: ExamType;
  title: string;
  language: Language;
  durationMinutes: number;
  totalQuestions: number;
  /** Optional pass threshold (0-100). */
  passingScore?: number;
  /** ISO date string. */
  createdAt: string;
  topics?: string[];
  questions: Question[];
}

/** User's answer for a single question — selected option ids. */
export type Answer = string[];

export interface PerQuestionResult {
  questionId: string;
  selected: string[];
  correct: string[];
  isCorrect: boolean;
}

export interface AttemptResult {
  /** Unique attempt id, e.g. timestamp-based. */
  attemptId: string;
  examId: string;
  /** ISO timestamps. */
  startedAt: string;
  submittedAt: string;
  /** Actual seconds spent (clamped to durationMinutes * 60). */
  durationSeconds: number;
  /** questionId -> selected option ids. Missing key = unanswered. */
  answers: Record<string, Answer>;
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  perQuestion: PerQuestionResult[];
}

/** Auto-saved state while taking an exam. */
export interface InProgressState {
  examId: string;
  startedAt: string;
  answers: Record<string, Answer>;
  flagged: string[];
  currentQuestionIndex: number;
}

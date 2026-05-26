import type { AttemptResult, InProgressState } from './types';

const NS = 'ztp';
const ATTEMPTS_KEY = `${NS}:attempts`;
const inProgressKey = (examId: string) => `${NS}:inProgress:${examId}`;

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    // Bad JSON or storage disabled — surface in console for debugging but don't throw.
    console.warn(`[storage] failed to read ${key}:`, err);
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] failed to write ${key}:`, err);
  }
}

// ---- Attempts (history) ----

export function getAllAttempts(): AttemptResult[] {
  return safeGet<AttemptResult[]>(ATTEMPTS_KEY) ?? [];
}

export function getAttemptsForExam(examId: string): AttemptResult[] {
  return getAllAttempts().filter((a) => a.examId === examId);
}

export function getAttemptById(attemptId: string): AttemptResult | null {
  return getAllAttempts().find((a) => a.attemptId === attemptId) ?? null;
}

export function saveAttempt(attempt: AttemptResult): void {
  const all = getAllAttempts();
  all.push(attempt);
  safeSet(ATTEMPTS_KEY, all);
}

/** Best score % across attempts for an exam. Returns null if no attempts. */
export function bestScore(examId: string): number | null {
  const attempts = getAttemptsForExam(examId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map((a) => a.score.percentage));
}

/** Most recent attempt for an exam, or null. */
export function lastAttempt(examId: string): AttemptResult | null {
  const attempts = getAttemptsForExam(examId);
  if (attempts.length === 0) return null;
  return attempts.reduce((latest, a) =>
    new Date(a.submittedAt) > new Date(latest.submittedAt) ? a : latest,
  );
}

// ---- In-progress (auto-save during exam) ----

export function getInProgress(examId: string): InProgressState | null {
  return safeGet<InProgressState>(inProgressKey(examId));
}

export function saveInProgress(state: InProgressState): void {
  safeSet(inProgressKey(state.examId), state);
}

export function clearInProgress(examId: string): void {
  try {
    localStorage.removeItem(inProgressKey(examId));
  } catch (err) {
    console.warn(`[storage] failed to clear inProgress for ${examId}:`, err);
  }
}

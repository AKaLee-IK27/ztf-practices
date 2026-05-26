import type { Exam } from './types';

// Vite glob: eager-loads all exam JSON files at build time so we never need
// a manifest. Drop a new file under src/exams/**/*.json → it auto-appears.
const modules = import.meta.glob<{ default: Exam }>('../exams/**/*.json', { eager: true });

/** Lightweight runtime validation. Logs warnings for bad files but never throws. */
function isValidExam(value: unknown): value is Exam {
  if (typeof value !== 'object' || value === null) return false;
  const e = value as Partial<Exam>;
  if (typeof e.id !== 'string' || !e.id) return false;
  if (e.type !== 'technical' && e.type !== 'za') return false;
  if (typeof e.title !== 'string') return false;
  if (e.language !== 'en' && e.language !== 'vi') return false;
  if (typeof e.durationMinutes !== 'number' || e.durationMinutes <= 0) return false;
  if (!Array.isArray(e.questions) || e.questions.length === 0) return false;

  for (const q of e.questions) {
    if (typeof q.id !== 'string' || !q.id) return false;
    if (q.type !== 'single' && q.type !== 'multi') return false;
    if (typeof q.prompt !== 'string' || !q.prompt) return false;
    if (!Array.isArray(q.options) || q.options.length < 2) return false;
    if (!Array.isArray(q.correct) || q.correct.length === 0) return false;
    if (typeof q.explanation !== 'string') return false;
    // All correct ids must reference real options.
    const optionIds = new Set(q.options.map((o) => o.id));
    if (!q.correct.every((c) => optionIds.has(c))) return false;
  }

  return true;
}

const exams: Exam[] = [];
for (const [path, mod] of Object.entries(modules)) {
  const data = mod.default;
  if (!isValidExam(data)) {
    console.warn(`[examLoader] skipping invalid exam file: ${path}`);
    continue;
  }
  exams.push(data);
}

// Sort by id so new exams (higher numbers) appear last consistently.
exams.sort((a, b) => a.id.localeCompare(b.id));

export function getAllExams(): Exam[] {
  return exams;
}

export function getExamsByType(type: Exam['type']): Exam[] {
  return exams.filter((e) => e.type === type);
}

export function getExamById(id: string): Exam | undefined {
  return exams.find((e) => e.id === id);
}

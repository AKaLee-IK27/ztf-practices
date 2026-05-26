import type { Answer, AttemptResult, Exam, PerQuestionResult, Question } from './types';

/**
 * Multi-correct is scored all-or-nothing: selected set must equal correct set.
 * Order doesn't matter; duplicates in `selected` are ignored.
 */
export function isAnswerCorrect(selected: Answer, correct: string[]): boolean {
  const sel = new Set(selected);
  if (sel.size !== correct.length) return false;
  return correct.every((c) => sel.has(c));
}

export function scoreAttempt(
  exam: Exam,
  answers: Record<string, Answer>,
  startedAt: string,
  submittedAt: string,
): AttemptResult {
  const perQuestion: PerQuestionResult[] = exam.questions.map((q: Question) => {
    const selected = answers[q.id] ?? [];
    return {
      questionId: q.id,
      selected,
      correct: q.correct,
      isCorrect: isAnswerCorrect(selected, q.correct),
    };
  });

  const correct = perQuestion.filter((r) => r.isCorrect).length;
  const total = exam.questions.length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  const durationSeconds = Math.max(
    0,
    Math.min(
      exam.durationMinutes * 60,
      Math.floor((new Date(submittedAt).getTime() - new Date(startedAt).getTime()) / 1000),
    ),
  );

  return {
    attemptId: `attempt-${Date.now()}`,
    examId: exam.id,
    startedAt,
    submittedAt,
    durationSeconds,
    answers,
    score: { correct, total, percentage },
    perQuestion,
  };
}

/** Topic breakdown for ResultsView. Returns null if exam has no topics on questions. */
export function topicBreakdown(
  exam: Exam,
  perQuestion: PerQuestionResult[],
): Array<{ topic: string; correct: number; total: number; percentage: number }> | null {
  const hasTopics = exam.questions.some((q) => q.topic);
  if (!hasTopics) return null;

  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const q of exam.questions) {
    const topic = q.topic ?? 'Other';
    const result = perQuestion.find((r) => r.questionId === q.id);
    const entry = byTopic.get(topic) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (result?.isCorrect) entry.correct += 1;
    byTopic.set(topic, entry);
  }

  return Array.from(byTopic.entries())
    .map(([topic, { correct, total }]) => ({
      topic,
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

import { describe, expect, it } from 'vitest';
import { isAnswerCorrect, scoreAttempt, topicBreakdown } from './scoring';
import type { Exam } from './types';

const sampleExam: Exam = {
  id: 'test-001',
  type: 'technical',
  title: 'Test',
  language: 'en',
  durationMinutes: 60,
  totalQuestions: 3,
  createdAt: '2026-05-26',
  questions: [
    {
      id: 'q1',
      topic: 'DSA',
      type: 'single',
      prompt: 'p1',
      options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
      ],
      correct: ['a'],
      explanation: 'e1',
    },
    {
      id: 'q2',
      topic: 'DSA',
      type: 'multi',
      prompt: 'p2',
      options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
        { id: 'c', text: 'C' },
      ],
      correct: ['a', 'c'],
      explanation: 'e2',
    },
    {
      id: 'q3',
      topic: 'OOP',
      type: 'single',
      prompt: 'p3',
      options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
      ],
      correct: ['b'],
      explanation: 'e3',
    },
  ],
};

describe('isAnswerCorrect', () => {
  it('returns true for exact single match', () => {
    expect(isAnswerCorrect(['a'], ['a'])).toBe(true);
  });

  it('returns false for wrong single', () => {
    expect(isAnswerCorrect(['b'], ['a'])).toBe(false);
  });

  it('returns true for multi match regardless of order', () => {
    expect(isAnswerCorrect(['c', 'a'], ['a', 'c'])).toBe(true);
  });

  it('returns false for multi if missing one', () => {
    expect(isAnswerCorrect(['a'], ['a', 'c'])).toBe(false);
  });

  it('returns false for multi if extra option selected', () => {
    expect(isAnswerCorrect(['a', 'b', 'c'], ['a', 'c'])).toBe(false);
  });

  it('returns false for empty selection when correct is non-empty', () => {
    expect(isAnswerCorrect([], ['a'])).toBe(false);
  });

  it('ignores duplicates in selected', () => {
    expect(isAnswerCorrect(['a', 'a'], ['a'])).toBe(true);
  });
});

describe('scoreAttempt', () => {
  it('counts correct answers and percentage', () => {
    const result = scoreAttempt(
      sampleExam,
      { q1: ['a'], q2: ['a', 'c'], q3: ['a'] },
      '2026-05-26T10:00:00Z',
      '2026-05-26T10:30:00Z',
    );
    expect(result.score.correct).toBe(2);
    expect(result.score.total).toBe(3);
    expect(result.score.percentage).toBe(67);
  });

  it('handles unanswered questions as wrong', () => {
    const result = scoreAttempt(
      sampleExam,
      { q1: ['a'] },
      '2026-05-26T10:00:00Z',
      '2026-05-26T10:30:00Z',
    );
    expect(result.score.correct).toBe(1);
    expect(result.perQuestion[1].selected).toEqual([]);
    expect(result.perQuestion[1].isCorrect).toBe(false);
  });

  it('clamps duration to exam max', () => {
    const result = scoreAttempt(
      sampleExam,
      {},
      '2026-05-26T10:00:00Z',
      '2026-05-26T13:00:00Z', // 3h elapsed, exam is 60min
    );
    expect(result.durationSeconds).toBe(60 * 60);
  });
});

describe('topicBreakdown', () => {
  it('groups by topic and computes percentage', () => {
    const result = scoreAttempt(
      sampleExam,
      { q1: ['a'], q2: ['a'], q3: ['b'] },
      '2026-05-26T10:00:00Z',
      '2026-05-26T10:30:00Z',
    );
    const breakdown = topicBreakdown(sampleExam, result.perQuestion);
    expect(breakdown).not.toBeNull();
    const dsa = breakdown!.find((t) => t.topic === 'DSA');
    const oop = breakdown!.find((t) => t.topic === 'OOP');
    expect(dsa).toEqual({ topic: 'DSA', correct: 1, total: 2, percentage: 50 });
    expect(oop).toEqual({ topic: 'OOP', correct: 1, total: 1, percentage: 100 });
  });

  it('returns null when no questions have topics', () => {
    const examNoTopics: Exam = {
      ...sampleExam,
      questions: sampleExam.questions.map((q) => ({ ...q, topic: undefined })),
    };
    expect(topicBreakdown(examNoTopics, [])).toBeNull();
  });
});

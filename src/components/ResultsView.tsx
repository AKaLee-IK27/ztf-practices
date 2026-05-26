import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExamById } from '../lib/examLoader';
import { topicBreakdown } from '../lib/scoring';
import { getAttemptById } from '../lib/storage';

type Filter = 'all' | 'wrong' | 'flagged';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function ResultsView() {
  const { examId, attemptId } = useParams<{ examId: string; attemptId: string }>();
  const exam = examId ? getExamById(examId) : undefined;
  const attempt = attemptId ? getAttemptById(attemptId) : null;
  const [filter, setFilter] = useState<Filter>('all');

  const breakdown = useMemo(() => {
    if (!exam || !attempt) return null;
    return topicBreakdown(exam, attempt.perQuestion);
  }, [exam, attempt]);

  if (!exam || !attempt) {
    return (
      <div className="container">
        <div className="empty">
          Không tìm thấy kết quả. <Link to="/">Quay lại</Link>
        </div>
      </div>
    );
  }

  const { score } = attempt;
  const passed = exam.passingScore !== undefined && score.percentage >= exam.passingScore;
  const filteredQuestions = exam.questions.filter((q) => {
    const r = attempt.perQuestion.find((p) => p.questionId === q.id);
    if (filter === 'wrong') return r && !r.isCorrect;
    // 'flagged' filter doesn't work on completed attempts (flags aren't persisted),
    // but we keep the button for symmetry. Currently shows all.
    if (filter === 'flagged') return true;
    return true;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1>{exam.title} — Kết quả</h1>
        <Link to="/">
          <button className="ghost">← Danh sách đề</button>
        </Link>
      </div>

      <div className="score-summary">
        <div>
          <div
            className={`big-score ${
              exam.passingScore !== undefined ? (passed ? 'pass' : 'fail') : ''
            }`}
          >
            {score.correct} / {score.total}
          </div>
          <div className="meta">
            {score.percentage}%{' '}
            {exam.passingScore !== undefined &&
              (passed ? '· ✓ PASS' : `· ✗ FAIL (cần ${exam.passingScore}%)`)}
          </div>
        </div>
        <div>
          <div className="meta">Thời gian làm bài</div>
          <div style={{ fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>
            {formatDuration(attempt.durationSeconds)} / {exam.durationMinutes}m
          </div>
        </div>
        <div>
          <div className="meta">Nộp lúc</div>
          <div>{new Date(attempt.submittedAt).toLocaleString('vi-VN')}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Link to={`/exam/${exam.id}`}>
            <button className="primary">Làm lại</button>
          </Link>
        </div>
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="topic-list">
          <h3 style={{ marginTop: 0 }}>Theo topic</h3>
          {breakdown.map((t) => (
            <div key={t.topic} className="topic-row">
              <div>{t.topic}</div>
              <div style={{ color: 'var(--text-dim)' }}>
                {t.correct}/{t.total}
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${t.percentage}%` }} />
              </div>
              <div style={{ textAlign: 'right' }}>{t.percentage}%</div>
            </div>
          ))}
        </div>
      )}

      <div className="review-controls">
        <button
          className={filter === 'all' ? 'primary' : ''}
          onClick={() => setFilter('all')}
        >
          Tất cả ({exam.questions.length})
        </button>
        <button
          className={filter === 'wrong' ? 'primary' : ''}
          onClick={() => setFilter('wrong')}
        >
          Chỉ sai ({attempt.perQuestion.filter((r) => !r.isCorrect).length})
        </button>
      </div>

      <div className="review-list">
        {filteredQuestions.map((q, idx) => {
          const r = attempt.perQuestion.find((p) => p.questionId === q.id);
          if (!r) return null;
          const trueIndex = exam.questions.findIndex((x) => x.id === q.id);
          return (
            <div key={q.id} className={`review-item ${r.isCorrect ? 'correct' : 'wrong'}`}>
              <div className="qhead">
                <span>
                  Câu {trueIndex + 1}
                  {q.topic && ` · ${q.topic}`} {r.isCorrect ? '· ✓ Đúng' : '· ✗ Sai'}
                </span>
                <span>
                  {q.type === 'multi' ? 'Chọn nhiều' : 'Chọn 1'}
                </span>
              </div>
              <div className="prompt" style={{ marginBottom: 10 }}>
                {q.prompt}
              </div>
              {q.code && <pre className="code">{q.code}</pre>}
              <div className="options-list">
                {q.options.map((opt) => {
                  const isCorrectAnswer = q.correct.includes(opt.id);
                  const wasSelected = r.selected.includes(opt.id);
                  const cls = isCorrectAnswer
                    ? 'option-row correct-answer'
                    : wasSelected
                    ? 'option-row wrong-pick'
                    : 'option-row';
                  return (
                    <div key={opt.id} className={cls}>
                      <span className="option-id">{opt.id.toUpperCase()}.</span>
                      <span>{opt.text}</span>
                      {wasSelected && (
                        <span style={{ marginLeft: 'auto', fontSize: 12 }}>
                          {isCorrectAnswer ? '✓ bạn chọn' : '✗ bạn chọn'}
                        </span>
                      )}
                      {!wasSelected && isCorrectAnswer && (
                        <span style={{ marginLeft: 'auto', fontSize: 12 }}>đáp án đúng</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="explanation">
                <strong>💡 Giải thích:</strong> {q.explanation}
              </div>
              {idx === 0 && trueIndex !== 0 && filter !== 'all' && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-dim)' }}>
                  (Hiển thị theo bộ lọc — số câu là số thật trong đề)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

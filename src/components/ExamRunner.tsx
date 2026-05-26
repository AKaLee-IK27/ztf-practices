import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../lib/examLoader';
import { scoreAttempt } from '../lib/scoring';
import {
  clearInProgress,
  getInProgress,
  saveAttempt,
  saveInProgress,
} from '../lib/storage';
import type { Answer, InProgressState } from '../lib/types';
import { QuestionCard } from './QuestionCard';
import { Timer } from './Timer';

type ResumePrompt = 'unknown' | 'fresh' | 'has-progress' | 'decided';

export function ExamRunner() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const exam = examId ? getExamById(examId) : undefined;

  const [resumeState, setResumeState] = useState<ResumePrompt>('unknown');
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Decide whether to resume or start fresh on mount.
  useEffect(() => {
    if (!exam) return;
    const inProg = getInProgress(exam.id);
    if (inProg && Object.keys(inProg.answers).length > 0) {
      setResumeState('has-progress');
    } else {
      // No prior progress — start fresh immediately.
      setStartedAt(new Date().toISOString());
      setResumeState('fresh');
    }
  }, [exam]);

  const applyResume = (state: InProgressState) => {
    setStartedAt(state.startedAt);
    setAnswers(state.answers);
    setFlagged(state.flagged);
    setCurrentIndex(state.currentQuestionIndex);
    setResumeState('decided');
  };

  const startFresh = () => {
    if (!exam) return;
    clearInProgress(exam.id);
    setStartedAt(new Date().toISOString());
    setAnswers({});
    setFlagged([]);
    setCurrentIndex(0);
    setResumeState('decided');
  };

  // Auto-save (throttled by requestIdleCallback-ish delay).
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!exam || !startedAt || resumeState === 'unknown' || resumeState === 'has-progress') {
      return;
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveInProgress({
        examId: exam.id,
        startedAt,
        answers,
        flagged,
        currentQuestionIndex: currentIndex,
      });
    }, 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [exam, startedAt, answers, flagged, currentIndex, resumeState]);

  const submit = useCallback(() => {
    if (!exam || !startedAt) return;
    const submittedAt = new Date().toISOString();
    const result = scoreAttempt(exam, answers, startedAt, submittedAt);
    saveAttempt(result);
    clearInProgress(exam.id);
    navigate(`/exam/${exam.id}/result/${result.attemptId}`, { replace: true });
  }, [exam, startedAt, answers, navigate]);

  const handleExpire = useCallback(() => {
    submit();
  }, [submit]);

  const currentQuestion = useMemo(() => exam?.questions[currentIndex], [exam, currentIndex]);

  const onSelect = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const prior = prev[currentQuestion.id] ?? [];
      let next: Answer;
      if (currentQuestion.type === 'single') {
        next = [optionId];
      } else {
        next = prior.includes(optionId)
          ? prior.filter((id) => id !== optionId)
          : [...prior, optionId];
      }
      return { ...prev, [currentQuestion.id]: next };
    });
  };

  const onToggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id],
    );
  };

  // ---- Render ----

  if (!exam) {
    return (
      <div className="container">
        <div className="empty">
          Không tìm thấy đề. <Link to="/">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  if (resumeState === 'has-progress') {
    const inProg = getInProgress(exam.id)!;
    const answered = Object.keys(inProg.answers).length;
    return (
      <div className="confirm-modal">
        <div className="box">
          <h3>Tiếp tục bài đang dở?</h3>
          <p style={{ color: 'var(--text-dim)' }}>
            Bạn đã trả lời {answered}/{exam.questions.length} câu trong lần làm trước.
          </p>
          <div className="actions">
            <button onClick={startFresh}>Làm lại từ đầu</button>
            <button className="primary" onClick={() => applyResume(inProg)}>
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!startedAt || !currentQuestion) {
    return <div className="container">Đang khởi tạo…</div>;
  }

  const answeredCount = Object.values(answers).filter((a) => a.length > 0).length;
  const unanswered = exam.questions.length - answeredCount;

  return (
    <div className="container">
      <div className="timer-bar">
        <div>
          <Link to="/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>
            ← {exam.title}
          </Link>
        </div>
        <Timer
          startedAt={startedAt}
          durationMinutes={exam.durationMinutes}
          onExpire={handleExpire}
        />
        <button className="primary" onClick={() => setShowSubmitConfirm(true)}>
          Nộp bài
        </button>
      </div>

      <div className="runner-layout">
        <aside className="runner-sidebar">
          <h4>Câu hỏi</h4>
          <div className="q-nav-grid">
            {exam.questions.map((q, i) => {
              const isAnswered = (answers[q.id]?.length ?? 0) > 0;
              const isFlagged = flagged.includes(q.id);
              const isCurrent = i === currentIndex;
              const cls = [
                'q-nav-btn',
                isAnswered && 'answered',
                isFlagged && 'flagged',
                isCurrent && 'current',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button key={q.id} className={cls} onClick={() => setCurrentIndex(i)}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="q-nav-summary">
            Đã trả lời: {answeredCount}/{exam.questions.length}
            <br />
            Đã flag: {flagged.length}
          </div>
        </aside>

        <main className="runner-main">
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            total={exam.questions.length}
            selected={answers[currentQuestion.id] ?? []}
            flagged={flagged.includes(currentQuestion.id)}
            onSelect={onSelect}
            onToggleFlag={onToggleFlag}
          />
          <div className="submit-bar">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              ← Câu trước
            </button>
            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))
              }
              disabled={currentIndex === exam.questions.length - 1}
            >
              Câu sau →
            </button>
          </div>
        </main>
      </div>

      {showSubmitConfirm && (
        <div className="confirm-modal">
          <div className="box">
            <h3>Nộp bài?</h3>
            <p style={{ color: 'var(--text-dim)' }}>
              {unanswered > 0
                ? `Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp luôn?`
                : 'Bạn đã trả lời tất cả các câu. Sẵn sàng nộp.'}
            </p>
            <div className="actions">
              <button onClick={() => setShowSubmitConfirm(false)}>Quay lại làm tiếp</button>
              <button className="primary" onClick={submit}>
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

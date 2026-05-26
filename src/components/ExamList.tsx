import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExamsByType } from '../lib/examLoader';
import { bestScore, lastAttempt } from '../lib/storage';
import type { Exam, ExamType } from '../lib/types';
import { GenerateModal } from './GenerateModal';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function ExamCard({ exam }: { exam: Exam }) {
  const best = bestScore(exam.id);
  const last = lastAttempt(exam.id);

  return (
    <div className="exam-card">
      <h3>{exam.title}</h3>
      <div className="meta">
        {exam.questions.length} câu · {exam.durationMinutes} phút ·{' '}
        {exam.language.toUpperCase()}
      </div>
      {exam.topics && exam.topics.length > 0 && (
        <div className="topics">
          {exam.topics.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="stats">
        {best !== null ? (
          <>
            <span className="best">Best: {best}%</span>
            {' · '}
            <span>
              Lần gần nhất: {last!.score.percentage}% ({formatDate(last!.submittedAt)})
            </span>
          </>
        ) : (
          <span style={{ color: 'var(--text-dim)' }}>Chưa làm</span>
        )}
      </div>
      <div className="actions">
        <Link to={`/exam/${exam.id}`}>
          <button className="primary">{best !== null ? 'Làm lại' : 'Bắt đầu'}</button>
        </Link>
        {last && (
          <Link to={`/exam/${exam.id}/result/${last.attemptId}`}>
            <button>Xem kết quả gần nhất</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function ExamList() {
  const [activeTab, setActiveTab] = useState<ExamType>('technical');
  const [generating, setGenerating] = useState<ExamType | null>(null);

  const technical = useMemo(() => getExamsByType('technical'), []);
  const za = useMemo(() => getExamsByType('za'), []);

  const list = activeTab === 'technical' ? technical : za;

  return (
    <div className="container">
      <div className="page-header">
        <h1>ZTF Practice — Zalo Tech Fresher</h1>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'technical' ? 'active' : ''}`}
          onClick={() => setActiveTab('technical')}
        >
          Technical ({technical.length})
        </button>
        <button
          className={`tab ${activeTab === 'za' ? 'active' : ''}`}
          onClick={() => setActiveTab('za')}
        >
          Zalo Aptitude ({za.length})
        </button>
      </div>

      <div className="gen-button-row">
        <button className="primary" onClick={() => setGenerating(activeTab)}>
          + Sinh đề {activeTab === 'technical' ? 'Technical' : 'ZA'} mới
        </button>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          Chưa có đề nào. Bấm nút "Sinh đề" ở trên để tạo đề mới.
        </div>
      ) : (
        <div className="exam-grid">
          {list.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}

      {generating && (
        <GenerateModal type={generating} onClose={() => setGenerating(null)} />
      )}
    </div>
  );
}

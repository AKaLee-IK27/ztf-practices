import { useEffect, useState } from 'react';
import { estimatedDuration, generateExam, type GenerateResult } from '../lib/generator';
import type { ExamType } from '../lib/types';

interface GenerateModalProps {
  type: ExamType;
  onClose: () => void;
}

type Phase =
  | { status: 'running'; startedAt: number }
  | { status: 'done'; result: GenerateResult };

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function GenerateModal({ type, onClose }: GenerateModalProps) {
  const [phase, setPhase] = useState<Phase>({ status: 'running', startedAt: Date.now() });
  const [elapsed, setElapsed] = useState(0);

  const eta = estimatedDuration(type);
  const label = type === 'technical' ? 'Technical (100 câu)' : 'Zalo Aptitude (30 câu)';

  // Fire the generation once on mount.
  useEffect(() => {
    let cancelled = false;
    generateExam(type).then((result) => {
      if (!cancelled) setPhase({ status: 'done', result });
    });
    return () => {
      cancelled = true;
    };
  }, [type]);

  // Tick elapsed counter while running.
  useEffect(() => {
    if (phase.status !== 'running') return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - phase.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const onReloadAndClose = () => {
    // Force reload so Vite re-evaluates the import.meta.glob and picks up the new file.
    window.location.reload();
  };

  return (
    <div className="confirm-modal">
      <div className="box">
        {phase.status === 'running' && (
          <>
            <h3>Đang sinh đề {label}…</h3>
            <p style={{ color: 'var(--text-dim)' }}>
              Claude Code đang chạy slash command{' '}
              <code>{type === 'technical' ? '/gen-tech' : '/gen-za'}</code>. Quá trình này
              thường mất ~{eta}s.
            </p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="spinner" />
              <div style={{ fontSize: 14 }}>
                Đã chạy: <strong>{formatElapsed(elapsed)}</strong>
                {' / ~'}
                {formatElapsed(eta)}{' (ước tính)'}
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-dim)' }}>
              Đừng tắt tab này. Nếu lâu hơn dự kiến cũng cứ chờ — model đang viết 100 câu
              + giải thích.
            </div>
          </>
        )}

        {phase.status === 'done' && phase.result.ok && (
          <>
            <h3 style={{ color: 'var(--success)' }}>✓ Sinh đề xong</h3>
            <p>
              Hoàn thành trong {formatElapsed(phase.result.durationSec)}. Reload trang để
              thấy đề mới trong danh sách.
            </p>
            {phase.result.stdout && (
              <details style={{ marginTop: 12 }}>
                <summary style={{ cursor: 'pointer', color: 'var(--text-dim)' }}>
                  Xem log Claude Code
                </summary>
                <pre
                  style={{
                    marginTop: 8,
                    padding: 10,
                    background: '#0b1220',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    fontSize: 12,
                    maxHeight: 240,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {phase.result.stdout}
                </pre>
              </details>
            )}
            <div className="actions">
              <button className="primary" onClick={onReloadAndClose}>
                Reload trang
              </button>
            </div>
          </>
        )}

        {phase.status === 'done' && !phase.result.ok && (
          <>
            <h3 style={{ color: 'var(--danger)' }}>✗ Sinh đề thất bại</h3>
            <p style={{ color: 'var(--text-dim)' }}>
              {phase.result.error ??
                `Claude exit code ${phase.result.exitCode}. Xem stderr bên dưới.`}
            </p>
            {(phase.result.stderr || phase.result.stdout) && (
              <details style={{ marginTop: 12 }} open>
                <summary style={{ cursor: 'pointer' }}>Chi tiết</summary>
                {phase.result.stderr && (
                  <pre
                    style={{
                      marginTop: 8,
                      padding: 10,
                      background: '#1f0a0a',
                      border: '1px solid var(--danger)',
                      borderRadius: 6,
                      fontSize: 12,
                      maxHeight: 200,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {phase.result.stderr}
                  </pre>
                )}
                {phase.result.stdout && (
                  <pre
                    style={{
                      marginTop: 8,
                      padding: 10,
                      background: '#0b1220',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      fontSize: 12,
                      maxHeight: 200,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {phase.result.stdout}
                  </pre>
                )}
              </details>
            )}
            <div className="actions">
              <button onClick={onClose}>Đóng</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

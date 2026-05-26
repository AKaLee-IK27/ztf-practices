import { useEffect, useState } from 'react';

interface TimerProps {
  /** ISO timestamp when the exam started. */
  startedAt: string;
  /** Total exam duration in minutes. */
  durationMinutes: number;
  /** Called once when timer reaches zero. */
  onExpire: () => void;
}

function format(seconds: number): string {
  if (seconds <= 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function Timer({ startedAt, durationMinutes, onExpire }: TimerProps) {
  const totalSec = durationMinutes * 60;
  const [remaining, setRemaining] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    return Math.max(0, totalSec - elapsed);
  });

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const next = Math.max(0, totalSec - elapsed);
      setRemaining(next);
      if (next === 0) {
        clearInterval(id);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
    // onExpire is intentionally not in deps — we treat it as a stable callback;
    // parent should memoize it or accept that a re-render-triggered interval
    // restart is harmless (timer reads from startedAt anyway).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, totalSec]);

  const cls = remaining <= 60 ? 'time danger' : remaining <= 5 * 60 ? 'time warn' : 'time';
  return <span className={cls}>{format(remaining)}</span>;
}

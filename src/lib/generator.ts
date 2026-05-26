import type { ExamType } from './types';

export interface GenerateOk {
  ok: true;
  durationSec: number;
  stdout: string;
}

export interface GenerateErr {
  ok: false;
  exitCode?: number | null;
  durationSec?: number;
  stderr?: string;
  stdout?: string;
  error?: string;
}

export type GenerateResult = GenerateOk | GenerateErr;

/** ETA in seconds shown to the user while generating. */
export function estimatedDuration(type: ExamType): number {
  // Rough estimates. Tech (100 q) is heavier than ZA (30 q).
  return type === 'technical' ? 90 : 45;
}

export async function generateExam(type: ExamType): Promise<GenerateResult> {
  let res: Response;
  try {
    res = await fetch(`/api/generate?type=${type}`, { method: 'POST' });
  } catch (err) {
    return { ok: false, error: `Network error: ${(err as Error).message}` };
  }

  let body: GenerateResult;
  try {
    body = (await res.json()) as GenerateResult;
  } catch {
    return {
      ok: false,
      error: `Server returned non-JSON response (status ${res.status})`,
    };
  }
  return body;
}

import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

export function getGemini() {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  }
  return _genAI;
}

function isTransient(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message;
  return (
    / 429 | 500 | 502 | 503 | 504 /.test(msg) ||
    /Too Many Requests/i.test(msg) ||
    /Resource exhausted/i.test(msg) ||
    /overloaded/i.test(msg) ||
    /ECONNRESET|ETIMEDOUT|fetch failed/i.test(msg)
  );
}

export async function withGeminiRetry<T>(
  fn: () => Promise<T>,
  opts?: { retries?: number; baseDelayMs?: number },
): Promise<T> {
  const retries = opts?.retries ?? 3;
  const base = opts?.baseDelayMs ?? 800;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isTransient(err) || attempt === retries) throw err;
      const delay = base * Math.pow(2, attempt) + Math.random() * 200;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

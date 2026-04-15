import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

export function getGemini() {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  }
  return _genAI;
}

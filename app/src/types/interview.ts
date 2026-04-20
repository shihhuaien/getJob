export type Persona = "hr_friendly" | "tech_strict" | "ceo_business";
export type InterviewType = "behavioral" | "technical" | "case_study" | "mixed";
export type InterviewMode = "text" | "voice";
export type InterviewStatus = "in_progress" | "completed" | "abandoned";

export interface InterviewQuestion {
  id: string;
  text: string;
  category: string;
  expected_duration_sec: number;
  order: number;
}

export interface DrillDownExchange {
  question: string;
  answer: string;
}

export interface InterviewAnswer {
  question_id: string;
  answer_text: string;
  audio_duration_sec?: number;
  submitted_at: string;
  drill_down?: DrillDownExchange;
}

export interface Scorecard {
  relevance: number;
  logic: number;
  confidence: number;
  overall: number;
}

export interface PerQuestionFeedback {
  question_id: string;
  diagnosis: string;
  rewritten_answer: string;
  follow_up_predictions: string[];
}

export interface InterviewReport {
  scorecard: Scorecard;
  per_question: PerQuestionFeedback[];
  summary: string;
}

export const PERSONA_KEYS: Persona[] = [
  "hr_friendly",
  "tech_strict",
  "ceo_business",
];

export const INTERVIEW_TYPE_KEYS: InterviewType[] = [
  "behavioral",
  "technical",
  "case_study",
  "mixed",
];

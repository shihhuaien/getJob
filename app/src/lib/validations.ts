import { z } from "zod";

export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ── API Routes ──

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
});

// ── Jobs ──

export const jobInsertSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name must be 200 characters or less"),
  job_title: z
    .string()
    .trim()
    .min(1, "Job title is required")
    .max(200, "Job title must be 200 characters or less"),
  job_url: z
    .string()
    .max(2000, "URL must be 2000 characters or less")
    .refine((val) => !val || isValidHttpUrl(val), "Please enter a valid URL (https://)")
    .optional()
    .or(z.literal("")),
});

export const jobUpdateSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200, "Company name must be 200 characters or less"),
  job_title: z.string().trim().min(1, "Job title is required").max(200, "Job title must be 200 characters or less"),
  job_url: z
    .string()
    .max(2000, "URL must be 2000 characters or less")
    .refine((val) => !val || isValidHttpUrl(val), "Please enter a valid URL (https://)"),
  job_description: z.string().max(10000, "Description must be 10000 characters or less"),
  notes: z.string().max(5000, "Notes must be 5000 characters or less"),
  salary_min: z.number().int().min(0, "Salary cannot be negative").max(99999999).nullable(),
  salary_max: z.number().int().min(0, "Salary cannot be negative").max(99999999).nullable(),
  applied_at: z.string().nullable(),
});

// ── Resume & Cover Letter ──

export const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be 200 characters or less");

export const coverLetterUpdateSchema = z.object({
  title: titleSchema,
  content: z.string().max(50000, "Content must be 50000 characters or less"),
});

export const resumeUpdateSchema = z.object({
  title: titleSchema,
  target_job_title: z.string().max(200, "Target job title must be 200 characters or less"),
});

// ── AI Parse ──

export const parseJobRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Please enter job content")
    .max(10000, "Content must be 10000 characters or less"),
});

// ── AI Resume Optimization ──

export const optimizeResumeRequestSchema = z.object({
  resume_id: z.string().uuid("Invalid resume ID"),
  job_id: z.string().uuid("Invalid job ID"),
});

// ── AI Cover Letter Generation ──

export const generateCoverLetterSchema = z.object({
  job_id: z.string().uuid("Invalid job ID"),
  resume_id: z.string().uuid("Invalid resume ID"),
});

// ── PDF Resume Upload ──

export const parseResumePdfSchema = z.object({
  pdf_base64: z
    .string()
    .min(1, "Please upload a PDF file")
    .max(7_000_000, "File size must be 5MB or less"),
  title: titleSchema,
});

// ── AI Interview ──

export const createInterviewSessionSchema = z.object({
  job_id: z.string().uuid("Invalid job ID"),
  resume_id: z.string().uuid("Invalid resume ID"),
  persona: z.enum(["hr_friendly", "tech_strict", "ceo_business"]),
  interview_type: z.enum(["behavioral", "technical", "case_study", "mixed"]),
  mode: z.enum(["text", "voice"]).default("text"),
  drill_down_enabled: z.boolean().default(false),
});

export const submitInterviewAnswerSchema = z.object({
  question_id: z.string().min(1),
  answer_text: z.string().max(10000).optional(),
  audio_duration_sec: z.number().min(0).max(3600).optional(),
  drill_down_question: z.string().max(2000).optional(),
  drill_down_answer: z.string().max(10000).optional(),
});

export const questionBankInsertSchema = z.object({
  question_text: z.string().min(1).max(2000),
  category: z.string().max(100).optional(),
  source_session_id: z.string().uuid().nullable().optional(),
  source_job_id: z.string().uuid().nullable().optional(),
});

export const questionBankUpdateSchema = z.object({
  user_notes: z.string().max(5000),
});

export const jobCreateApiSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name must be 200 characters or less"),
  job_title: z
    .string()
    .trim()
    .min(1, "Job title is required")
    .max(200, "Job title must be 200 characters or less"),
  job_url: z
    .string()
    .max(2000)
    .refine((val) => !val || isValidHttpUrl(val), "Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  job_description: z.string().max(10000).optional().or(z.literal("")),
  salary_min: z.number().int().min(0).max(99999999).nullable().optional(),
  salary_max: z.number().int().min(0).max(99999999).nullable().optional(),
  notes: z.string().max(5000).optional().or(z.literal("")),
  status: z
    .enum(["saved", "applied", "interview", "offer", "rejected"])
    .optional()
    .default("saved"),
});

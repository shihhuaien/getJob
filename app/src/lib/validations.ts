import { z } from "zod";

// 工具函式：檢查 URL 是否為有效的 http/https 協議
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
    .min(1, "姓名為必填")
    .max(100, "姓名不可超過 100 字"),
});

// ── 職缺 ──

export const jobInsertSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "公司名稱為必填")
    .max(200, "公司名稱不可超過 200 字"),
  job_title: z
    .string()
    .trim()
    .min(1, "職位名稱為必填")
    .max(200, "職位名稱不可超過 200 字"),
  job_url: z
    .string()
    .max(2000, "網址不可超過 2000 字")
    .refine((val) => !val || isValidHttpUrl(val), "請輸入有效的網址（https://）")
    .optional()
    .or(z.literal("")),
});

export const jobUpdateSchema = z.object({
  company_name: z.string().trim().min(1, "公司名稱為必填").max(200, "公司名稱不可超過 200 字"),
  job_title: z.string().trim().min(1, "職位名稱為必填").max(200, "職位名稱不可超過 200 字"),
  job_url: z
    .string()
    .max(2000, "網址不可超過 2000 字")
    .refine((val) => !val || isValidHttpUrl(val), "請輸入有效的網址（https://）"),
  job_description: z.string().max(10000, "職缺描述不可超過 10000 字"),
  notes: z.string().max(5000, "備註不可超過 5000 字"),
  salary_min: z.number().int().min(0, "薪資不可為負數").max(99999999).nullable(),
  salary_max: z.number().int().min(0, "薪資不可為負數").max(99999999).nullable(),
  applied_at: z.string().nullable(),
});

// ── 履歷 & 求職信 ──

export const titleSchema = z
  .string()
  .trim()
  .min(1, "標題為必填")
  .max(200, "標題不可超過 200 字");

export const coverLetterUpdateSchema = z.object({
  title: titleSchema,
  content: z.string().max(50000, "內容不可超過 50000 字"),
});

export const resumeUpdateSchema = z.object({
  title: titleSchema,
  target_job_title: z.string().max(200, "目標職位不可超過 200 字"),
});

// ── AI 解析 ──

export const parseJobRequestSchema = z.object({
  text: z
    .string()
    .min(1, "請輸入職缺內容")
    .max(10000, "職缺內容不可超過 10000 字"),
});

// ── AI 履歷優化 ──

export const optimizeResumeRequestSchema = z.object({
  resume_id: z.string().uuid("無效的履歷 ID"),
  job_id: z.string().uuid("無效的職缺 ID"),
});

// ── PDF 履歷上傳 ──

export const parseResumePdfSchema = z.object({
  pdf_base64: z
    .string()
    .min(1, "請上傳 PDF 檔案")
    .max(7_000_000, "檔案大小不可超過 5MB"),
  title: titleSchema,
});

export const jobCreateApiSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "公司名稱為必填")
    .max(200, "公司名稱不可超過 200 字"),
  job_title: z
    .string()
    .trim()
    .min(1, "職位名稱為必填")
    .max(200, "職位名稱不可超過 200 字"),
  job_url: z
    .string()
    .max(2000)
    .refine((val) => !val || isValidHttpUrl(val), "請輸入有效的網址")
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

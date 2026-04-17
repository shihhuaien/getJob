import { z } from "zod";
import { getGemini } from "./gemini";

export interface ParsedJob {
  company_name: string;
  job_title: string;
  salary_min: number | null;
  salary_max: number | null;
  job_description: string;
}

const parsedJobSchema = z.object({
  company_name: z.string().default(""),
  job_title: z.string().default(""),
  salary_min: z.number().nullable().default(null),
  salary_max: z.number().nullable().default(null),
  job_description: z.string().default(""),
});

function getLanguageInstruction(locale?: string): string {
  return locale === "en"
    ? "All text must be in English"
    : "所有文字使用繁體中文";
}

function getSystemPrompt(locale?: string) {
  const lang = getLanguageInstruction(locale);
  return `你是一個求職資訊擷取助手。從以下職缺文字中擷取結構化資訊。

回傳 JSON 格式：
{
  "company_name": "公司名稱",
  "job_title": "職位名稱",
  "salary_min": 月薪下限（整數，新台幣，若無則 null），
  "salary_max": 月薪上限（整數，新台幣，若無則 null），
  "job_description": "包含三段：\\n1. 工作內容摘要\\n2. 技能需求（條列）\\n3. 其他（福利/地點等）"
}

規則：
- ${lang}
- salary 只填數字，單位為新台幣月薪。年薪請除以 12 轉換
- 若資訊不明確，對應欄位填 null 或空字串
- 只回傳 JSON，不要包含其他文字`;
}

export async function parseJobDescription(text: string, locale?: string): Promise<ParsedJob> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent([
    { text: getSystemPrompt(locale) },
    { text: `以下是職缺內容：\n\n${text}` },
  ]);

  const responseText = result.response.text();
  const json = JSON.parse(responseText);
  return parsedJobSchema.parse(json);
}

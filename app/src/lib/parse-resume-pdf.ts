import { z } from "zod";
import { getGemini, withGeminiRetry } from "./gemini";
import type { ResumeContent } from "@/types/resume";

const resumeResponseSchema = z.object({
  personal: z.object({
    name: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    location: z.string().default(""),
    summary: z.string().default(""),
    linkedin: z.string().default(""),
    website: z.string().default(""),
  }),
  education: z
    .array(
      z.object({
        school: z.string().default(""),
        degree: z.string().default(""),
        field: z.string().default(""),
        start_date: z.string().default(""),
        end_date: z.string().default(""),
      })
    )
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string().default(""),
        title: z.string().default(""),
        start_date: z.string().default(""),
        end_date: z.string().default(""),
        description: z
          .union([z.string(), z.array(z.string()).transform((arr) => arr.join("\n"))])
          .default(""),
      })
    )
    .default([]),
  skills: z.array(z.string()).default([]),
});

function getSystemPrompt(locale?: string, source: "pdf" | "text" = "pdf") {
  const lang = locale === "en"
    ? "All text must be in English (keep English proper nouns as-is)"
    : "所有文字使用繁體中文（若原文為英文則保留英文）";
  const sourceDesc = source === "pdf"
    ? "從上傳的 PDF 履歷中擷取結構化資訊。"
    : "從以下提供的履歷文字內容中擷取結構化資訊。";
  return `你是一位履歷資料擷取助手。${sourceDesc}

回傳 JSON 格式：
{
  "personal": {
    "name": "姓名",
    "email": "電子郵件",
    "phone": "電話號碼",
    "location": "所在地（例：台北市）",
    "linkedin": "LinkedIn 個人頁面網址（完整 URL，若無則填空字串）",
    "website": "個人網站或作品集網址（完整 URL，若無則填空字串）",
    "summary": "自我介紹或專業摘要"
  },
  "education": [
    {
      "school": "學校名稱",
      "degree": "學位（例：學士、碩士）",
      "field": "科系名稱",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM"
    }
  ],
  "experience": [
    {
      "company": "公司名稱",
      "title": "職位名稱",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM（若為在職中則填空字串）",
      "description": "工作內容描述（每個項目以「• 」開頭，各項目之間以 \\n 分隔，不可回傳陣列）"
    }
  ],
  "skills": ["技能1", "技能2"]
}

規則：
- ${lang}
- 日期格式一律為 YYYY-MM（例：2023-06），若只有年份則填 YYYY-01
- 若資訊不明確或找不到，對應欄位填空字串或空陣列
- linkedin 僅填入單一 LinkedIn 網址（包含 linkedin.com 的完整 URL）；website 僅填入單一個人網站、GitHub 或作品集網址（非 LinkedIn）；兩欄位絕對不可合併或混填多個網址
- experience 按時間由新到舊排列
- skills 擷取所有提到的技術能力、工具、程式語言、軟技能
- description 必須使用項目符號格式（每項以「• 」開頭，\n 分隔），盡可能保留原文內容，包含量化成果
- 只回傳 JSON，不要包含其他文字`;
}

export async function parseResumePdf(
  base64Pdf: string,
  locale?: string
): Promise<ResumeContent> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await withGeminiRetry(() =>
    model.generateContent([
      { text: getSystemPrompt(locale, "pdf") },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf,
        },
      },
    ]),
  );

  const responseText = result.response.text();
  const json = JSON.parse(responseText);
  const parsed = resumeResponseSchema.parse(json);

  // 為 education 和 experience 加上 UUID
  return {
    personal: parsed.personal,
    education: parsed.education.map((edu) => ({
      ...edu,
      id: crypto.randomUUID(),
    })),
    experience: parsed.experience.map((exp) => ({
      ...exp,
      id: crypto.randomUUID(),
    })),
    skills: parsed.skills,
  };
}

export async function parseResumeText(
  resumeText: string,
  locale?: string
): Promise<ResumeContent> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await withGeminiRetry(() =>
    model.generateContent([
      { text: getSystemPrompt(locale, "text") },
      { text: `以下是履歷文字內容：\n\n${resumeText}` },
    ]),
  );

  const responseText = result.response.text();
  const json = JSON.parse(responseText);
  const parsed = resumeResponseSchema.parse(json);

  return {
    personal: parsed.personal,
    education: parsed.education.map((edu) => ({
      ...edu,
      id: crypto.randomUUID(),
    })),
    experience: parsed.experience.map((exp) => ({
      ...exp,
      id: crypto.randomUUID(),
    })),
    skills: parsed.skills,
  };
}

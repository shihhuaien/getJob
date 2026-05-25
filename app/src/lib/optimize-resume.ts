import { z } from "zod";
import { getGemini, withGeminiRetry } from "./gemini";
import type { ResumeContent } from "@/types/resume";

export interface AtsAnalysis {
  score: number;
  summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: Array<{
    section: "summary" | "experience" | "skills" | "education" | "general";
    suggestion: string;
  }>;
}

const atsAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  suggestions: z.array(
    z.object({
      section: z.enum(["summary", "experience", "skills", "education", "general"]),
      suggestion: z.string(),
    })
  ),
});

function getLanguageInstruction(locale?: string): string {
  return locale === "en"
    ? "All text must be in English"
    : "所有文字使用繁體中文";
}

function getAnalysisPrompt(locale?: string) {
  const lang = getLanguageInstruction(locale);
  return `你是一位專業的履歷顧問與 ATS（Applicant Tracking System）專家。
你的任務是比對求職者的履歷內容與目標職缺描述，給出 ATS 相容性評分與具體改善建議。

回傳 JSON 格式：
{
  "score": 0-100 的整數（ATS 相容性分數），
  "summary": "一段 2-3 句的整體評估摘要",
  "matched_keywords": ["履歷中已包含的職缺關鍵字"],
  "missing_keywords": ["職缺要求但履歷中缺少的關鍵字"],
  "suggestions": [
    {
      "section": "summary | experience | skills | education | general",
      "suggestion": "具體的改善建議"
    }
  ]
}

評分標準：
- 90-100：履歷與職缺高度匹配，關鍵字覆蓋率極高
- 70-89：良好匹配，有少量關鍵字缺失
- 50-69：中等匹配，需要補充多項關鍵字與經歷描述
- 30-49：匹配度低，需要大幅調整履歷內容
- 0-29：幾乎不匹配，建議重寫履歷

分析重點：
1. 技能關鍵字比對（硬技能 + 軟技能）
2. 職位名稱與經歷的相關性
3. 工作描述中的動作動詞與量化成果
4. 學歷要求匹配度
5. ATS 友善度（格式、關鍵字密度）

建議規則：
- 每個建議必須具體可執行，不要空泛
- suggestions 最少 3 條，最多 8 條
- 優先指出影響最大的改善項目
- ${lang}
- 只回傳 JSON，不要包含其他文字`;
}

export function resumeToText(content: ResumeContent): string {
  const parts: string[] = [];

  // 個人資訊
  if (content.personal.name) parts.push(`姓名：${content.personal.name}`);
  if (content.personal.summary) parts.push(`自我介紹：${content.personal.summary}`);

  // 工作經歷
  if (content.experience.length > 0) {
    parts.push("\n工作經歷：");
    for (const exp of content.experience) {
      const period = [exp.start_date, exp.end_date].filter(Boolean).join(" ~ ");
      parts.push(`- ${exp.company} / ${exp.title}${period ? `（${period}）` : ""}`);
      if (exp.description) parts.push(`  ${exp.description}`);
    }
  }

  // 學歷
  if (content.education.length > 0) {
    parts.push("\n學歷：");
    for (const edu of content.education) {
      parts.push(`- ${edu.school} ${edu.degree} ${edu.field}`);
    }
  }

  // 技能
  if (content.skills.length > 0) {
    parts.push(`\n技能：${content.skills.join("、")}`);
  }

  return parts.join("\n");
}

function getGeneratePrompt(locale?: string) {
  const lang = locale === "en"
    ? "All text must be in English (keep English proper nouns as-is)"
    : "所有文字使用繁體中文（若原文為英文則保留英文）";
  return `你是一位專業的履歷優化顧問。你的任務是根據 ATS 分析結果，優化求職者的履歷內容以提高與目標職缺的匹配度。

你會收到三項資料：
1. 原始履歷（JSON 格式）
2. 目標職缺描述
3. ATS 分析結果（包含評分、匹配/缺少關鍵字、改善建議）

回傳與原始履歷完全相同結構的 JSON：
{
  "personal": {
    "name": "（保持不變）",
    "email": "（保持不變）",
    "phone": "（保持不變）",
    "location": "（保持不變）",
    "summary": "優化後的自我介紹"
  },
  "education": [
    {
      "school": "（保持不變）",
      "degree": "（保持不變）",
      "field": "（保持不變）",
      "start_date": "（保持不變）",
      "end_date": "（保持不變）"
    }
  ],
  "experience": [
    {
      "company": "（保持不變）",
      "title": "（保持不變）",
      "start_date": "（保持不變）",
      "end_date": "（保持不變）",
      "description": "優化後的工作描述"
    }
  ],
  "skills": ["技能1", "技能2"]
}

嚴格規則（違反任何一條即為失敗）：
1. **不可捏造**：不可新增原始履歷中不存在的公司、職位、學歷、學校
2. **不可虛構技能**：skills 陣列只能包含原始履歷已有的技能，不可新增
3. **不可修改事實**：姓名、email、電話、地址、學校、學位、科系、公司名稱、職位名稱、日期一律保持原文不變
4. **experience 與 education 數量必須與原始履歷完全相同**，不可新增或刪除

你可以做的事：
- 改寫 summary（自我介紹），融入職缺相關的關鍵字與重點，但基於原文內容改寫
- 改寫 experience 的 description（工作描述），加入動作動詞、量化成果、職缺關鍵字，但必須基於原文內容改寫
- 調整 skills 的排列順序，讓與職缺最相關的技能排在前面

${lang}。
只回傳 JSON，不要包含其他文字。`;
}

const optimizedResumeSchema = z.object({
  personal: z.object({
    name: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    location: z.string().default(""),
    summary: z.string().default(""),
  }),
  education: z
    .array(
      z.object({
        school: z.string(),
        degree: z.string(),
        field: z.string(),
        start_date: z.string(),
        end_date: z.string(),
      })
    )
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string(),
        title: z.string(),
        start_date: z.string(),
        end_date: z.string(),
        description: z.string(),
      })
    )
    .default([]),
  skills: z.array(z.string()).default([]),
});

function buildExtraBlock(extraInstructions?: string): string {
  return extraInstructions?.trim()
    ? `\n\n---\n額外指示：${extraInstructions.trim()}`
    : "";
}

export async function generateOptimizedResume(
  resumeContent: ResumeContent,
  jobDescription: string,
  analysis: AtsAnalysis,
  locale?: string,
  extraInstructions?: string
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
      { text: getGeneratePrompt(locale) },
      {
        text: `原始履歷：\n${JSON.stringify(resumeContent, null, 2)}\n\n---\n\n目標職缺描述：\n${jobDescription}\n\n---\n\nATS 分析結果：\n${JSON.stringify(analysis, null, 2)}${buildExtraBlock(extraInstructions)}`,
      },
    ]),
  );

  const responseText = result.response.text();
  const json = JSON.parse(responseText);
  const parsed = optimizedResumeSchema.parse(json);

  // 保留原始 education/experience 的 id，以及 AI 不應修改的個人欄位
  return {
    personal: {
      ...parsed.personal,
      name: resumeContent.personal.name,
      email: resumeContent.personal.email,
      phone: resumeContent.personal.phone,
      location: parsed.personal.location || resumeContent.personal.location,
    },
    education: parsed.education.map((edu, i) => ({
      ...edu,
      id: resumeContent.education[i]?.id || crypto.randomUUID(),
    })),
    experience: parsed.experience.map((exp, i) => ({
      ...exp,
      id: resumeContent.experience[i]?.id || crypto.randomUUID(),
    })),
    skills: parsed.skills,
  };
}

export async function analyzeResume(
  resumeContent: ResumeContent,
  jobDescription: string,
  locale?: string
): Promise<AtsAnalysis> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const resumeText = resumeToText(resumeContent);

  const result = await withGeminiRetry(() =>
    model.generateContent([
      { text: getAnalysisPrompt(locale) },
      {
        text: `以下是求職者的履歷：\n\n${resumeText}\n\n---\n\n以下是目標職缺描述：\n\n${jobDescription}`,
      },
    ]),
  );

  const responseText = result.response.text();
  const json = JSON.parse(responseText);
  return atsAnalysisSchema.parse(json);
}

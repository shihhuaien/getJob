import { z } from "zod";
import { getGemini } from "./gemini";
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

const SYSTEM_PROMPT = `你是一位專業的履歷顧問與 ATS（Applicant Tracking System）專家。
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
- 所有文字使用繁體中文
- 只回傳 JSON，不要包含其他文字`;

function resumeToText(content: ResumeContent): string {
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

export async function analyzeResume(
  resumeContent: ResumeContent,
  jobDescription: string
): Promise<AtsAnalysis> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const resumeText = resumeToText(resumeContent);

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    {
      text: `以下是求職者的履歷：\n\n${resumeText}\n\n---\n\n以下是目標職缺描述：\n\n${jobDescription}`,
    },
  ]);

  const responseText = result.response.text();
  const json = JSON.parse(responseText);
  return atsAnalysisSchema.parse(json);
}

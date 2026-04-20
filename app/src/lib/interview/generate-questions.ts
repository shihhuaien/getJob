import { z } from "zod";
import { getGemini } from "../gemini";
import { resumeToText } from "../optimize-resume";
import type { ResumeContent } from "@/types/resume";
import type {
  InterviewQuestion,
  InterviewType,
  Persona,
} from "@/types/interview";

const QUESTION_COUNT = 8;

const personaInstructions: Record<Persona, { zh: string; en: string }> = {
  hr_friendly: {
    zh: "你是一位友善、善於引導的 HR 夥伴，傾向從文化適配、團隊合作、職涯動機切入，語氣溫暖鼓勵。",
    en: "You are a friendly HR partner focusing on cultural fit, teamwork, and career motivation. Warm and encouraging tone.",
  },
  tech_strict: {
    zh: "你是一位嚴格的資深技術主管，傾向深入技術細節、架構決策、debugging 思路，語氣專業但有壓力。",
    en: "You are a strict senior tech lead. Probe technical depth, architecture trade-offs, and debugging reasoning. Professional but pressuring tone.",
  },
  ceo_business: {
    zh: "你是重視商業思維與策略的 CEO，關心使用者會如何把工作轉化為商業影響力、面對模糊問題的思考框架。",
    en: "You are a CEO focused on business thinking and strategy. Probe how the candidate converts work into business impact and handles ambiguity.",
  },
};

const typeInstructions: Record<InterviewType, { zh: string; en: string }> = {
  behavioral: {
    zh: "題目聚焦行為面試（STAR 導向），探詢過去經歷中的挑戰、決策、結果。",
    en: "Focus on behavioral (STAR-oriented) questions probing past challenges, decisions, and outcomes.",
  },
  technical: {
    zh: "題目聚焦技術深度：具體技術、系統設計、debugging 案例、選型理由。",
    en: "Focus on technical depth: specific technologies, system design, debugging scenarios, and decision rationale.",
  },
  case_study: {
    zh: "題目聚焦情境模擬：給定一個商業或產品情境，請候選人描述思考框架與行動計劃。",
    en: "Focus on case-study scenarios: given a business or product situation, ask the candidate to describe their framework and action plan.",
  },
  mixed: {
    zh: "混合行為、技術、情境三種題型，依職缺屬性分配比例。",
    en: "Mix behavioral, technical, and case-study questions, weighted by the JD's focus.",
  },
};

const questionsResponseSchema = z.object({
  questions: z
    .array(
      z.object({
        text: z.string().min(1),
        category: z.string().min(1),
        expected_duration_sec: z.number().int().min(30).max(600),
      })
    )
    .min(1),
});

function getSystemPrompt(
  persona: Persona,
  interviewType: InterviewType,
  locale?: string
) {
  const isEn = locale === "en";
  const personaDesc = isEn
    ? personaInstructions[persona].en
    : personaInstructions[persona].zh;
  const typeDesc = isEn
    ? typeInstructions[interviewType].en
    : typeInstructions[interviewType].zh;
  const lang = isEn
    ? "All question text must be in English."
    : "所有題目文字使用繁體中文（若為英文專有名詞則保留）。";

  return `你是一位資深面試教練，正在協助求職者模擬真實面試。

面試官設定：${personaDesc}
題目類型：${typeDesc}

你的任務：根據下方提供的「目標職缺描述」與「求職者履歷」，產出 ${QUESTION_COUNT} 個有深度、量身打造的面試題目。

嚴格規則：
1. 題目必須與職缺實際需求高度相關，並引用履歷中的真實經歷（例如某段工作經驗、某項技能）
2. 不可提出一般、通用、到處都能用的題目（如「介紹一下你自己」）
3. 題目應鼓勵候選人展現思考框架與具體案例
4. category 必須是下列其中之一："behavioral" / "technical" / "case_study" / "motivation" / "culture_fit"
5. expected_duration_sec 為建議作答時間（秒）：開放題 180-300、深度題 240-360、技術題 180-300
6. ${lang}

請只回傳以下 JSON 結構，不要任何其他文字：
{
  "questions": [
    { "text": "題目文字", "category": "behavioral", "expected_duration_sec": 240 }
  ]
}`;
}

export async function generateInterviewQuestions(
  resumeContent: ResumeContent,
  jobDescription: string,
  companyName: string,
  jobTitle: string,
  persona: Persona,
  interviewType: InterviewType,
  locale?: string
): Promise<InterviewQuestion[]> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const resumeText = resumeToText(resumeContent);

  const result = await model.generateContent([
    { text: getSystemPrompt(persona, interviewType, locale) },
    {
      text: `目標公司：${companyName}\n目標職位：${jobTitle}\n\n職缺描述：\n${jobDescription}\n\n---\n\n求職者履歷：\n${resumeText}`,
    },
  ]);

  const responseText = result.response.text();
  const json = JSON.parse(responseText);
  const parsed = questionsResponseSchema.parse(json);

  return parsed.questions.slice(0, QUESTION_COUNT).map((q, i) => ({
    id: crypto.randomUUID(),
    text: q.text,
    category: q.category,
    expected_duration_sec: q.expected_duration_sec,
    order: i,
  }));
}

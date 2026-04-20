import { z } from "zod";
import { getGemini } from "../gemini";
import { resumeToText } from "../optimize-resume";
import type { ResumeContent } from "@/types/resume";
import type {
  InterviewAnswer,
  InterviewMode,
  InterviewQuestion,
  InterviewReport,
  PerQuestionFeedback,
  Scorecard,
} from "@/types/interview";

const reportSchema = z.object({
  scorecard: z.object({
    relevance: z.number().min(0).max(100),
    logic: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    overall: z.number().min(0).max(100),
  }),
  per_question: z.array(
    z.object({
      question_id: z.string(),
      diagnosis: z.string(),
      rewritten_answer: z.string(),
      follow_up_predictions: z.array(z.string()).default([]),
    })
  ),
  summary: z.string(),
});

function getSystemPrompt(mode: InterviewMode, locale?: string) {
  const isEn = locale === "en";
  const lang = isEn
    ? "All text must be in English."
    : "所有文字使用繁體中文。";
  const confidenceNote =
    mode === "voice"
      ? isEn
        ? "Confidence score should reflect pacing, filler words, and articulation (based on transcript + pauses if provided)."
        : "自信度分數需反映語速、冗詞贅字（如「然後」、「呃」）、清晰度（依據轉錄文字與停頓）。"
      : isEn
        ? "Note: Text mode cannot analyze voice signals. Confidence should reflect answer structure, specificity, and tone of writing."
        : "注意：文字模式無法分析語音。自信度分數應反映答案結構清晰度、具體程度、文字語氣。";

  return `你是一位嚴格且有經驗的面試教練。你會收到：
1. 面試題目清單（每題皆有 id 標示）
2. 候選人對每題的回答
3. 目標職缺描述
4. 候選人履歷

請針對整場面試產出完整評估報告。

評分標準（每項 0-100）：
- relevance（相關度）：回答是否切中 JD 核心需求、引用履歷真實經歷
- logic（邏輯性）：敘事結構是否完整，是否符合 STAR 原則
- confidence（自信度）：${confidenceNote}
- overall（整體）：上述三項加權後的總分（不是單純平均）

逐題 per_question（陣列順序必須與題目清單相同，一題一筆，不可遺漏）：
- question_id：必須原封不動複製題目清單中每題標示的 id（UUID 格式）
- diagnosis：指出該題答得好與不好的地方，1-3 句
- rewritten_answer：**根據候選人真實履歷經歷**重寫一段更具說服力的回答範例（黃金回答），約 100-200 字
- follow_up_predictions：3 個面試官可能繼續深挖的追問題

summary：整場面試的整體總結與最值得改善的 2-3 點。

嚴格規則：
- rewritten_answer 不可捏造履歷中不存在的經歷或成就，僅依現有經歷重新組織、加強敘事
- 針對沒有作答或極短答案，diagnosis 需明確指出並提供完整框架建議
- ${lang}
- 只回傳純 JSON，不要包含 Markdown code fence 或任何其他文字

JSON 結構：
{
  "scorecard": { "relevance": 75, "logic": 70, "confidence": 65, "overall": 72 },
  "per_question": [
    {
      "question_id": "與題目清單完全相同的 UUID",
      "diagnosis": "...",
      "rewritten_answer": "...",
      "follow_up_predictions": ["...", "...", "..."]
    }
  ],
  "summary": "..."
}`;
}

function formatSessionTranscript(
  questions: InterviewQuestion[],
  answers: InterviewAnswer[]
): string {
  const byId = new Map(answers.map((a) => [a.question_id, a]));
  const lines: string[] = [];
  for (const q of questions) {
    const a = byId.get(q.id);
    lines.push(`【Q${q.order + 1} | ${q.category}】 id=${q.id}`);
    lines.push(q.text);
    if (a) {
      lines.push(`\n候選人回答：\n${a.answer_text || "（未作答）"}`);
      if (a.drill_down) {
        lines.push(`\n追問：${a.drill_down.question}`);
        lines.push(`追問回答：${a.drill_down.answer || "（未作答）"}`);
      }
    } else {
      lines.push("\n候選人回答：（未作答）");
    }
    lines.push("\n---\n");
  }
  return lines.join("\n");
}

function stripMarkdownFence(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function fallbackScorecard(): Scorecard {
  return { relevance: 0, logic: 0, confidence: 0, overall: 0 };
}

function fallbackFeedback(q: InterviewQuestion): PerQuestionFeedback {
  return {
    question_id: q.id,
    diagnosis: "無法自動生成此題診斷，請重新嘗試。",
    rewritten_answer: "",
    follow_up_predictions: [],
  };
}

export async function evaluateSession(
  questions: InterviewQuestion[],
  answers: InterviewAnswer[],
  resumeContent: ResumeContent | null,
  jobDescription: string,
  mode: InterviewMode,
  locale?: string
): Promise<InterviewReport> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const transcript = formatSessionTranscript(questions, answers);
  const resumeText = resumeContent
    ? resumeToText(resumeContent)
    : "（未提供履歷）";

  const result = await model.generateContent([
    { text: getSystemPrompt(mode, locale) },
    {
      text: `職缺描述：\n${jobDescription}\n\n---\n\n候選人履歷：\n${resumeText}\n\n---\n\n面試逐題內容：\n${transcript}`,
    },
  ]);

  const rawText = result.response.text();
  const cleaned = stripMarkdownFence(rawText);

  let json: unknown;
  try {
    json = JSON.parse(cleaned);
  } catch (err) {
    console.error(
      "[evaluate-session] JSON.parse failed. Raw response (first 1000 chars):",
      rawText.slice(0, 1000),
      err
    );
    return {
      scorecard: fallbackScorecard(),
      per_question: questions.map(fallbackFeedback),
      summary:
        locale === "en"
          ? "Failed to parse AI response. Please try generating the report again."
          : "AI 回應解析失敗，請重新產生報告。",
    };
  }

  const parsed = reportSchema.safeParse(json);
  if (!parsed.success) {
    console.error(
      "[evaluate-session] Zod validation failed:",
      parsed.error.issues.slice(0, 5),
      "Raw JSON keys:",
      json && typeof json === "object" ? Object.keys(json) : typeof json
    );
  }

  const data = parsed.success
    ? parsed.data
    : coerceLoosely(json, questions, locale);

  const scorecard: Scorecard = {
    relevance: clamp(data.scorecard.relevance, 0, 100),
    logic: clamp(data.scorecard.logic, 0, 100),
    confidence: clamp(data.scorecard.confidence, 0, 100),
    overall: clamp(data.scorecard.overall, 0, 100),
  };

  const validIds = new Set(questions.map((q) => q.id));
  const matchedById: PerQuestionFeedback[] = data.per_question.filter((p) =>
    validIds.has(p.question_id)
  );

  let perQuestion: PerQuestionFeedback[];
  if (matchedById.length >= Math.min(questions.length, data.per_question.length)) {
    perQuestion = matchedById;
  } else {
    // ID 對不上時，按陣列順序配對到題目清單
    perQuestion = questions.map((q, i) => {
      const fb = data.per_question[i];
      if (!fb) return fallbackFeedback(q);
      return {
        question_id: q.id,
        diagnosis: fb.diagnosis || "",
        rewritten_answer: fb.rewritten_answer || "",
        follow_up_predictions: fb.follow_up_predictions || [],
      };
    });
  }

  return {
    scorecard,
    per_question: perQuestion,
    summary: data.summary || "",
  };
}

type LooseReport = z.infer<typeof reportSchema>;

function coerceLoosely(
  raw: unknown,
  questions: InterviewQuestion[],
  locale?: string
): LooseReport {
  const r = (raw ?? {}) as Record<string, unknown>;
  const sc = (r.scorecard ?? {}) as Record<string, unknown>;
  const pq = Array.isArray(r.per_question) ? r.per_question : [];

  return {
    scorecard: {
      relevance: typeof sc.relevance === "number" ? sc.relevance : 0,
      logic: typeof sc.logic === "number" ? sc.logic : 0,
      confidence: typeof sc.confidence === "number" ? sc.confidence : 0,
      overall: typeof sc.overall === "number" ? sc.overall : 0,
    },
    per_question: pq.map((entry, i): PerQuestionFeedback => {
      const e = (entry ?? {}) as Record<string, unknown>;
      return {
        question_id:
          typeof e.question_id === "string"
            ? e.question_id
            : (questions[i]?.id ?? ""),
        diagnosis: typeof e.diagnosis === "string" ? e.diagnosis : "",
        rewritten_answer:
          typeof e.rewritten_answer === "string" ? e.rewritten_answer : "",
        follow_up_predictions: Array.isArray(e.follow_up_predictions)
          ? e.follow_up_predictions.filter(
              (s): s is string => typeof s === "string"
            )
          : [],
      };
    }),
    summary:
      typeof r.summary === "string"
        ? r.summary
        : locale === "en"
          ? "Summary unavailable."
          : "摘要暫不可用。",
  };
}

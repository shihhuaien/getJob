import { z } from "zod";
import { getGemini, withGeminiRetry } from "../gemini";

export interface StarHint {
  situation: string;
  task: string;
  action: string;
  result: string;
}

const hintSchema = z.object({
  situation: z.string(),
  task: z.string(),
  action: z.string(),
  result: z.string(),
});

function getSystemPrompt(locale?: string) {
  const isEn = locale === "en";
  const lang = isEn
    ? "All text must be in English."
    : "所有文字使用繁體中文。";
  return `你是一位面試教練。當候選人回答卡住時，你不會直接給答案，而是依 STAR 原則提供「引導性提示」，讓他能自行把話說完。

STAR 結構：
- Situation（情境）：當時的背景、團隊規模、面臨的限制
- Task（任務）：你被交付的責任或要解決的問題
- Action（行動）：你具體做了什麼、用了什麼方法
- Result（結果）：量化的成果、學到什麼、後續影響

你會收到：題目、候選人目前的回答草稿。

請回傳 JSON 格式，每個欄位一行引導問題（不是答案），幫助候選人把自己的經歷套入 STAR：
{
  "situation": "引導問題，幫助候選人描述情境",
  "task": "引導問題，幫助候選人釐清任務",
  "action": "引導問題，幫助候選人展開行動",
  "result": "引導問題，幫助候選人量化結果"
}

嚴格規則：
- 每個欄位 1-2 句，句末以問號結尾
- 不可替候選人捏造情境或結果
- 若草稿已提到某部分，在對應欄位點出下一步可以補充什麼
- ${lang}
- 只回傳純 JSON，不要包含 Markdown code fence 或其他文字`;
}

export async function generateStarHint(
  questionText: string,
  currentAnswer: string,
  locale?: string
): Promise<StarHint> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await withGeminiRetry(() =>
    model.generateContent([
      { text: getSystemPrompt(locale) },
      {
        text: `題目：${questionText}\n\n候選人目前草稿：\n${currentAnswer || "（尚未輸入）"}`,
      },
    ]),
  );

  const rawText = result.response.text();
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    const json = JSON.parse(cleaned);
    return hintSchema.parse(json);
  } catch (err) {
    console.error(
      "[generate-hint] Parse failed. Raw (first 500 chars):",
      rawText.slice(0, 500),
      err
    );
    return {
      situation:
        locale === "en"
          ? "What was the context and team scale you were facing?"
          : "當時的情境、團隊規模或面臨的限制是什麼？",
      task:
        locale === "en"
          ? "What specific problem or goal were you responsible for?"
          : "你被交付解決的具體問題或目標是什麼？",
      action:
        locale === "en"
          ? "What concrete actions did you take, and why that approach?"
          : "你採取了哪些具體行動？為什麼選擇這個作法？",
      result:
        locale === "en"
          ? "What was the outcome — quantified if possible — and what did you learn?"
          : "最後的成果如何？能量化嗎？你從中學到了什麼？",
    };
  }
}

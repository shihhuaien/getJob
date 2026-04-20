import { z } from "zod";
import { getGemini } from "../gemini";

const responseSchema = z.object({
  should_drill_down: z.boolean(),
  follow_up_question: z.string(),
  reason: z.string().optional(),
});

function getSystemPrompt(locale?: string) {
  const isEn = locale === "en";
  const lang = isEn
    ? "The follow-up question must be in English."
    : "追問題使用繁體中文。";

  return `你是一位嚴格的面試官。剛才候選人回答了一道題，請判斷是否需要針對這個答案進行「深度追問」。

判斷標準（以下任一成立即需追問）：
1. 答案過於表面、沒有具體案例或數字
2. 答案提到某個決策或行動，但沒解釋「為什麼」選這個做法而非替代方案
3. 答案缺少「結果」或量化成果
4. 答案模糊或偏離題目核心
5. 答案很漂亮、但剛好是可以再深挖技術或商業細節的點

追問風格：
- 單一問題，聚焦在一個具體點（不要一次追問多件事）
- 具挑戰性但不攻擊人
- 鼓勵候選人展現更深層的思考或具體案例
- 長度 1-2 句，結尾以問號

嚴格規則：
- 必須回傳 JSON，包含 should_drill_down、follow_up_question、reason
- 如果答案已經充分且完整，should_drill_down = false，follow_up_question 可回傳空字串
- 若 should_drill_down = true，follow_up_question 必須是一個合適的追問題
- ${lang}
- 只回傳純 JSON，不要 Markdown code fence 或其他文字

JSON 結構：
{
  "should_drill_down": true,
  "follow_up_question": "追問題文字...",
  "reason": "為什麼決定追問（內部說明，候選人看不到）"
}`;
}

export async function generateDrillDown(
  questionText: string,
  answerText: string,
  locale?: string
): Promise<string | null> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent([
    { text: getSystemPrompt(locale) },
    {
      text: `題目：${questionText}\n\n候選人回答：\n${answerText || "（空白或極短，候選人沒好好回答）"}`,
    },
  ]);

  const rawText = result.response.text();
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    const json = JSON.parse(cleaned);
    const parsed = responseSchema.parse(json);
    if (!parsed.should_drill_down) return null;
    const q = parsed.follow_up_question.trim();
    return q.length > 0 ? q : null;
  } catch (err) {
    console.error(
      "[generate-drill-down] Parse failed. Raw (first 500 chars):",
      rawText.slice(0, 500),
      err
    );
    return null;
  }
}

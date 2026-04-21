import { getGemini, withGeminiRetry } from "./gemini";
import { resumeToText } from "./optimize-resume";
import type { ResumeContent } from "@/types/resume";

function getSystemPrompt(locale?: string) {
  const lang = locale === "en"
    ? "The entire letter must be in English (keep English proper nouns as-is)"
    : "全文使用繁體中文（若履歷中有英文專有名詞則保留英文）";
  return `你是一位專業的求職信撰寫顧問。根據求職者的履歷內容與目標職缺描述，撰寫一封客製化的求職信。

求職信結構：
1. 開頭：稱呼招募團隊，表達對該職位的興趣
2. 第一段：簡要自我介紹，說明為何對此職位感興趣
3. 第二段：根據職缺需求，列舉履歷中最相關的經歷與技能，說明如何勝任
4. 第三段：補充個人特質或其他優勢，表達對公司的了解與認同
5. 結尾：感謝對方撥冗閱讀，表達面談意願

嚴格規則：
- 所有內容必須基於履歷中的真實經歷，不可捏造不存在的經驗、技能或成就
- 語氣專業但溫暖自然，避免過度正式或套路化
- ${lang}
- 長度約 300-500 字，不宜過長
- 直接輸出求職信純文字，不要加任何標題、格式標記或額外說明`;
}

export async function generateCoverLetter(
  resumeContent: ResumeContent,
  jobDescription: string,
  companyName: string,
  jobTitle: string,
  locale?: string
): Promise<string> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  const resumeText = resumeToText(resumeContent);

  const result = await withGeminiRetry(() =>
    model.generateContent([
      { text: getSystemPrompt(locale) },
      {
        text: `求職者履歷：\n${resumeText}\n\n---\n\n目標公司：${companyName}\n目標職位：${jobTitle}\n\n職缺描述：\n${jobDescription}`,
      },
    ]),
  );

  return result.response.text().trim();
}

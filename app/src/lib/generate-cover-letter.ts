import { getGemini, withGeminiRetry } from "./gemini";
import { resumeToText } from "./optimize-resume";
import type { ResumeContent } from "@/types/resume";

function getSystemPrompt(locale?: string) {
  const lang = locale === "en"
    ? "Write the entire letter in English."
    : "全文使用繁體中文（若履歷中有英文專有名詞則保留英文）";

  if (locale === "en") {
    return `You write cover letters that sound like a real person wrote them — not AI.

Style rules:
- Use short, simple sentences. No long compound sentences with semicolons.
- Be direct and honest. If the applicant lacks direct experience, say so plainly and explain why they can still do the job.
- Never use corporate buzzwords like "leverage", "synergy", "passionate", "dynamic", "results-driven", "seeking to contribute", "I am excited to apply", etc.
- Do not use flowery or flattering language about the company.
- Use "First, Second, Third" or similar plain connectors to list reasons — this is clearer and more human than vague paragraphs.
- Mention practical, specific details (certifications, location, transport, physical ability, tools they know) — these feel real.
- Keep the tone like someone speaking plainly and honestly to a manager, not performing professionalism.
- The closing should be short and genuine. One or two sentences.

Structure (keep it simple):
1. One-sentence opener: state what job you are applying for.
2. Briefly note any experience gap honestly, then pivot to genuine interest.
3. Give 2–4 concrete reasons why you are a good fit, using "First... Second... Third..." format. Each reason must come from the resume.
4. Add one practical detail (location, availability, transport, etc.) if it is relevant.
5. Short, genuine closing — thank them, say you hope to talk.

Strict rules:
- Only use facts from the resume. Do not invent skills, experience, or achievements.
- ${lang}
- Length: 200–350 words. Do not pad.
- Output only the plain letter text. No headers, no markdown, no extra commentary.`;
  }

  return `你寫的求職信要像真人寫的，不像 AI 生成的。

風格規則：
- 用短句、簡單句。不要長篇大論的複合句。
- 直接、誠實。如果求職者沒有直接經驗，直說，然後解釋為何仍然合適。
- 絕對不要用套路詞彙，例如「誠摯地」、「積極進取」、「熱情洋溢」、「貴公司」、「期待加入貴團隊為公司貢獻所長」等。
- 不要對公司寫空洞的讚美。
- 用「第一、第二、第三」等簡單連接詞列出理由——比模糊的段落更清晰、更像真人。
- 提到具體、實際的細節（證照、住所、交通、體力、熟悉的工具），這些讀起來真實。
- 語氣像一個人在對經理直接、誠實地說話，不要表演專業感。
- 結尾要短、真誠，一到兩句話即可。

結構（保持簡單）：
1. 一句開頭：說明應徵哪個職位。
2. 簡短說明經歷背景，若有落差請誠實帶過，轉向說明真正的興趣。
3. 用「第一……第二……第三……」格式列出 2–4 個適合的具體理由，每個理由必須來自履歷。
4. 若有相關的實際條件（地點、交通、時間安排等），加一句提及。
5. 短而真誠的結尾——感謝對方，說明期待面談。

嚴格規則：
- 所有內容只能來自履歷中的真實資料，不可捏造經驗、技能或成就。
- ${lang}
- 長度：200–350 字。不要為了填篇幅而拉長。
- 只輸出求職信純文字，不加任何標題、格式標記或額外說明。`;
}

function buildExtraBlock(extraInstructions?: string): string {
  return extraInstructions?.trim()
    ? `\n\n---\n額外指示：${extraInstructions.trim()}`
    : "";
}

export async function generateCoverLetter(
  resumeContent: ResumeContent,
  jobDescription: string,
  companyName: string,
  jobTitle: string,
  locale?: string,
  extraInstructions?: string
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
        text: `求職者履歷：\n${resumeText}\n\n---\n\n目標公司：${companyName}\n目標職位：${jobTitle}\n\n職缺描述：\n${jobDescription}${buildExtraBlock(extraInstructions)}`,
      },
    ]),
  );

  return result.response.text().trim();
}

export async function* generateCoverLetterStream(
  resumeContent: ResumeContent,
  jobDescription: string,
  companyName: string,
  jobTitle: string,
  locale?: string,
  extraInstructions?: string
): AsyncGenerator<string, void, unknown> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  const resumeText = resumeToText(resumeContent);

  const result = await withGeminiRetry(() =>
    model.generateContentStream([
      { text: getSystemPrompt(locale) },
      {
        text: `求職者履歷：\n${resumeText}\n\n---\n\n目標公司：${companyName}\n目標職位：${jobTitle}\n\n職缺描述：\n${jobDescription}${buildExtraBlock(extraInstructions)}`,
      },
    ]),
  );

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

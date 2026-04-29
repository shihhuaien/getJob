import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "ats-keywords-guide",
  title: "ATS 關鍵字怎麼塞進履歷？三步驟自然融入",
  description:
    "履歷在到 HR 手上前，可能先被 ATS 系統篩過。這三個步驟讓你不靠關鍵字堆砌，也能順利通過機器這一關。",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-12",
  updatedAt: "2026-04-12",
  readingMinutes: 4,
  author: "Offery 編輯團隊",
  ctaTool: "resume-optimizer",
  ctaText: "用 AI 比對 JD 關鍵字覆蓋率",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        如果你最近投了不少職缺都沒收到回應，問題可能不在內容，而在於——你的履歷可能根本沒到 HR 桌上。
      </p>
      <p>
        ATS（Applicant Tracking System，求職者追蹤系統）是公司用來自動分類履歷的軟體。在台灣，外商與較具規模的科技公司（含 104 進階企業徵才）幾乎都會用 ATS 預先過濾關鍵字。意思是，HR 看到你之前，先要過機器這關。
      </p>

      <h2>步驟一：把 JD 拆解成關鍵字清單</h2>
      <p>
        打開職缺描述，把以下三類詞圈出來：
      </p>
      <ul>
        <li>
          <strong>硬技能</strong>：工具、語言、框架（如 Python、Figma、SQL、SEO）
        </li>
        <li>
          <strong>軟技能</strong>：JD 中重複出現的能力描述（如 cross-functional、stakeholder management）
        </li>
        <li>
          <strong>產業詞彙</strong>：行業特有名詞（如 OKR、CAC、conversion rate）
        </li>
      </ul>
      <p>
        每個詞都記下來，特別注意 JD 標題、第一段、職責清單，那是 ATS 權重最高的位置。
      </p>

      <h2>步驟二：自然融入你的經歷，不是條列堆砌</h2>
      <p>
        不要在履歷最下方做一個「Skills」清單把所有關鍵字塞進去——這對 ATS 沒加多少分，反而讓 HR 覺得你在投機。正確做法是把關鍵字寫進你「曾經做過什麼」的描述裡：
      </p>
      <ul>
        <li>
          ❌「Skills：SQL, Python, Tableau, A/B testing」
        </li>
        <li>
          ✅「使用 SQL 與 Python 從 BigQuery 撈取使用者行為資料，搭配 Tableau 視覺化後設計 A/B test，將註冊轉換率提升 12%。」
        </li>
      </ul>
      <p>
        關鍵字出現在動詞和成果旁邊，ATS 與 HR 同時點頭。
      </p>

      <h2>步驟三：對照覆蓋率，瞄準 70% 以上</h2>
      <p>
        投出去之前，做最後一道檢查：把你的履歷與 JD 並排，看看 JD 的關鍵字有多少出現在你履歷裡。實務上：
      </p>
      <ul>
        <li>覆蓋率 &lt; 50%：高機率被 ATS 刷掉，需要重新調整</li>
        <li>覆蓋率 50–70%：邊界區，建議再優化</li>
        <li>覆蓋率 &gt; 70%：穩穩進入 HR 視線</li>
      </ul>

      <h2>避開三個常見錯誤</h2>
      <ol>
        <li>
          <strong>用圖片或表格塞文字</strong>：很多 ATS 無法讀圖，圖片裡的字等於不存在。
        </li>
        <li>
          <strong>檔名不專業</strong>：避免「履歷-最新版-final-v3.pdf」，改用「YourName_Resume.pdf」。
        </li>
        <li>
          <strong>用罕見字型或顏色</strong>：ATS 會嘗試解析，越花俏越容易出錯，乾淨的單欄黑底白字最安全。
        </li>
      </ol>

      <h2>下一步</h2>
      <p>
        想知道你的履歷對某份 JD 的關鍵字覆蓋率有多高？把履歷與 JD 一起丟進 Offery 的履歷優化器，會直接給你一個 ATS 分數與缺漏關鍵字清單。
      </p>
    </>
  );
}

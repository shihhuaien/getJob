import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-quantify-impact",
  title: "沒有亮眼數字的工作，履歷怎麼寫得有力？",
  description:
    "不是業務、沒有營收 KPI 也能量化成就。三層次寫法讓行政、客服、設計、研發的履歷一樣有重量。",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-22",
  updatedAt: "2026-04-22",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "resume-optimizer",
  ctaText: "用 AI 履歷優化器，把每條成就放進量化框架",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        最常被誤解的事：以為「量化」只屬於業務、行銷這種有 KPI 的職位。實際上，任何工作都能量化——你只是沒被教過怎麼挖。
      </p>
      <p>
        記住一個三層次公式：<strong>動詞 + 規模 + 結果</strong>。每條履歷 bullet 都試著湊齊這三層，沒湊到就盡量補。
      </p>

      <h2>第一層：動詞要強</h2>
      <p>
        弱動詞會讓整句失去重量。把「協助、參與、負責」換成「主導、設計、整合、優化、節省」。同一件事，動詞不同，氣勢差很多。
      </p>
      <ul>
        <li>❌「協助處理客訴案件」</li>
        <li>✅「重新設計客訴處理流程」</li>
      </ul>

      <h2>第二層：規模要看得出大小</h2>
      <p>
        即使不是錢，也能描述「多少」：
      </p>
      <ul>
        <li>
          <strong>人</strong>：「帶 5 人團隊」「服務 200+ 內部客戶」「教育訓練 50 位新進員工」
        </li>
        <li>
          <strong>件</strong>：「每月處理 300 張工單」「審核 40 份合約」
        </li>
        <li>
          <strong>頻率</strong>：「每週 3 場跨部門會議」「每月 2 次部門簡報」
        </li>
        <li>
          <strong>範圍</strong>：「橫跨 4 個部門」「3 個產品線」
        </li>
      </ul>

      <h2>第三層：結果要可驗證</h2>
      <p>
        最有力的結果是百分比、時間、金額。沒有這些的話，描述「狀態的轉變」也行。
      </p>
      <ul>
        <li>「客訴回覆時間從 48 小時降到 12 小時」</li>
        <li>「節省每月 8 小時手動報表時間」</li>
        <li>「導入新流程後，跨部門誤會次數明顯減少（季 review 由橘轉綠）」</li>
      </ul>

      <h2>三個常見職位的範例</h2>
      <p>
        <strong>行政助理</strong>：
      </p>
      <blockquote>
        重新設計部門差勤系統，整合 Google Calendar 與 Slack 通知，將每月手動排班從 6 小時降到 1 小時，並讓 30 位同事即時看到請假資訊。
      </blockquote>
      <p>
        <strong>客服</strong>：
      </p>
      <blockquote>
        建立常見問題知識庫（80 篇），新進客服上手時間從 3 週縮短到 1.5 週，CSAT 從 4.2 提升到 4.6。
      </blockquote>
      <p>
        <strong>UI 設計師</strong>：
      </p>
      <blockquote>
        重新設計註冊流程，將 4 步驟簡化為 2 步驟，註冊完成率從 58% 提升至 73%（A/B test 兩週、樣本 8,000）。
      </blockquote>

      <h2>三個常見的雷</h2>
      <ol>
        <li>
          <strong>湊不到數字就放棄整條</strong>：能寫到動詞 + 規模兩層也比沒寫好。
        </li>
        <li>
          <strong>數字背景沒交代</strong>：「提升 30%」沒有 baseline 等於沒講。「從 58% 提升到 73%」才完整。
        </li>
        <li>
          <strong>誇大到無法回答追問</strong>：寫的數字面試會被問細節，撐不下去比保守還慘。
        </li>
      </ol>

      <h2>下一步</h2>
      <p>
        挑你履歷裡最弱的 3 條 bullet，套上「動詞 + 規模 + 結果」三層公式重寫。如果想要 AI 一條條檢查，把履歷與 JD 一起丟進 Offery 的履歷優化器，會直接告訴你哪些條缺了哪一層。
      </p>
    </>
  );
}

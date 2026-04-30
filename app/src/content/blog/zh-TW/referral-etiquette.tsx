import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "referral-etiquette",
  title: "找 Referral 的禮貌動線：別一開口就丟履歷",
  description:
    "在台灣科技圈，referral 比直接投履歷有效 10 倍。但搞錯動線就毀了關係。三步驟讓對方願意幫你。",
  category: "job-search",
  personaTags: ["no-job", "evergreen"],
  publishedAt: "2026-04-16",
  updatedAt: "2026-04-16",
  readingMinutes: 4,
  author: "Offery 編輯團隊",
  ctaTool: "jobs",
  ctaText: "把想找 referral 的職缺存進 Offery 統一追蹤",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        Referral 在台灣科技圈愈來愈標配。同一份履歷，從外部投跟透過 referral 投，被翻牌率差距可達 10 倍。但<strong>找 referral 是一個關係練習，不是一次交易</strong>。第一步搞錯，後面就回不去了。
      </p>

      <h2>動線第一步：先建立關係，再請求 referral</h2>
      <p>
        最常見、最毀關係的開場：
      </p>
      <blockquote>
        「Hi，看到 X 公司在徵 Y 職缺，可以幫我 refer 嗎？我履歷在這～」
      </blockquote>
      <p>
        即使是熟識朋友，這句話都會讓對方為難。對方在公司是要為他 refer 的人背書的，refer 一個能力不確定的人，對他自己的信用是扣分。
      </p>
      <p>
        正確的順序：
      </p>
      <ol>
        <li>先請<strong>資訊性訪談（informational interview）</strong>——15 至 20 分鐘聊聊那個公司或職位</li>
        <li>聊完讓對方感覺「這個人不錯、聊起來有實力」</li>
        <li>對方<strong>主動</strong>提出 refer，或在第二次接觸時你<strong>具體</strong>請求</li>
      </ol>

      <h2>動線第二步：資訊性訪談的 3 個好題目</h2>
      <p>
        資訊性訪談不是面試，但要讓對方覺得有意思。準備這三類題目，遠比尬聊好：
      </p>

      <h3>1. 真實工作體驗類</h3>
      <ul>
        <li>「在 [公司] 待了 2 年，最讓你意外的是什麼？」</li>
        <li>「[那個職位] 平常一週的時間大概怎麼分配？」</li>
        <li>「跟外面看到的形象比，有沒有差很多？」</li>
      </ul>

      <h3>2. 文化判斷類</h3>
      <ul>
        <li>「公司決策節奏快還慢？什麼樣的人在這裡會做得開心？」</li>
        <li>「最近一年公司有什麼大的變化？」</li>
      </ul>

      <h3>3. 給你建議類（最後問）</h3>
      <ul>
        <li>「如果是你看現在的我，會建議我先補哪一塊再投？」</li>
        <li>「你覺得我履歷上哪個經驗，跟這個職位最有連結？」</li>
      </ul>
      <p>
        最後一類問題，會自然把你的履歷送到對方眼前，他可能<strong>主動</strong>說「不然我幫你 refer 看看」——這是最好的局面。
      </p>

      <h2>動線第三步：對方願意 refer 後，你的工作</h2>
      <p>
        如果對方答應幫你 refer，要做三件事讓他輕鬆：
      </p>
      <ol>
        <li>
          <strong>把客製過的履歷寄給他</strong>——已經針對這份 JD 客製過的版本（參考<a href="/blog/resume-tailoring-checklist">客製檢查清單</a>）
        </li>
        <li>
          <strong>附一段 3 句話的「為什麼適合」</strong>——讓他可以直接複製貼到公司內部系統
        </li>
        <li>
          <strong>結果出來後告訴他</strong>——不論面上面下都回報。下次他更願意幫你
        </li>
      </ol>

      <p>
        例子：
      </p>
      <blockquote>
        Hi [名字]，謝謝願意幫我 refer。附上客製過這份 JD 的履歷。
        <br />
        如果公司系統需要 referrer 寫推薦語，這是我整理的 3 句話供參考：「[A] 過去在 X 做過 Y，特別擅長 Z；他對你們團隊的 [具體痛點] 特別有想法；個性 [具體特質]，相信能融入。」
        <br />
        無論結果如何，我都會回報給你。再次謝謝！
      </blockquote>

      <h2>三個地雷</h2>
      <ol>
        <li>
          <strong>同一個人 refer 多家</strong>：每位你 refer 過的人最多 1 至 2 家。多了對方會覺得被當管道。
        </li>
        <li>
          <strong>面試後沒回報</strong>：referrer 在公司其實會被內部追問結果。你不講，他下次不會再 refer。
        </li>
        <li>
          <strong>面試表現差連累對方</strong>：如果 referrer 介紹你，你要把面試準備拉到 1.5 倍認真——你代表的不只是自己。
        </li>
      </ol>

      <h2>下一步</h2>
      <p>
        列出 3 位你想請 referral 的對象，先各寄一封資訊性訪談邀請（不要提 refer）。聊完後再決定要不要進入第二步。同時把目標公司的職缺存進 Offery 追蹤，當對方願意 refer 時，你已經有客製履歷準備好。
      </p>
    </>
  );
}

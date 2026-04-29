import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "salary-negotiation-basics",
  title: "拿到 Offer 別太快點頭：談薪三步驟",
  description:
    "在台灣求職文化裡，談薪常被視為「不禮貌」，但實際上 HR 早已預期你會談。這三個步驟讓你不卑不亢，也不錯過該有的薪水。",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-05",
  updatedAt: "2026-04-05",
  readingMinutes: 4,
  author: "Offery 編輯團隊",
  ctaTool: "jobs",
  ctaText: "把進入面試的職缺記在追蹤板，整理 Offer 比較",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        拿到 Offer 是很開心的事，但別太快「好的我接受」。在台灣求職文化裡，HR 第一次給的數字幾乎都不是天花板——他們預期你會談。沒談的人，等於少拿了原本就在桌上的錢。
      </p>

      <h2>第一步：先準備三個資訊，不靠感覺談</h2>
      <p>
        進入談薪前，你應該知道：
      </p>
      <ul>
        <li>
          <strong>市場行情</strong>：同職位、同年資、同產業在台灣大概多少？可以看 104 薪情、Glassdoor、Levels.fyi、社群討論
        </li>
        <li>
          <strong>你的目前薪水</strong>：含底薪、年終、紅利、股票，加總算 total package
        </li>
        <li>
          <strong>你的底線與期望</strong>：底線（低於這個直接拒）、期望（拿到會很開心）、夢幻（拿到會跳起來）
        </li>
      </ul>
      <p>
        三個數字寫在紙上，談的時候才不會被當下情緒帶走。
      </p>

      <h2>第二步：HR 給數字後，先別急著回應</h2>
      <p>
        HR 報數字之後，最有力的第一句話是：「謝謝，這個 offer 我會認真考慮，可以給我一兩天時間嗎？」
      </p>
      <p>
        這句話做了三件事：
      </p>
      <ol>
        <li>沒有立刻拒絕，氣氛友善</li>
        <li>沒有立刻接受，留下談判空間</li>
        <li>給自己時間冷靜判斷，不是當下被氣氛推著答應</li>
      </ol>

      <h2>第三步：談的時候講三個重點，不要講「我覺得這太低」</h2>
      <p>
        回去後想清楚要怎麼開口。不卑不亢的版本長這樣：
      </p>
      <blockquote>
        「我非常喜歡這個機會，也很想加入團隊。考量到我目前的 total package 是 X、市場上類似職位的中位數約 Y、以及這個職位需要的 [具體技能 / 經驗]，我希望底薪能落在 Z 區間。其他條件我都很滿意。」
      </blockquote>
      <p>
        這個說法包含三個關鍵：
      </p>
      <ul>
        <li>
          <strong>表達意願</strong>：先讓對方知道你想加入，不是來討價還價
        </li>
        <li>
          <strong>給理由不給情緒</strong>：用市場、現職、技能匹配支撐數字，不要用「我覺得」
        </li>
        <li>
          <strong>提出具體區間</strong>：說一個範圍而不是單一數字，雙方都好接
        </li>
      </ul>

      <h2>三個常見心態陷阱</h2>
      <ol>
        <li>
          <strong>「他們會不會因此撤回 offer？」</strong>機率極低。公司花了時間面試、做決定，不會因為你禮貌談薪就翻臉。
        </li>
        <li>
          <strong>「我又沒有很厲害，談什麼薪水。」</strong>HR 給你 offer 就是認可你的價值，談的不是「你值多少」，是「市場給多少」。
        </li>
        <li>
          <strong>「萬一被討厭就糟了。」</strong>專業 HR 把談薪視為流程的一部分，不會因此給你貼負評標籤。如果這家公司因為你談薪而態度變差，那本身就是個訊號。
        </li>
      </ol>

      <h2>不只談底薪</h2>
      <p>
        如果底薪卡住談不動，可以試試其他項目：簽約金（signing bonus）、年假天數、遠端工作彈性、職等與下次調薪時間。整個 package 比單一數字重要。
      </p>
      <p>
        把進入最後階段的 offer 都記在 Offery 的追蹤板，並排比較會更清楚——別讓自己被一個 offer 的情緒綁架，整體判斷才是最後該做的決定。
      </p>
    </>
  );
}

import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "seniority-vs-years",
  title: "面試官眼中的「資深」與「年資」——為什麼 8 年和 5 年沒差別",
  description:
    "面試官視角：「我做這行 10 年了！」聽起來很厲害，但對我沒意義。揭露面試官真正在意的「成熟度訊號」，與年資只是表象的真相。",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery 編輯團隊",
  ctaTool: "jobs",
  ctaText: "用追蹤板規劃下一段能展現「資深」的職位",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        面試時候選人最常 highlight 的點之一：「我做這行 X 年了。」
      </p>
      <p>
        作為面試官，我聽到「年資」其實不會自動加分。<strong>「資深」與「年資」是兩件完全不同的事</strong>。
      </p>
      <p>
        我輔導過不少 8 年資歷的人，市場價值低於某些 4 年的人。原因不是他們做的不好——是他們的 8 年是<strong>「同一年重複 8 次」</strong>，而不是 8 個不同階段。
      </p>

      <h2>面試官真正在意的不是年資，是這四件事</h2>

      <h3>訊號一：「複雜度天花板」</h3>
      <p>
        我會問：「你做過<strong>最複雜的決策</strong>是什麼？」
      </p>
      <p>
        答得好的人會講：3 個利益關係人、2 個 trade-off、1 個沒有完美解法的情境，最後怎麼下決定。
      </p>
      <p>
        年資長但「複雜度天花板低」的人會講：一個技術問題的解法，但沒有政治、沒有 trade-off、沒有 ambiguity。
      </p>
      <p>
        <strong>同樣的職稱，能處理多複雜的問題決定你的 seniority 等級</strong>。8 年的 staff engineer 跟 5 年的 staff engineer 差距，常常就在這裡。
      </p>

      <h3>訊號二：「你會 frame 問題嗎？還是只會解問題？」</h3>
      <p>
        Junior 的本能：「告訴我問題，我去解決」。
      </p>
      <p>
        Senior 的本能：「先問——這真的是問題嗎？要解決哪個面向？」
      </p>
      <p>
        面試時我會丟一個半成品題目給你：「我們的 churn 最近上升，你會怎麼處理？」
      </p>
      <p>
        Junior 會直接跳到方案：「我會 A/B test 不同的 onboarding...」
      </p>
      <p>
        Senior 會先反問：「上升幅度多少？是哪個 cohort？是新客戶 churn 還是老客戶？產品有變嗎？」<strong>這個 reframe 動作，就是 seniority 訊號</strong>。
      </p>

      <h3>訊號三：「你能不能講出『我學到 X，但 Y 還在學』」</h3>
      <p>
        年資長但沒進步的人，講話有一個特徵：<strong>什麼都「會」</strong>。任何問題你問他，他都答「我熟」「我做過」「我知道」。
      </p>
      <p>
        真正資深的人會精準分辨：「[A] 我已經能 lead 別人；[B] 我能執行但還沒到 master；[C] 我有概念但實戰不夠；[D] 我完全沒接觸。」
      </p>
      <p>
        這個四層的 self-assessment 能力，<strong>是面試官評估資深度最關鍵的指標</strong>。
      </p>

      <h3>訊號四：「你能不能 mentor 別人？」</h3>
      <p>
        我會問：「你帶過比你資淺的人嗎？教他們什麼？他們現在怎樣了？」
      </p>
      <p>
        年資長但沒帶過人的，會慌：「呃，我們公司沒有那個 mentor program...」
      </p>
      <p>
        真正資深的人會講三個 layer：「<strong>我教過 X 怎麼做 [具體事]，他現在已經能獨立 [更高層級的事]；我教 Y 是用 mentoring 而不是教學的方式；我自己也從教 Z 中學到 [我的盲點]</strong>」。
      </p>
      <p>
        能教別人 = 你真的吃透了。教不了別人 = 你只是「會做」，沒「會教」。
      </p>

      <h2>「資深但年資不長」的反例</h2>
      <p>
        我面過 5 年資歷被認可為「Senior」的候選人。她的特徵：
      </p>
      <ol>
        <li>
          <strong>每段工作都有質的變化</strong>：第一年執行、第二年帶 1 人、第三年負責 1 個產品線、第四年管 5 人團隊、第五年跨部門
        </li>
        <li>
          <strong>主動 stretch</strong>：每年要主管給 1 個比現在等級高半級的專案
        </li>
        <li>
          <strong>失敗 + 反思</strong>：能講出 3 個失敗案例，每個都有清楚的 takeaway
        </li>
        <li>
          <strong>產業視角</strong>：不只談自己公司，能講出產業 trend、競品策略
        </li>
      </ol>
      <p>
        這 4 個指標到位，5 年市場價值可以高過普通 8 年。
      </p>

      <h2>「年資長但市場價值低」的常見模式</h2>
      <p>
        這個模式痛但要說：
      </p>
      <ol>
        <li>
          <strong>同公司待 8 年沒升職</strong>：履歷上看不到 stretch 的證據
        </li>
        <li>
          <strong>同樣職能換 3 家公司</strong>：橫向移動沒有縱向成長
        </li>
        <li>
          <strong>沒帶過人</strong>：到 8 年還是純 IC，市場會懷疑你的 leadership
        </li>
        <li>
          <strong>沒處理過危機</strong>：面試講不出「失敗 / 重大決策」，顯示沒接觸關鍵時刻
        </li>
        <li>
          <strong>沒換過產業 / 規模</strong>：經驗單一，缺乏跨環境的適應證據
        </li>
      </ol>
      <p>
        如果你符合 3 個以上，<strong>你的 8 年在面試官眼中等於 4 年</strong>。
      </p>

      <h2>怎麼把「年資」轉化成「資深」？</h2>

      <h3>做法一：每段工作主動找「stretch」</h3>
      <p>
        每年問自己：「我今年負責的，比去年複雜多少？」如果答案是「差不多」——你正在浪費年資。
      </p>

      <h3>做法二：建立「教別人」的紀錄</h3>
      <p>
        即使公司沒 mentor program，你也可以：帶新人 onboarding、寫團隊內部教學文件、跨部門訓練。<strong>這些紀錄會變成你下次面試的彈藥</strong>。
      </p>

      <h3>做法三：刻意累積「失敗故事」</h3>
      <p>
        資深的人不怕講失敗，因為失敗是真實經驗的證據。<strong>沒失敗的履歷，是沒有真實挑戰的履歷</strong>。
      </p>

      <h3>做法四：每年給自己一份「能力盤點」</h3>
      <p>
        分四個 level（lead 別人 / 能獨立 / 知道 / 沒接觸）。每年比較變化。如果連續 2 年沒進步，是強訊號要動了。
      </p>

      <h2>面試官的小提醒</h2>
      <p>
        最讓我惋惜的候選人是<strong>「履歷年資長但訪談 5 分鐘就看出沒積累」</strong>的人。他們不是不努力，是用「同一招」混了很多年。
      </p>
      <p>
        反之，最讓我驚艷的是<strong>「年資不算長但展現出超齡成熟度」</strong>的人。他們證明：seniority 不是時間累積，是<strong>每段時間裡質的變化</strong>。
      </p>

      <h2>下一步</h2>
      <p>
        花 30 分鐘做這個練習：列出你過去每一年的「複雜度提升」「教過誰」「失敗 + 學到什麼」。如果連續兩年都沒東西可寫，這就是你的 wake-up call——可能是時候找下一段能展現 seniority 的舞台。把可能的職位存進 Offery 追蹤板，給自己選項。
      </p>
    </>
  );
}

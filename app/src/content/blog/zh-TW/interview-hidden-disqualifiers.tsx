import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-hidden-disqualifiers",
  title: "你面試表現好卻被 reject？三個沒人告訴你的隱性扣分點",
  description:
    "面試官視角：你以為答得很好，回家等通知。我們在 debrief 把你 reject——理由不是你能力，是三個你不會被告知的隱性訊號。",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "interview",
  ctaText: "AI 模擬會抓出你不知道的隱性扣分",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        最讓候選人困惑的 rejection：「我覺得我答得很好，怎麼還是被刷？」
      </p>
      <p>
        這通常不是能力問題，是<strong>「隱性扣分」</strong>——面試官不會告訴你，但 debrief 時會被反覆提到的細節。HR 給的官方拒絕信永遠寫「我們找到更適合的候選人」，但內部真正的理由是這些。
      </p>
      <p>
        三個最常見的隱性 disqualifier：
      </p>

      <h2>扣分點一：你「沒問問題」或「問錯問題」</h2>
      <p>
        Debrief 裡反覆出現的紀錄：「他最後沒問什麼問題」「他問的問題很表面」「他問的問題顯示沒做功課」。
      </p>
      <p>
        為什麼這個這麼致命？因為面試官把「問題的品質」當成<strong>「主動性」與「策略思考」的代理指標</strong>。
      </p>
      <p>
        典型扣分情境：
      </p>
      <ul>
        <li>
          「沒問題」（顯示沒興趣或沒準備）
        </li>
        <li>
          「請問公司福利怎樣？」（問了等於沒問）
        </li>
        <li>
          「請問公司願景是什麼？」（網站上有，等於沒做功課）
        </li>
        <li>
          「請問你 onboarding 多久？」（太細節，看不出戰略眼）
        </li>
      </ul>
      <p>
        相反，能加分的問題範例：「我看到貴公司去年從 [A 業務] 轉到 [B 業務]，這個轉型對 [我會待的部門] 帶來什麼挑戰？」——<strong>具體、做過功課、有戰略眼</strong>。
      </p>

      <h2>扣分點二：你「答對了，但 over-explained」</h2>
      <p>
        我面過很多技術強的候選人，被 reject 的原因常常是：<strong>「他答得 OK，但我聽得很累」</strong>。
      </p>
      <p>
        典型的 over-explain 模式：
      </p>
      <ul>
        <li>
          被問一個 yes/no 題，講 3 分鐘背景
        </li>
        <li>
          被問做過什麼專案，從 5 年前的 onboarding 開始講
        </li>
        <li>
          被問結果如何，先把所有困難講一遍才講結果
        </li>
        <li>
          回答完忍不住補一句「對了，我還有⋯⋯」
        </li>
      </ul>
      <p>
        Over-explain 在 debrief 會被講成：「他簡報能力可能不強」「他不知道什麼是重點」「他向上溝通會累」。
      </p>
      <p>
        對策：練「<strong>30 秒先給結論，再展開細節</strong>」。每個回答都用 PREP 結構：Point（結論）→ Reason（原因）→ Example（例子）→ Point（再強調結論）。
      </p>

      <h2>扣分點三：你的「為什麼想離開現職」聽起來不對</h2>
      <p>
        這題幾乎所有面試一定會問。但答得不對勁，會被解讀成<strong>「他可能會帶問題進來」</strong>。
      </p>
      <p>
        典型扣分版本：
      </p>

      <h3>版本 A：「現在公司不好」</h3>
      <p>
        「我們公司沒前途」「老闆很糟」「同事不行」——這些是 debrief 裡的死刑：「他到我們也會這樣評論我們」。
      </p>

      <h3>版本 B：「想要更高薪 / 更高 title」</h3>
      <p>
        誠實但戰術上錯。Debrief：「他是來談薪資的，不是來工作的，留不久」。即使這就是你的真實理由，<strong>不要這樣講</strong>。
      </p>

      <h3>版本 C：「想要新挑戰」（太抽象）</h3>
      <p>
        Debrief：「他講不出具體的什麼，可能是隨便丟履歷」。
      </p>

      <h3>強的版本：</h3>
      <blockquote>
        「我在現在公司過去 3 年學到 [具體能力]，也帶過 [具體規模]。但我評估接下來 2 年，這家公司能再給我的 stretch 不夠——他們的下一個成長階段需要的是 [我已經會的]，而我想做的是 [新方向]。所以我不是在「逃離」，是在「主動找對的下一站」。剛好你們的 [具體業務] 是我看了很久的方向。」
      </blockquote>
      <p>
        三個元素：（1）肯定現職給的（2）具體解釋為什麼不夠（3）主動而非被動的姿態。
      </p>

      <h2>另外幾個隱性 red flag（次要但累積會扣分）</h2>
      <ol>
        <li>
          <strong>對 HR 跟對主管態度落差太大</strong>：HR 會在 debrief 提到「他對我蠻冷的，但對主管很 polite」——這是 calibration 死刑
        </li>
        <li>
          <strong>不認識自己的 CV</strong>：面試官問你 3 年前一個專案的細節，你愣住——「他自己寫的他不熟」是極大警訊
        </li>
        <li>
          <strong>過度引用「我前主管說 / 我前公司做」</strong>：顯示你沒有獨立判斷
        </li>
        <li>
          <strong>問薪資問得太早</strong>：第一輪就問「薪資範圍多少」是 debrief 提到的扣分點
        </li>
        <li>
          <strong>遲到不誠懇道歉</strong>：5 分鐘遲到 + 「不好意思，我塞車」是常見的 debrief 抱怨
        </li>
      </ol>

      <h2>面試官的小提醒</h2>
      <p>
        最殘忍的真相：<strong>大部分被 reject 的候選人，永遠不會知道真正的原因</strong>。
      </p>
      <p>
        HR 給的拒絕理由是模板。debrief 裡的真實原因不會被傳達——因為公司怕被告、怕被攻擊、怕引發辯論。
      </p>
      <p>
        所以你<strong>沒辦法靠「收到 feedback」改進</strong>。你只能靠提前知道這些隱性扣分，主動避開。
      </p>

      <h2>下一步</h2>
      <p>
        面試前一晚做兩件事：（1）準備 5 個 specific 的「為什麼這家公司、這個職位」問題（2）把「為什麼想離開」的答案寫下來，確認三個元素都有。如果想練「在 debrief 不會被吐槽」的回答，用 Offery 的 AI 面試模擬，AI 會 specifically 標記隱性扣分點。
      </p>
    </>
  );
}

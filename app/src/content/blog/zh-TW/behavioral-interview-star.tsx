import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "behavioral-interview-star",
  title: "行為面試題不是聊天：用 STAR 結構回答的三個範例",
  description:
    "「請舉一個你解決衝突的例子」這類題目，答得好是面試加分題、答不好就是減分題。STAR 框架幫你把答案說得結構清楚又有力。",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-08",
  updatedAt: "2026-04-08",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "interview",
  ctaText: "用 AI 模擬一場行為面試，先練手感",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        行為面試題（Behavioral Interview）的核心邏輯是：
        <strong>過去的行為是預測未來行為最好的指標</strong>。
        所以面試官會問「請舉一個例子」，想看你具體做過什麼，而不是你「覺得自己是什麼樣的人」。
      </p>
      <p>
        最常見的回答陷阱是答得太抽象——「我覺得溝通蠻重要的⋯⋯」這種回答幾乎得不到分數。STAR 框架可以幫你結構化整段回答。
      </p>

      <h2>什麼是 STAR？</h2>
      <ul>
        <li>
          <strong>S</strong>ituation 情境：當時的背景、團隊、時間點
        </li>
        <li>
          <strong>T</strong>ask 任務：你被要求做什麼、目標是什麼
        </li>
        <li>
          <strong>A</strong>ction 行動：你具體做了哪些事
        </li>
        <li>
          <strong>R</strong>esult 結果：發生了什麼、學到什麼，最好有數字
        </li>
      </ul>
      <p>
        分配時間大約是 S 10%、T 10%、A 60%、R 20%——重點永遠是你做了什麼。
      </p>

      <h2>範例一：「請舉一個你解決衝突的例子」</h2>
      <p>
        <strong>S</strong>：「上一份工作我是 PM，跨部門合作時，工程師主管堅持某個功能要延後一個版本，但業務團隊已經對客戶承諾這個 sprint 上線。」
      </p>
      <p>
        <strong>T</strong>：「我需要在不破壞兩邊關係的前提下，找出可行的解法。」
      </p>
      <p>
        <strong>A</strong>：「我先個別約兩位主管聊，理解工程的真正阻礙是測試人力，業務在意的其實是『客戶承諾不能跳票』。我提出折衷方案：原 sprint 上線一個 MVP 版本，下個 sprint 補完整功能；同時我跟業務一起發訊息給客戶，說明分階段交付的好處。」
      </p>
      <p>
        <strong>R</strong>：「最後 MVP 如期上線，客戶回饋反而比預期好，因為他們提早拿到雛型可以給內部回饋。下個 sprint 完整版上線後，這位客戶續約並擴大採用。」
      </p>

      <h2>範例二：「請舉一個你失敗的例子」</h2>
      <p>
        這題重點不是失敗本身，而是你怎麼面對與學習。誠實 + 有反思 = 加分。
      </p>
      <p>
        <strong>S</strong>：「實習時負責規劃一場 200 人的線下活動。」
        <strong>T</strong>：「需要在三週內把流程、講師、場地都搞定。」
        <strong>A</strong>：「我把所有事情都自己扛，沒有把工作切分給其他組員，結果報名表、講師簡報、場控都同時卡住。」
        <strong>R</strong>：「活動勉強辦完但體驗不佳。事後我學到：再小的專案也要有清楚的角色分工，獨自硬扛只是把『我很努力』放在『把事做好』前面。下一次活動我先畫了 RACI 表，整體執行順很多。」
      </p>

      <h2>範例三：「請舉一個你帶人的例子」</h2>
      <p>
        即使你還沒當過主管，也可以從 mentor、跨部門、社團領導講起。
      </p>
      <p>
        <strong>S</strong>：「我帶一位 Junior 設計師做新功能。」
        <strong>T</strong>：「目標是讓他在三個月內能獨立負責中型專案。」
        <strong>A</strong>：「第一個月我每天 review 他的稿，當週給回饋；第二個月改成兩週一次 1:1，把回饋從『改這裡』升級為『你覺得這個方向哪裡可以更強？』；第三個月我退到顧問角色。」
        <strong>R</strong>：「他在第三個月獨立交付了一個功能，主管回饋成熟度跳了一級。我自己也學到，帶人不是給答案，是把問題還給他。」
      </p>

      <h2>面試前怎麼練？</h2>
      <ol>
        <li>列出 5 至 8 個你過去最有故事的事件（成功、失敗、衝突、領導、創新）</li>
        <li>每件事用 STAR 寫成一份小卡，控制在 90 秒內講完</li>
        <li>對著手機錄音聽聽看，重點是有沒有「行動」與「結果」</li>
      </ol>
      <p>
        想直接練實戰？用 Offery 的 AI 面試模擬器跑一場行為題，AI 會即時給你結構與內容的回饋。
      </p>
    </>
  );
}

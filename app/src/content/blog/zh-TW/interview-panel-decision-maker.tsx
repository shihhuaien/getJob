import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-panel-decision-maker",
  title: "面試 panel 中誰最有否決權？認錯人就完蛋",
  description:
    "面試官視角：5 位面試官不是平等投票，每個人的「票」權重不同。揭露 panel 中真正的決策者，與如何識別誰要重點討好。",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "interview",
  ctaText: "AI 模擬不同面試官角色的提問風格",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        多輪面試的真相：<strong>5 位面試官的票權重不一樣</strong>。
      </p>
      <p>
        候選人常以為「每場都重要」「對每個人都要好」。理論上對，實務上錯——時間有限，你應該知道<strong>哪一場最重要、哪一個人能單獨否決你</strong>。
      </p>

      <h2>典型的 panel 結構與權重</h2>
      <p>
        以下是台灣中大型公司 5 輪面試的常見配置：
      </p>

      <h3>1. HR / Recruiter（權重 10–15%）</h3>
      <p>
        角色：流程把關、薪資與動機核對、文化基本符合
      </p>
      <p>
        否決權：<strong>幾乎沒有</strong>，但能把你 reject 在「flag」階段
      </p>
      <p>
        識別方式：通常是第一場、30 分鐘、不問技術細節
      </p>
      <p>
        重點：<strong>不要被 reject 但也不要把這場當主戰</strong>。誠懇、清楚回答、流程上 polite 即可。
      </p>

      <h3>2. 同儕（Peer Interviewer）（權重 15–20%）</h3>
      <p>
        角色：判斷你能不能融入團隊、技術能力 baseline、相處感受
      </p>
      <p>
        否決權：<strong>單獨無否決權，但兩位以上反對會極大影響</strong>
      </p>
      <p>
        識別方式：跟你年資相近、聊起來最像「平輩」、會問你過去合作的細節
      </p>
      <p>
        重點：講話用「我們」、不要居高臨下、表現出你是好合作的人。<strong>同儕在 debrief 會被認真聽</strong>，因為他們之後要跟你天天工作。
      </p>

      <h3>3. 直屬主管（Hiring Manager）（權重 30–40%）</h3>
      <p>
        角色：核心決策者，他要為你的表現背書
      </p>
      <p>
        否決權：<strong>有完整否決權</strong>。他不要你，幾乎沒人會 push back
      </p>
      <p>
        識別方式：通常是 Round 2 或 3、會問策略性問題、在乎你怎麼想（不只是怎麼做）
      </p>
      <p>
        重點：<strong>他是最重要的一場</strong>。把你最強的故事、最能力 demonstrate 的回答留給他。也準備 2 至 3 個對「他這個團隊」的具體觀察與問題。
      </p>

      <h3>4. Skip-level / Director（權重 20–30%）</h3>
      <p>
        角色：策略眼、品牌維護、避免主管做出「短視」決定
      </p>
      <p>
        否決權：<strong>有否決權，且常常是 last-minute 翻盤的人</strong>。即使前面都 yes，他 no 就 no
      </p>
      <p>
        識別方式：通常是最後一場、職位 2 級以上、問題會偏「你怎麼看這個產業」「3 年後的 vision」
      </p>
      <p>
        重點：<strong>展現策略思考、產業 sense、長期 commitment</strong>。不是要你會什麼技能，是你的「方向」對不對。
      </p>

      <h3>5. Bar Raiser / Cross-team interviewer（權重 10–15%）</h3>
      <p>
        角色：跨團隊客觀評估、防止 hiring manager 太想要某人而忽略 red flag
      </p>
      <p>
        否決權：<strong>單獨能 raise flag，影響極大</strong>
      </p>
      <p>
        識別方式：跟你應徵的團隊無關、問題比較深 / 比較刁鑽、可能來自比較資深的部門
      </p>
      <p>
        重點：<strong>這場是「驗證」</strong>。把你前面講過的故事再講一次要一致——他會跟其他面試官 cross-check 你的說法。
      </p>

      <h2>怎麼判斷你正在哪一場？</h2>
      <p>
        三個問題能幫你 5 分鐘內判斷：
      </p>

      <h3>1. 對方介紹自己時的職稱</h3>
      <ul>
        <li>「我是 [team name] 的 manager / lead」→ 直屬主管</li>
        <li>「我是 [department] 的 director / VP」→ skip-level</li>
        <li>「我跟你會一起在 [team] 工作」→ peer</li>
        <li>「我來自 [其他部門]，幫忙面試」→ cross-team / bar raiser</li>
      </ul>

      <h3>2. 問題的深度與抽象度</h3>
      <ul>
        <li>細節執行題（「你怎麼處理 X bug」）→ peer 或 hiring manager</li>
        <li>策略題（「你怎麼看 [產業 trend]」）→ skip-level</li>
        <li>挑戰你前面說法的題（「你剛才說 X，但 Y 怎麼解釋？」）→ bar raiser</li>
      </ul>

      <h3>3. 你問問題時對方的權限</h3>
      <p>
        你問：「這個職位的 promotion path 怎樣？」誰能精準回答你？
      </p>
      <ul>
        <li>「我也不確定要問 HR」→ peer</li>
        <li>「我們團隊一般 2 年內可以升 senior」→ hiring manager</li>
        <li>「我們整個 org 有 30 個 senior 名額，每年大概 release 5 個」→ skip-level</li>
      </ul>

      <h2>三個常見的權重錯判</h2>

      <h3>1. 太認真對待 HR，太放鬆對待 director</h3>
      <p>
        HR 跟你聊得最久最暖、director 只 30 分鐘有點冷——你以為 HR 比較重要。錯。<strong>director 的 30 分鐘權重是 HR 的 2 倍</strong>。
      </p>

      <h3>2. 把 peer 當成「不重要的同事」</h3>
      <p>
        Peer 的態度通常輕鬆，你以為閒聊。但 peer 在 debrief 會被認真聽——<strong>「跟他工作會不會痛苦」是 peer 才能回答的</strong>。
      </p>

      <h3>3. 忽略 bar raiser 的「重複問題」</h3>
      <p>
        Bar raiser 重複問你前面被問過的題，不是隨便——他在 cross-check。<strong>答案要一致，但可以多一點細節</strong>，展現你前面講的是真的。
      </p>

      <h2>面試官的小提醒</h2>
      <p>
        如果你只能準備一場，<strong>那就準備直屬主管那場</strong>——他的 yes 是 offer 的必要條件。
      </p>
      <p>
        如果你能準備兩場，加上 skip-level——他的 no 能單獨終結你。
      </p>
      <p>
        其他人重要，但「重要」的等級不一樣。資源分配要對。
      </p>

      <h2>下一步</h2>
      <p>
        下次拿到面試行程時，先用對方職稱與面試結構判斷每場的權重。把 80% 準備時間花在主管 + skip-level 兩場上。需要練不同角色提問風格，可以用 Offery 的 AI 面試器切換 persona 模擬。
      </p>
    </>
  );
}

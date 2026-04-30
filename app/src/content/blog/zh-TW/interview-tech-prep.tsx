import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-tech-prep",
  title: "技術面試的兩週準備節奏：從基礎到 Mock",
  description:
    "兩週時間夠不夠準備技術面試？夠，前提是你有節奏。這份每日清單把基礎複習、刷題、模擬切成可執行的步驟。",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-23",
  updatedAt: "2026-04-23",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "interview",
  ctaText: "用 AI 跑一場技術面試 Mock，先抓出弱點",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        拿到技術面試通知後最常見的反應：「我得從頭刷 LeetCode 了。」然後三天後放棄，剩 11 天焦慮。問題不是時間不夠，是<strong>節奏不對</strong>。
      </p>
      <p>
        兩週其實夠用。重點是把時間切成兩個明確階段：第一週修地基，第二週模擬實戰。
      </p>

      <h2>第一週：補地基（每天 2 小時）</h2>

      <h3>Day 1–2：複習你最弱的資料結構</h3>
      <p>
        誠實面對：哪一個資料結構你看到題目就頭痛？通常是樹、圖、Heap 之一。挑你最弱的那個，看 30 分鐘的觀念影片，做 3 題從 easy 到 medium 的題。
      </p>
      <p>
        這兩天不求多，求把那個盲點補起來。
      </p>

      <h3>Day 3–4：常見演算法 pattern 各刷 2 題</h3>
      <p>
        台灣面試常考的 6 個 pattern：
      </p>
      <ul>
        <li>Two Pointers（陣列、字串）</li>
        <li>Sliding Window</li>
        <li>BFS / DFS（樹、圖）</li>
        <li>Hash Map（去重、快查）</li>
        <li>Dynamic Programming（最優解、計數）</li>
        <li>Binary Search（排序陣列、值域）</li>
      </ul>
      <p>
        每天挑 3 個 pattern，每個刷 1 至 2 題 medium。重點不是寫出 optimal 解，是<strong>能說出為什麼用這個 pattern</strong>。
      </p>

      <h3>Day 5：系統設計或專案深挖（依職等）</h3>
      <p>
        Junior：把履歷上的兩個 side project 重新整理，每個準備一段 5 分鐘的深度敘述（架構、技術選型、踩過的坑）。
      </p>
      <p>
        Senior：挑 1 個經典系統設計題（縮網址、聊天室、Twitter feed）練習白板敘述，重點是 trade-off 而非畫圖完整。
      </p>

      <h3>Day 6：複習 + 整理</h3>
      <p>
        把這週做過的題目快速複習一輪，整理成「自己的筆記」——每題一句話寫出 pattern + 關鍵 insight。這份筆記是你面試前晚的速看本。
      </p>

      <h3>Day 7：休息</h3>
      <p>
        刷題會疲勞、疲勞會降低判斷力。第七天完全離開電腦，運動、睡飽。
      </p>

      <h2>第二週：實戰節奏（每天 2.5 小時）</h2>

      <h3>Day 8–10：刷接近真實題型的題</h3>
      <p>
        如果有目標公司的面試題分享（PTT Tech_Job、CakeResume 面試心得），鎖定那個範圍刷。每天 2 題、每題 45 分鐘。
      </p>
      <p>
        關鍵：<strong>用紙筆或 Google Doc 寫，不要用 IDE 的自動補完</strong>。實際面試環境通常沒有提示。
      </p>

      <h3>Day 11–12：Mock interview</h3>
      <p>
        找朋友、line 群組、或用 AI 模擬器跑 2 至 3 場 mock。每場結束後問自己三個問題：
      </p>
      <ol>
        <li>我有沒有先 clarify 問題就開始寫？</li>
        <li>我有沒有講出我的思路（thinking out loud），而不是只有答案？</li>
        <li>我寫完有沒有自己 trace 一次邊界 case？</li>
      </ol>

      <h3>Day 13：心態 + 行為題</h3>
      <p>
        技術面試也會穿插行為題（為什麼想來、最近一個專案遇到的挑戰）。準備 5 個 STAR 故事，控制在 90 秒內講完。
      </p>

      <h3>Day 14：早睡，準備明天</h3>
      <p>
        前一晚不要再刷新題目，那只會讓你焦慮。複習你的筆記、確認交通與裝備、早點睡。
      </p>

      <h2>三個會毀掉節奏的雷</h2>
      <ol>
        <li>
          <strong>每天刷 8 題</strong>：質比量重要。10 題深刷 vs 50 題淺刷，前者面試表現好得多。
        </li>
        <li>
          <strong>跳過 mock</strong>：自己寫 vs 在人面前寫，是兩個世界。一定要練。
        </li>
        <li>
          <strong>只刷 hard 題顯擺</strong>：面試 medium 答得乾淨俐落，比 hard 答得拖泥帶水更印象深刻。
        </li>
      </ol>

      <h2>下一步</h2>
      <p>
        今天就把這 14 天的時間表寫進你的行事曆。第一場 mock 可以用 Offery 的 AI 面試模擬，AI 會即時給你思路與表達的回饋——比硬等朋友有空快很多。
      </p>
    </>
  );
}

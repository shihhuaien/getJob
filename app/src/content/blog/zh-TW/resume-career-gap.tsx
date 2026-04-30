import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-career-gap",
  title: "工作空窗期怎麼在履歷上交代？三種誠實又有力的寫法",
  description:
    "離職休息、進修、照顧家人、創業失敗⋯⋯每個人都可能有空窗。比起遮掩，誠實標注並補上敘事，反而更能贏得信任。",
  category: "resume",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-20",
  updatedAt: "2026-04-20",
  readingMinutes: 4,
  author: "Offery 編輯團隊",
  ctaTool: "resume-optimizer",
  ctaText: "用 AI 履歷優化器，幫空窗期段落加上敘事",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        履歷上的空窗期不會自動扣分，<strong>沒交代清楚才會</strong>。HR 看到「2024–2025」之間沒事情，腦中會自動填入最壞的猜想。你的工作是把那段時間的「空白」改寫成「主動」。
      </p>

      <h2>三個常見的空窗原因 + 對應寫法</h2>

      <h3>1. 主動離職、休息調整</h3>
      <p>
        最常見的情境，反而最常被寫得心虛。其實一句話帶過就好，重點放在你怎麼利用這段時間。
      </p>
      <blockquote>
        Career Break｜2024.06 – 2024.12
        <br />
        在第一份工作三年密集投入後，主動安排半年休息，期間完成 [Coursera UX Design 證書 / 自學 Python 資料分析 / 50 hr 志工服務於 X 機構]，並重新確認下一段職涯方向。
      </blockquote>
      <p>
        關鍵：用 <strong>「Career Break」</strong> 標題正名，而不是空著日期。讓 HR 看到「你知道有空窗，且有掌握」。
      </p>

      <h3>2. 進修、轉職準備</h3>
      <p>
        如果空窗是去念書、跨領域學習，就直接放進「教育」或「自學」段落。
      </p>
      <blockquote>
        進修｜2024.09 – 2025.06
        <br />
        ALPHA Camp 全端工程師班（500 小時），完成 3 個 side project，其中 [專案名] 被 [社群 / 媒體] 報導。
      </blockquote>
      <p>
        即使是線上課程也算數，重點是<strong>有產出</strong>（作品、證書、發表），不是上完課就算。
      </p>

      <h3>3. 家庭因素（育兒、照顧家人）</h3>
      <p>
        在台灣這個情境最常被遮掩，其實大方寫反而是優勢——展現你能在高壓下做選擇。
      </p>
      <blockquote>
        Family Care Leave｜2024.03 – 2025.03
        <br />
        全職照顧家中長者一年，期間維持與 [前產業 / 工具] 的接觸：完成 X 課程、參與 Y 線上社群、保持 Z 副業。
      </blockquote>
      <p>
        如果這段時間完全沒接觸產業也沒關係，寫得真誠 + 補一句「現已準備好全職回到 [職能]」即可。
      </p>

      <h2>三個常見的雷</h2>
      <ol>
        <li>
          <strong>把日期模糊化試圖蓋掉</strong>：寫「2023 – 2025 自由工作者」但拿不出具體案件，HR 一問就破功，反而比誠實寫空窗更扣分。
        </li>
        <li>
          <strong>用「思考下一步」帶過</strong>：聽起來像迷惘，加一句具體做了什麼會強很多（讀什麼書、上什麼課、做什麼專案）。
        </li>
        <li>
          <strong>絕口不提就跳過</strong>：HR 一定會看出時間缺口，你不主動講，反而讓他想像。
        </li>
      </ol>

      <h2>面試時被問怎麼回？</h2>
      <p>
        準備一段 60 秒版本：
      </p>
      <ol>
        <li>誠實說明原因（一句話）</li>
        <li>說明那段時間做了什麼讓自己沒退化（一到兩句）</li>
        <li>銜接到「為什麼現在準備好回來，特別想加入 [這家公司]」（一到兩句）</li>
      </ol>

      <h2>下一步</h2>
      <p>
        打開你的履歷，把任何超過 3 個月的時間缺口都補上一段敘事。空窗期本身不會擋你，模糊與閃躲才會。需要協助潤飾，可以把履歷丟進 Offery 的優化器讓 AI 給建議。
      </p>
    </>
  );
}

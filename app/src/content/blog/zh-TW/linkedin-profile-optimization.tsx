import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "linkedin-profile-optimization",
  title: "LinkedIn 個人檔案的三層結構：從被搜尋到被點開",
  description:
    "LinkedIn 在台灣愈來愈重要。HR 找你的順序是：搜尋 → 點頭像 → 點 About → 看經歷。每一層都有不同的優化重點。",
  category: "job-search",
  personaTags: ["no-job", "evergreen"],
  publishedAt: "2026-04-19",
  updatedAt: "2026-04-19",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "jobs",
  ctaText: "把感興趣的職缺存進追蹤板，搭配 LinkedIn 使用",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        過去三年，台灣的 HR 與 recruiter 主動在 LinkedIn 找人的比例大幅提升。一個優化過的檔案會被搜尋到、被點開、被聯絡。沒優化的檔案在演算法裡幾乎不存在。
      </p>
      <p>
        把 LinkedIn 想成三層結構，每一層都有不同的目標：
      </p>

      <h2>第一層：被搜尋到（Headline + Skills）</h2>
      <p>
        Recruiter 用 LinkedIn 內建搜尋找人，最常輸入的就是<strong>職稱關鍵字</strong>。Headline 跟 Skills 區是最重要的搜尋訊號。
      </p>

      <h3>Headline 怎麼寫</h3>
      <p>
        最弱：「Software Engineer at XX Company」（系統預設）
      </p>
      <p>
        強：「Senior Frontend Engineer｜React・TypeScript・Performance」
      </p>
      <p>
        關鍵：把 2 至 3 個核心技術 / 領域關鍵字塞進 Headline。Recruiter 搜尋時這些字會被加重比對。
      </p>

      <h3>Skills 區精選 10 個</h3>
      <p>
        不要一口氣放 50 個技能（看起來像新手）。挑 10 個你最想被找到的關鍵字，固定在頂部。每三個月檢視一次，跟著市場與你的方向更新。
      </p>

      <h2>第二層：被點開（頭像 + Banner + About 第一行）</h2>
      <p>
        被搜尋到後，Recruiter 看到的是搜尋結果列表——只有頭像、Headline 跟 About 前一行。這幾秒決定他要不要點開你的檔案。
      </p>

      <h3>頭像</h3>
      <ul>
        <li>用近 1 至 2 年的照片</li>
        <li>臉部要佔頭像 60% 以上（遠到看不清臉是最常見的錯）</li>
        <li>背景單純，光線清楚，看起來專業但有人味</li>
      </ul>

      <h3>Banner</h3>
      <p>
        這個被低估了。一張有顏色的 banner 比預設灰底，會讓你的頭貼在搜尋結果裡跳出來。可以放：你的座右銘、產業相關照片、會議演講照——只要不要放鬆軟的風景照。
      </p>

      <h3>About 第一行</h3>
      <p>
        About 在搜尋結果只會顯示前 1 至 2 行。把最有力的成就或定位句放在第一行，引誘對方點開看完整版。
      </p>
      <p>
        弱：「Hi, I'm a passionate developer who loves coding...」
      </p>
      <p>
        強：「Frontend engineer with 5 years building B2B SaaS for 100K+ users. Currently exploring opportunities in growth-stage startups.」
      </p>

      <h2>第三層：被聯絡（Experience + Featured）</h2>
      <p>
        Recruiter 點開檔案後，會掃 Experience 段確認你「真的會做」。這層的目標：把履歷上最有力的成就用 LinkedIn 的格式重寫一次。
      </p>

      <h3>Experience 怎麼寫</h3>
      <ul>
        <li>每段工作 2 至 4 條 bullet，跟履歷上的 quantified achievements 一致</li>
        <li>避免直接複製貼上履歷——LinkedIn 上稍微口語、加 emoji 一個是 OK 的</li>
        <li>每段加上「Skills」標籤，這會回頭強化第一層的搜尋</li>
      </ul>

      <h3>Featured 區放 3 個東西</h3>
      <p>
        這個區域很多人空著，太可惜。可以放：
      </p>
      <ul>
        <li>你寫過最好的一篇文章 / 部落格</li>
        <li>你的 Side project / GitHub repo</li>
        <li>你被報導過的連結 / 演講影片</li>
      </ul>
      <p>
        哪怕只放一個，都比空著有說服力。
      </p>

      <h2>三個常見的雷</h2>
      <ol>
        <li>
          <strong>把 Headline 寫成個人哲學</strong>：「Always learning, always growing」聽起來深刻，但搜尋不到任何關鍵字。
        </li>
        <li>
          <strong>About 寫成自傳</strong>：超過 3 段就沒人看完。控制在 4 至 6 句以內。
        </li>
        <li>
          <strong>不放開放工作中的訊號</strong>：「Open to work」徽章可以開成「only recruiters can see」，不會被現任公司知道，但 recruiter 會主動找你。
        </li>
      </ol>

      <h2>下一步</h2>
      <p>
        花 30 分鐘把 Headline、About 第一行、Skills 三個地方先優化。一週後檢查 LinkedIn 給你的「搜尋出現次數」（Profile views 旁邊），通常會看到明顯成長。然後把感興趣的職缺記到 Offery 的追蹤板，整合主動投遞與被動 recruiter 接觸的兩條管道。
      </p>
    </>
  );
}

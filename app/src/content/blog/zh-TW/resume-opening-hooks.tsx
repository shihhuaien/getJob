import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-opening-hooks",
  title: "三個讓履歷被看完的開頭",
  description:
    "履歷前 6 秒決定 HR 要不要繼續看下去。這三個開頭結構能立刻抓住注意力，不靠華麗詞藻。",
  category: "resume",
  personaTags: ["no-resume", "applied-without-interview", "evergreen"],
  publishedAt: "2026-04-15",
  updatedAt: "2026-04-15",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "resume-optimizer",
  ctaText: "用 AI 履歷優化器，立刻檢查你的開頭",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        根據 LinkedIn 對 HR 的調查，履歷被閱讀的平均時間是
        <strong>6 到 8 秒</strong>。這代表你的履歷開頭——也就是名字下方那兩三行——幾乎決定了後面內容會不會被看見。
      </p>
      <p>
        很多人把開頭寫成「主動積極、有責任感、團隊合作⋯⋯」這類自我描述，但這些字 HR 一天會看到三百次，等於什麼都沒講。下面三個結構能讓你的開頭直接踩在 HR 的眼睛上。
      </p>

      <h2>結構一：用一個量化成就直接破題</h2>
      <p>
        把你最值得驕傲、且能用數字描述的成就放在第一行。數字會自動讓眼睛停下來。
      </p>
      <ul>
        <li>
          ❌「具備三年行銷經驗，熟悉社群操作。」
        </li>
        <li>
          ✅「過去三年將 IG 互動率從 1.2% 拉到 5.4%，帶動單一檔期業績成長 38%。」
        </li>
      </ul>
      <p>
        即使是新鮮人也能寫：把專題、實習、社團裡你做過的最具體成果挖出來，永遠比形容詞有力。
      </p>

      <h2>結構二：對齊職缺的關鍵詞 + 你的證據</h2>
      <p>
        看完職缺描述（JD），找出最關鍵的 2 至 3 個詞，把它們直接放進開頭，並在後面接你符合的證據。這同時取悅 HR 與 ATS 系統。
      </p>
      <p>
        例如職缺寫「需要 B2B SaaS 銷售經驗、熟悉 HubSpot、有英文簡報能力」，你的開頭可以是：
      </p>
      <blockquote>
        「五年 B2B SaaS 銷售背景，熟悉 HubSpot Pipeline 管理，曾以英文向北美客戶完成超過 30 場 demo，年度配額達成率 112%。」
      </blockquote>

      <h2>結構三：動詞開頭，不要「我是⋯⋯」</h2>
      <p>
        中文履歷常見的「我是一位⋯⋯」是最弱的開法。改成動詞開頭，每一句都在敘述「你做了什麼」，氣勢完全不同。
      </p>
      <ul>
        <li>主導、推動、優化、節省、設計、整合</li>
        <li>每個動詞後面接「做了什麼 + 結果是什麼」</li>
      </ul>

      <h2>常見三個雷</h2>
      <ol>
        <li>
          <strong>過度謙虛</strong>：用「協助」、「參與」描述自己主導的事，會讓貢獻被低估。
        </li>
        <li>
          <strong>抽象形容詞</strong>：「具備細心、責任感」這類自我評價，HR 沒辦法驗證，等於浪費版面。
        </li>
        <li>
          <strong>跟 JD 無關</strong>：再亮眼的成就，跟這次職缺對不上的，先放後面或拿掉。
        </li>
      </ol>

      <h2>今天就動手</h2>
      <p>
        挑一份你最近想投的職缺，把上面三個結構各寫一遍開頭，挑最有力的那個用上去。如果你想要更快得到回饋，把履歷與 JD 一起丟進 Offery 的 AI 履歷優化器，會直接告訴你哪裡可以再強化。
      </p>
    </>
  );
}

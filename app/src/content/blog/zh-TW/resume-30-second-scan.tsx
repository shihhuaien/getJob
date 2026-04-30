import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-30-second-scan",
  title: "面試官的 30 秒篩履歷流程：我們真正看的三個地方",
  description:
    "面試官視角：我桌上一週 50 份履歷，每份只有 30 秒。揭露真實的篩履歷動線——你以為被讀的部分多半沒有，沒被讀的反而是關鍵。",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "resume-optimizer",
  ctaText: "用 AI 優化器，把履歷的 30 秒戰場優化到位",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        我擔任面試官的這幾年，篩過超過 2,000 份履歷。實話告訴你：<strong>沒有一份是被「讀完」的</strong>。
      </p>
      <p>
        週一早上桌上 50 份履歷，下午要 ship 一輪 yes/no。我每份大概花 30 秒，分成三段掃描——掃完就決定。
      </p>
      <p>
        知道我們怎麼看，你才知道履歷該優化哪裡。下面是真實的動線：
      </p>

      <h2>第 1–10 秒：三個位置的眼神跳動</h2>
      <p>
        第一輪掃描我只看三個地方，順序固定：
      </p>
      <ol>
        <li>
          <strong>最上面的 title 與一行定位句</strong>（不是名字——我不在乎你叫什麼）
        </li>
        <li>
          <strong>最近一份工作的公司名 + 職稱</strong>
        </li>
        <li>
          <strong>第二份工作的公司名 + 職稱</strong>
        </li>
      </ol>
      <p>
        三個位置同時看下來，10 秒內我已經有第一個判斷：「這個人大概是什麼類型」。如果這三個位置不對齊我們找的人，履歷直接進「No」堆。
      </p>
      <p>
        <strong>啟示</strong>：你前兩份工作的職稱，比你第五份做了什麼重要 100 倍。如果職稱與目標 JD 對不上，前面寫一行<strong>定位句</strong>把對應講明白。
      </p>

      <h2>第 11–20 秒：跳到「最近的 bullets」</h2>
      <p>
        第一輪過關後，我會跳到最近一份工作的 bullet——但<strong>只看前兩條</strong>。
      </p>
      <p>
        我在找：
      </p>
      <ul>
        <li>有沒有數字（沒有的話這個人可能只在執行不在思考）</li>
        <li>動詞夠不夠強（「協助、參與」是弱訊號）</li>
        <li>規模有沒有露出（5 人團隊 vs 50 人團隊是兩個世界）</li>
      </ul>
      <p>
        前兩條 bullet 沒這三個元素的話，後面 8 條我不會看。我會結論「這個人寫履歷沒下功夫」，這多半也意味做事沒下功夫。
      </p>
      <p>
        <strong>啟示</strong>：每段工作的 bullet 順序非常重要。<strong>最強的兩條一定要排前面</strong>，不要按時間或重要性的「自然順序」放。
      </p>

      <h2>第 21–30 秒：最後一眼掃下去找 red flag</h2>
      <p>
        前 20 秒過關後，我會把整份履歷拉到底，掃 5 件事：
      </p>
      <ol>
        <li>
          <strong>每段時間長度</strong>：是不是每段都不到 1 年？是不是有不解釋的 6 個月以上空窗？
        </li>
        <li>
          <strong>排版有沒有災難</strong>：字體跳來跳去、對齊跑掉、有錯字？
        </li>
        <li>
          <strong>長度</strong>：1 頁、2 頁我都接受；3 頁以上我先扣分（顯示沒有編輯能力）
        </li>
        <li>
          <strong>沒意義的章節</strong>：「自我介紹：我是一個熱愛挑戰的人⋯⋯」這種佔版面的東西
        </li>
        <li>
          <strong>無關證書</strong>：申請 PM 列了多益 700 分、TOEIC、初級韓文——顯示判斷力差
        </li>
      </ol>
      <p>
        任何一個 red flag 都不會單獨 reject 你，但<strong>累積 2 至 3 個就會</strong>。
      </p>

      <h2>你以為很重要、實際上沒人看的部分</h2>
      <ol>
        <li>
          <strong>頭像</strong>：我幾乎不看。有時連有沒有頭像都沒注意到。
        </li>
        <li>
          <strong>興趣 / 自我介紹段</strong>：30 秒掃描中跳過。除非面試時 break ice 才可能掃一眼。
        </li>
        <li>
          <strong>5 年前的工作</strong>：除非職稱很特別。否則一律快速跳過。
        </li>
        <li>
          <strong>學歷</strong>：除了校名和系所，GPA、社團、論文標題我不看（除非你是新鮮人）。
        </li>
        <li>
          <strong>技能列表</strong>：那一欄寫的東西我不信，我相信你 bullet 裡敘述能展現的技能。
        </li>
      </ol>

      <h2>你不知道的：第 31 秒之後發生什麼</h2>
      <p>
        如果你的履歷過了 30 秒篩選，會被放進「Maybe」或「Yes」堆。
      </p>
      <ul>
        <li>
          <strong>Yes 堆</strong>：直接安排面試
        </li>
        <li>
          <strong>Maybe 堆</strong>：等 yes 堆面試完不夠人，才回來看 maybe。<strong>如果 yes 堆夠用，你的履歷就被擱置了</strong>。
        </li>
      </ul>
      <p>
        這是為什麼<strong>「投了沒有回應 ≠ 你不夠好」</strong>。可能你進了 Maybe 堆，但 Yes 堆夠用了。
      </p>

      <h2>三個立刻可改的優化</h2>
      <ol>
        <li>
          <strong>履歷最頂端加一行定位句</strong>：不是 summary 段，是一句話——「Senior Frontend Engineer with 5 years in B2B SaaS, focused on performance」。讓我 5 秒內知道你是誰。
        </li>
        <li>
          <strong>每段工作前兩條 bullet 各包含一個數字</strong>：沒有就重新挖（參考<a href="/blog/resume-quantify-impact">量化成就</a>那篇）。
        </li>
        <li>
          <strong>把興趣段、自我介紹段、無關證書全刪掉</strong>：版面留給有用的東西。
        </li>
      </ol>

      <h2>面試官的小提醒</h2>
      <p>
        我面試時偶爾會說：「你的履歷我沒看完。」這不是侮辱，是<strong>真的沒看完</strong>。
      </p>
      <p>
        所以：你最重要的訊息，要放在<strong>前 30 秒掃得到的位置</strong>。把你的人生濃縮到那個區域，剩下的當補充。
      </p>

      <h2>下一步</h2>
      <p>
        把你的履歷打開，自己 30 秒掃一遍。看完之後問：「我會錄取這個人嗎？」如果不會，你就知道優化的方向。需要 AI 從面試官視角給回饋，丟進 Offery 的履歷優化器。
      </p>
    </>
  );
}

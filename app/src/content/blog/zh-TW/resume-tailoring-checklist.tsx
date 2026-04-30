import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-tailoring-checklist",
  title: "投每份職缺前的 5 分鐘客製履歷檢查清單",
  description:
    "客製履歷不是重寫，是 5 分鐘的精準調整。這個檢查清單幫你在不浪費時間下，提高每份履歷的命中率。",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-18",
  updatedAt: "2026-04-18",
  readingMinutes: 4,
  author: "Offery 編輯團隊",
  ctaTool: "resume-optimizer",
  ctaText: "用 AI 比對 JD，5 秒拿到客製建議",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        通用履歷投 100 份，不如客製履歷投 30 份。但客製不等於每次都重寫——那會讓你三天投不了一份。真正高效的客製是<strong>5 分鐘的精準微調</strong>，鎖定五個高槓桿位置。
      </p>
      <p>
        投出去前，跑一次這個清單：
      </p>

      <h2>1. 開頭兩行有沒有放進 JD 的關鍵字？</h2>
      <p>
        履歷開頭（summary 或第一段）是 HR 6 秒內必看的位置。打開 JD，找出最重要的 2 至 3 個詞，確保它們出現在你開頭的句子裡。
      </p>
      <ul>
        <li>JD 寫「B2B SaaS 銷售」→ 開頭就要出現「B2B SaaS」</li>
        <li>JD 強調「Cross-functional collaboration」→ 開頭講清楚你怎麼跨部門</li>
      </ul>

      <h2>2. 最重要的成就有沒有排在最上面？</h2>
      <p>
        每段工作經歷的 bullets 順序，要依「跟這份 JD 的相關度」重新排。最相關的放前兩條，最不相關的可以拿掉或移到後面。
      </p>
      <p>
        同一份履歷，投產品經理職可能把「跨部門溝通」排第一；投技術 PM 職則把「技術深度」排第一。
      </p>

      <h2>3. 履歷裡的職稱用詞跟 JD 對齊了嗎？</h2>
      <p>
        如果 JD 寫「Product Manager」，你的履歷不要寫「產品企劃」「產品專案經理」。即使內部職稱真的不一樣，也可以括號標注：「產品專案經理（Product Manager）」。
      </p>
      <p>
        ATS 與 HR 都會用 JD 字面去搜尋，職稱不對等於把自己過濾掉。
      </p>

      <h2>4. 有沒有刪掉跟這份 JD 無關的內容？</h2>
      <p>
        履歷不是越長越好。1 頁、條條相關，比 2 頁、一半離題還有力。
      </p>
      <p>
        投內容行銷職，10 年前的賣場打工就可以拿掉；投 PM 職，過去做過的攝影 side project 可能不需要。<strong>留下的每一條都要能回答「為什麼這條跟這份工作有關？」</strong>
      </p>

      <h2>5. 檔名跟你叫什麼名字？</h2>
      <p>
        最後一道：檔名改成「YourName_Resume_CompanyName.pdf」。
      </p>
      <p>
        三個原因：
      </p>
      <ol>
        <li>HR 下載到電腦時，你的名字才會出現在檔名（不是「履歷-final-v3.pdf」）</li>
        <li>未來找這份履歷時你自己也找得到</li>
        <li>展現基本的細心度</li>
      </ol>

      <h2>三個常見的捷徑陷阱</h2>
      <ol>
        <li>
          <strong>用 ChatGPT 全文重寫</strong>：通用 AI 會把所有特色磨平，HR 一眼看出。要 AI 改，要餵 JD 進去精準改幾條。
        </li>
        <li>
          <strong>只改 cover letter 不改履歷</strong>：HR 通常先掃履歷，cover letter 是加分不是替代。
        </li>
        <li>
          <strong>客製過頭變謊言</strong>：寫「精通 React」面試卻答不出 useEffect 的 dependency array，那就是把自己關在門外。
        </li>
      </ol>

      <h2>下一步</h2>
      <p>
        把這個清單存成書籤，下次投履歷前花 5 分鐘走一次。如果想要更系統化的客製建議（特別是關鍵字覆蓋率），用 Offery 的 AI 比對工具，貼上 JD 即可拿到逐條建議。
      </p>
    </>
  );
}

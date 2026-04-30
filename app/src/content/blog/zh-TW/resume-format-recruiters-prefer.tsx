import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-format-recruiters-prefer",
  title: "PDF、Word、CakeResume 線上頁、LinkedIn——面試官實際打開哪一個？",
  description:
    "面試官視角：你寄了三種版本，我只開一個。揭露真實的閱讀順序與裝置——投履歷的格式選擇影響比你想像中大。",
  category: "resume",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "resume-optimizer",
  ctaText: "讓 AI 幫你優化 PDF 版本——這是面試官真的會開的格式",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        候選人常常焦慮地問：「我履歷要寄 PDF 還是 Word？要不要附 CakeResume 連結？要不要把 LinkedIn 也放上去？」
      </p>
      <p>
        面試官實話：<strong>我大部分時候只開一個</strong>。哪一個？看情境。下面是真實的偏好順序與場景：
      </p>

      <h2>場景一：HR 第一輪篩選</h2>
      <p>
        HR 一週篩 100 份履歷，他要的是<strong>能在手機上快速滑完</strong>的格式。
      </p>
      <p>
        實際打開順序：
      </p>
      <ol>
        <li>
          <strong>PDF（80% 的情況）</strong>：手機 / iPad 上開最快、排版不跑掉
        </li>
        <li>
          <strong>線上頁面（CakeResume / Notion）</strong>：只有當應徵公司明確要求 portfolio 時才會點
        </li>
        <li>
          <strong>LinkedIn 連結</strong>：HR 通常不點，除非你的履歷讓他想多查證
        </li>
      </ol>
      <p>
        <strong>不要寄</strong>：Word（.docx）。每台電腦字體版本不同，排版會跑。「打開後字醜」就是減分。
      </p>

      <h2>場景二：用人主管 review</h2>
      <p>
        主管在桌面 / 大螢幕上開，他想要<strong>能快速 print 或截圖貼進 deck</strong>。
      </p>
      <ol>
        <li>
          <strong>PDF（90%）</strong>：照原樣印、字級保持
        </li>
        <li>
          <strong>履歷網站</strong>：偶爾，但通常因為 HR 已經貼好 PDF 了，主管不會再去點連結
        </li>
      </ol>

      <h2>場景三：面試前 5 分鐘的「打印或不印」</h2>
      <p>
        面試官在會議室外滑手機，準備走進去。這時候他打開的是：
      </p>
      <ol>
        <li>
          <strong>HR 寄來的 PDF（再開一次掃重點）</strong>
        </li>
        <li>
          <strong>LinkedIn（如果你寫得好的話）</strong>——因為 LinkedIn 的 mobile 介面比 PDF 在手機上易讀
        </li>
      </ol>
      <p>
        這個場景告訴你：<strong>LinkedIn 在面試前 5 分鐘是最後一道印象</strong>。如果你 LinkedIn 簡介寫得空泛，會直接影響面試官走進去的預設印象。
      </p>

      <h2>什麼情境下「線上履歷頁」真的會被打開？</h2>
      <ol>
        <li>
          <strong>設計、創意職位</strong>：HR 會主動點 portfolio 連結（這是 JD 必要條件）
        </li>
        <li>
          <strong>工程師職位的 GitHub</strong>：技術主管會看，但只看 README 跟最新 commit
        </li>
        <li>
          <strong>個人網站 / blog</strong>：只有約 10–15% 機率被點，但點了就是<strong>很正面的訊號</strong>，因為對方是真的有興趣
        </li>
      </ol>

      <h2>四個常見的格式災難</h2>

      <h3>1. 履歷檔名是「履歷-final-v3.pdf」</h3>
      <p>
        HR 下載到電腦資料夾後，找不到誰是誰。改成「YourName_Resume_2026.pdf」是基本功。
      </p>

      <h3>2. PDF 圖片化（解析度低、不能複製文字）</h3>
      <p>
        如果你是把 PPT / Keynote 截圖存 PDF，HR 在手機放大會糊掉。<strong>用 Word/Google Docs export PDF</strong>，文字保持向量。
      </p>

      <h3>3. 一封信寄三個附件</h3>
      <p>
        「resume.pdf、portfolio.pdf、cover-letter.pdf、references.docx」——HR 一個都不會全開。最多開最像「主菜」的那個。
      </p>
      <p>
        把所有東西<strong>整合成一份 PDF</strong>，最重要的放第一頁。
      </p>

      <h3>4. 內文連結點不到</h3>
      <p>
        履歷上的「LinkedIn」「GitHub」必須是<strong>可點擊的超連結</strong>，不要只是純文字。手機上的 PDF 點下去能直接跳走，影響很大。
      </p>

      <h2>關於 LinkedIn 的真相</h2>
      <p>
        很多人問：「LinkedIn 寫得詳細，履歷可以簡化嗎？」
      </p>
      <p>
        <strong>不可以</strong>。因為：
      </p>
      <ul>
        <li>HR 第一輪不會點 LinkedIn</li>
        <li>主管 review 的是 PDF，不是 LinkedIn</li>
        <li>LinkedIn 的價值在「<strong>面試前最後 5 分鐘</strong>」與「<strong>主動被 recruiter 找</strong>」</li>
      </ul>
      <p>
        正確的策略：<strong>履歷 PDF 寫到完整，LinkedIn 不抄履歷而是寫互補的內容</strong>（觀點、文章、案例研究）。
      </p>

      <h2>面試官的小提醒</h2>
      <p>
        如果你只投一個格式，請選：<strong>PDF（向量、檔名專業、可點擊連結）</strong>。
      </p>
      <p>
        所有其他格式都是 nice-to-have，不是 must-have。把 90% 的時間放在 PDF 的內容優化，比花時間做漂亮的 portfolio 網站更划算。
      </p>

      <h2>下一步</h2>
      <p>
        檢查你目前的履歷 PDF：（1）檔名是否專業（2）連結是否可點（3）字體是否向量。三個都過關後，再考慮其他格式。Offery 的履歷優化器產出的也是符合這三項標準的 PDF。
      </p>
    </>
  );
}

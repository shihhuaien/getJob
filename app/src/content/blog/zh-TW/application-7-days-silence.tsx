import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "application-7-days-silence",
  title: "履歷投出去後 7 天無回音——對方公司內部到底發生什麼？",
  description:
    "面試官視角：你以為「沒回 = 被刷」。實際上你的履歷可能還沒被任何人類看過。揭露投遞後 7 天內 HR 端的真實流程，與你該怎麼接下去動作。",
  category: "job-search",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "jobs",
  ctaText: "把投遞紀錄記到追蹤板，掌握每份的 follow-up 時機",
  featured: false,
};

export default function Article() {
  return (
    <>
      <p>
        你週一在 LinkedIn 投了夢幻職缺。第二天醒來看 inbox，沒消息。第三天，沒消息。第七天，還是沒消息。
      </p>
      <p>
        你開始懷疑：「是不是我履歷不夠好？」
      </p>
      <p>
        作為面試官，我可以告訴你：<strong>很可能不是</strong>。你的履歷在 HR 那端，這 7 天內可能根本沒被任何「人類」看過。下面是真實發生的事。
      </p>

      <h2>Day 1：你投了，到 ATS</h2>
      <p>
        你按下「Apply」後，履歷不是直接寄到 HR 的 inbox，是進到公司的 ATS（Applicant Tracking System）資料庫。
      </p>
      <p>
        在 ATS 裡，你會被打上：
      </p>
      <ul>
        <li>申請日期</li>
        <li>應徵職缺 ID</li>
        <li>關鍵字 match 分數（如果系統有這功能）</li>
        <li>來源（LinkedIn / 104 / 公司官網 / 內推）</li>
      </ul>
      <p>
        這時候<strong>沒有任何人看你的履歷</strong>。系統幫你排隊。
      </p>

      <h2>Day 2–3：HR 不一定會打開 ATS</h2>
      <p>
        典型 HR 一週負責 5–8 個 open role。她不是每天打開每個職缺看新履歷——她有自己的優先序：
      </p>
      <ol>
        <li>急的職缺先看（用人主管在催）</li>
        <li>有 referral 的優先看（推薦人在 ping）</li>
        <li>排在前面的看（依時間倒序，新的優先）</li>
      </ol>
      <p>
        如果你應徵的職缺不急、沒人 push、且當週新申請者很多——<strong>你的履歷可能在 Day 7 才會被打開第一次</strong>。
      </p>

      <h2>Day 3–5：第一輪「30 秒掃描」</h2>
      <p>
        HR 終於打開你的職缺，看到 50 份履歷。她會：
      </p>
      <ul>
        <li>每份花 30 秒（看<a href="/blog/resume-30-second-scan">前一篇</a>提到的位置）</li>
        <li>分成 Yes / Maybe / No 三堆</li>
        <li>Yes 大概 5–8 份，會優先安排面試</li>
        <li>Maybe 大概 15–20 份，先擱著</li>
      </ul>
      <p>
        如果你進了 Yes 堆，<strong>3 至 5 個工作天內</strong>會收到面試邀約。
      </p>
      <p>
        如果你進了 Maybe 堆，HR 不會回你。她在等 Yes 堆面試完，看夠不夠人。
      </p>
      <p>
        如果你進了 No 堆，HR 也不會回你。即使 HR 想回，她一週要回 200 個 No 太累，最多 2 週後系統批次發拒絕信。
      </p>

      <h2>Day 5–10：用人主管參與篩選</h2>
      <p>
        HR Yes 堆的 5–8 份履歷會送給用人主管 review。主管的時間更貴，可能再過 2–3 天才看。
      </p>
      <p>
        主管看了之後，可能：
      </p>
      <ul>
        <li>同意 HR 的 Yes，安排面試</li>
        <li>覺得不夠，請 HR 從 Maybe 堆挑更多</li>
        <li>覺得整體都不夠，請 HR 重新發 JD</li>
      </ul>
      <p>
        這個 loop 可能讓你的履歷在系統裡擱置 2–3 週才有結果。
      </p>

      <h2>所以「7 天沒消息」實際代表什麼？</h2>
      <p>
        三個可能性，機率高低如下：
      </p>
      <ol>
        <li>
          <strong>最可能（60%）</strong>：你的履歷還在 HR 的待審清單，根本沒被打開
        </li>
        <li>
          <strong>次可能（25%）</strong>：你進了 Maybe 堆，HR 還沒決定要不要動你
        </li>
        <li>
          <strong>最不可能（15%）</strong>：你被刷掉了，但拒絕信還沒寄出
        </li>
      </ol>
      <p>
        關鍵 insight：<strong>你 7 天沒被通知，最可能的原因不是你不夠好，是流程慢</strong>。
      </p>

      <h2>該主動追嗎？該怎麼追？</h2>
      <p>
        我的真實建議：<strong>Day 7 不要追，Day 14 可以禮貌追一次</strong>。
      </p>
      <p>
        Day 7 追的問題：HR 還沒看到你，追了顯得急。你會被記住為「焦慮型」。
      </p>
      <p>
        Day 14 是合理的時間點。怎麼追：
      </p>

      <h3>追的前提：你得有 HR 或內部聯絡管道</h3>
      <p>
        如果你只是在 LinkedIn 點 Apply，沒任何人脈——直接追只會石沉大海。
      </p>
      <p>
        所以：投履歷的同時，<strong>用 LinkedIn 找這家公司的 recruiter / 用人主管，發一封短訊息</strong>。
      </p>

      <h3>第 1 封（投遞當天）：建立軌道</h3>
      <blockquote>
        Hi [recruiter 名字]，
        <br />
        我剛投了 [職位] 的職缺。簡單自我介紹：[一句話定位]。
        <br />
        我有 [一個跟職位特別相關的成就]，覺得跟貴公司現在的 [具體業務] 可能有交集。
        <br />
        如果合適，期待跟你聊聊！
      </blockquote>

      <h3>第 2 封（Day 14 follow-up）：禮貌提醒</h3>
      <blockquote>
        Hi [名字]，
        <br />
        想 follow up 兩週前投的 [職位] 申請。我知道你們應該有不少候選人，所以不急——只是想確認我的申請有進到審核流程，避免技術問題卡住。
        <br />
        如果有任何需要我補充的，請告訴我！
      </blockquote>
      <p>
        這封信的功能：<strong>把你從 ATS 隊伍裡 surface 到 HR 的 inbox</strong>。她可能因為這封信，立刻去打開你的履歷。
      </p>

      <h2>三個常見的錯誤反應</h2>
      <ol>
        <li>
          <strong>第 3 天就追</strong>：太急，扣分。
        </li>
        <li>
          <strong>連續發 3 封 follow-up</strong>：你已經被歸類為「煩人型」，永遠不會收到回覆。
        </li>
        <li>
          <strong>放棄投別家</strong>：「我等這家有結果再投別的」是錯誤策略。<strong>同時投多家</strong>，等待的時間就不痛苦。
        </li>
      </ol>

      <h2>面試官的小提醒</h2>
      <p>
        投履歷後最有價值的動作不是「追」——是<strong>「不要把這份申請當成你唯一的籃子」</strong>。
      </p>
      <p>
        我看過太多候選人，投完夢幻公司後就停下動作等回音。等了 3 週才發現被刷，那時候 pipeline 是空的，要從零開始。<strong>同時保持 5–10 個 active 投遞</strong>，能讓你心理上不焦慮、議價上更有優勢。
      </p>

      <h2>下一步</h2>
      <p>
        建立你的「投遞 + follow-up」追蹤表：每份投遞日期、Day 14 提醒、有沒有 backup 聯絡人。Offery 的追蹤板就有這功能，能避免你忘記哪份該追、哪份該放下。
      </p>
    </>
  );
}

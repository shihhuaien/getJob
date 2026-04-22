export default function PrivacyZhTW() {
  return (
    <>
      <p className="text-base leading-7 text-text-light">
        Offery（以下稱「本服務」）尊重並致力於保護使用者個人資料。本政策說明我們蒐集哪些資料、為何蒐集、如何使用，以及你對個人資料擁有哪些權利。使用本服務即表示你同意本政策。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">一、蒐集的資料項目</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        為提供服務，我們會蒐集下列資料：
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>帳號基本資訊：電子郵件、姓名、Google OAuth 識別碼（若以 Google 登入）</li>
        <li>使用者建立的內容：履歷、求職信、職缺追蹤記錄、面試練習紀錄（文字、音訊與 AI 回應）</li>
        <li>訂閱資訊：Stripe Customer ID、訂閱狀態與計費時間（信用卡資訊由 Stripe 處理，本服務不儲存）</li>
        <li>系統識別資訊：Supabase User ID、API Token</li>
        <li>使用紀錄：操作日誌、錯誤記錄、IP 位址（僅作為安全與除錯用途）</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">二、蒐集目的</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>提供求職管理、AI 履歷優化、面試模擬等核心功能</li>
        <li>處理 Pro 方案訂閱計費與帳務往來</li>
        <li>維護系統安全、防範濫用、除錯與改善服務</li>
        <li>依使用者要求執行帳號管理（查詢、更正、刪除）</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">三、第三方資料處理者</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        為提供服務，我們會將必要資料提供給以下第三方處理者，所有處理者均受其自身隱私政策約束：
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>Supabase（美國 / 新加坡）：資料庫、身份驗證、檔案儲存</li>
        <li>Stripe（美國）：訂閱計費與信用卡處理</li>
        <li>Google（美國）：OAuth 登入服務</li>
        <li>Google Gemini API（美國）：AI 履歷優化、求職信生成、面試評分</li>
        <li>Vercel（全球 CDN）：網站託管與部署</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">四、資料留存期限</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        資料於帳號存續期間留存。當你刪除帳號後，我們將於 30 天內清除所有可辨識個人的資料，但法令要求保留者（如訂閱計費紀錄）除外。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">五、你的權利</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        依《個人資料保護法》第 3 條，你享有下列權利，可直接於設定頁操作或來信申請：
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>查詢或請求閱覽個人資料</li>
        <li>請求製給複本</li>
        <li>請求補充或更正</li>
        <li>請求停止蒐集、處理或利用</li>
        <li>請求刪除</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">六、Cookie 與追蹤技術</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        本服務僅使用必要 session cookie（SameSite=Lax）維持登入狀態，不使用第三方追蹤或行為分析 cookie。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">七、資料安全</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>全站 HTTPS 加密傳輸</li>
        <li>資料庫啟用 Row Level Security（RLS），使用者僅能存取自身資料</li>
        <li>Stripe Webhook 採簽章驗證防止偽造請求</li>
        <li>密碼由 Supabase Auth 以 bcrypt 雜湊儲存，本服務無法還原</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">八、未成年使用者</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        未滿 18 歲之使用者應於法定代理人同意下使用本服務。若你為法定代理人並發現子女未經同意註冊，請來信通知我們移除。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">九、政策變更</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        本政策若有重大變更，我們將透過服務介面或電子郵件通知，並於本頁更新「最後更新日期」。繼續使用即視為同意變更後的條款。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">十、聯絡方式</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        若你對個人資料處理有任何疑問、申訴或權利行使需求，請來信{" "}
        <a
          href="mailto:timshih@thdg.site"
          className="font-medium text-brand-600 hover:underline"
        >
          timshih@thdg.site
        </a>
        。我們將於 30 日內回覆。
      </p>
    </>
  );
}

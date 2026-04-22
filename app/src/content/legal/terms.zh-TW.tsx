export default function TermsZhTW() {
  return (
    <>
      <p className="text-base leading-7 text-text-light">
        歡迎使用 Offery（以下稱「本服務」）。在使用本服務前，請仔細閱讀本條款。註冊或使用本服務，即表示你已閱讀、理解並同意本條款之全部內容。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">一、服務說明</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        本服務為 AI 驅動的求職管理平台，提供職缺追蹤、履歷管理、求職信生成、AI 履歷優化、面試模擬、成效分析等功能。服務內容與功能可能不定期調整。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">二、帳戶</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>註冊時應提供真實且有效的電子郵件</li>
        <li>你應妥善保管帳號密碼，不得轉讓或提供他人使用</li>
        <li>因帳號密碼外洩所生之一切責任由使用者自負</li>
        <li>你可隨時於設定頁停用或刪除帳號</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">三、費用與訂閱</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>本服務提供免費方案與 Pro 方案（US$9.99 / 月）</li>
        <li>Pro 方案採 Stripe 月循環自動扣款</li>
        <li>你可隨時取消訂閱；取消後仍可使用至當期訂閱期間結束</li>
        <li>除法律另有規定外，已收取之費用不予退還</li>
        <li>本服務保留因成本或服務內容變動而調整價格之權利，調整前將先行通知</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">四、可接受使用</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        使用本服務時，你同意不從事下列行為：
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>上傳違法、侵害他人權利或具攻擊性之內容</li>
        <li>使用自動化工具、爬蟲或機器人濫用 API</li>
        <li>試圖破解、逆向工程或未授權存取系統</li>
        <li>冒用他人身份或提供不實資料</li>
        <li>違反中華民國法令或第三方服務（如 Stripe、Google）之使用規範</li>
      </ul>
      <p className="mt-3 text-base leading-7 text-text-light">
        違反本條款者，本服務得立即停止或終止服務，無須事先通知；因此所生任何費用或損失不予退還。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">五、智慧財產權</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>本服務之程式碼、介面設計、品牌識別、商標等智慧財產權屬本服務所有</li>
        <li>使用者建立之原創內容（如履歷、求職信）著作權屬使用者本人</li>
        <li>為提供服務所需，使用者授權本服務於必要範圍內儲存、處理與顯示其內容</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">六、AI 產出之免責</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        本服務運用大型語言模型（Google Gemini）提供 AI 輔助功能，包含履歷優化、求職信生成、面試評分與回饋。AI 產出內容僅供參考，不保證正確性或適用性；使用者應於送出前自行確認並承擔最終使用責任。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">七、服務中斷與責任限制</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-base leading-7 text-text-light">
        <li>本服務依現狀提供，不保證永續、無錯誤或完全符合使用者之特定需求</li>
        <li>因第三方服務（Supabase、Stripe、Google、Vercel）中斷所致之服務異常，本服務將盡合理努力排除但不負賠償責任</li>
        <li>
          除故意或重大過失外，本服務對使用者之任何直接或間接損害，賠償總額以過去 12 個月內使用者實際支付之服務費用為上限
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold text-text">八、條款修改</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        本服務得不時修改本條款。重大變更將透過服務介面或電子郵件通知，並於本頁更新「最後更新日期」。繼續使用本服務即視為同意變更後條款。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">九、準據法與管轄</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        本條款之解釋與適用，以中華民國法律為準據法。因本條款或本服務所生任何爭議，雙方同意以臺灣臺北地方法院為第一審管轄法院。
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-text">十、聯絡方式</h2>
      <p className="mt-3 text-base leading-7 text-text-light">
        對本條款有任何疑問，請來信{" "}
        <a
          href="mailto:timshih@thdg.site"
          className="font-medium text-brand-600 hover:underline"
        >
          timshih@thdg.site
        </a>
        。
      </p>
    </>
  );
}

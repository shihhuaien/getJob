// 104.com.tw 職缺頁面擷取器
(function () {
  function extractJobData() {
    const companyName =
      document.querySelector("[class*='company'] a")?.textContent?.trim() ||
      document.querySelector("a[data-gtm-head]")?.textContent?.trim() ||
      "";

    const jobTitle =
      document.querySelector("h1")?.textContent?.trim() || "";

    const jobUrl = window.location.href;

    // 擷取職缺描述完整文字
    const descEl =
      document.querySelector("[class*='job-description']") ||
      document.querySelector(".job-requirement") ||
      document.querySelector("article");
    const rawText = descEl?.innerText?.trim() || "";

    return { company_name: companyName, job_title: jobTitle, job_url: jobUrl, raw_text: rawText };
  }

  // 回應 popup 的資料請求
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "GET_JOB_DATA") {
      sendResponse(extractJobData());
    }
    return true;
  });
})();

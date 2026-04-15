// CakeResume 職缺頁面擷取器
(function () {
  function extractJobData() {
    const companyName =
      document.querySelector("[class*='company-name']")?.textContent?.trim() ||
      document.querySelector("a[href*='/companies/']")?.textContent?.trim() ||
      "";

    const jobTitle =
      document.querySelector("h1")?.textContent?.trim() || "";

    const jobUrl = window.location.href;

    const descEl =
      document.querySelector("[class*='job-description']") ||
      document.querySelector("[class*='content-section']") ||
      document.querySelector("article");
    const rawText = descEl?.innerText?.trim() || "";

    return { company_name: companyName, job_title: jobTitle, job_url: jobUrl, raw_text: rawText };
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "GET_JOB_DATA") {
      sendResponse(extractJobData());
    }
    return true;
  });
})();

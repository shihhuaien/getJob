// LinkedIn 職缺頁面擷取器
(function () {
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  async function extractJobData() {
    // LinkedIn 延遲載入，等待描述區塊出現
    await waitForElement(".jobs-description__content, .jobs-description-content__text");

    const companyName =
      document.querySelector(".job-details-jobs-unified-top-card__company-name a")?.textContent?.trim() ||
      document.querySelector("[class*='company-name']")?.textContent?.trim() ||
      "";

    const jobTitle =
      document.querySelector(".job-details-jobs-unified-top-card__job-title h1")?.textContent?.trim() ||
      document.querySelector("h1")?.textContent?.trim() ||
      "";

    const jobUrl = window.location.href.split("?")[0];

    const descEl =
      document.querySelector(".jobs-description__content") ||
      document.querySelector(".jobs-description-content__text");
    const rawText = descEl?.innerText?.trim() || "";

    return { company_name: companyName, job_title: jobTitle, job_url: jobUrl, raw_text: rawText };
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "GET_JOB_DATA") {
      extractJobData().then(sendResponse);
    }
    return true; // async response
  });
})();

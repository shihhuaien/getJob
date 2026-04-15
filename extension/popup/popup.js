// Popup 邏輯
const SUPPORTED_PATTERNS = [
  /^https:\/\/www\.104\.com\.tw\/job\//,
  /^https:\/\/www\.cakeresume\.com\/companies\/.+\/jobs\//,
  /^https:\/\/www\.linkedin\.com\/jobs\/view\//,
];

let currentJobData = null;

// 顯示指定 view，隱藏其他
function showView(viewId) {
  document.querySelectorAll(".view").forEach((v) => (v.style.display = "none"));
  document.getElementById(viewId).style.display = "block";
}

function showError(message) {
  document.getElementById("error-text").textContent = message;
  showView("error-view");
}

// 初始化
async function init() {
  const token = await getToken();

  if (!token) {
    showView("setup-view");
    return;
  }

  // 取得當前分頁 URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || "";
  const isSupported = SUPPORTED_PATTERNS.some((p) => p.test(url));

  if (!isSupported) {
    showView("unsupported-view");
    return;
  }

  // 從 content script 取得職缺資料
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "GET_JOB_DATA" });
    if (response) {
      currentJobData = response;
      document.getElementById("company-name").value = response.company_name || "";
      document.getElementById("job-title").value = response.job_title || "";
      showView("job-view");
    } else {
      showView("unsupported-view");
    }
  } catch {
    // content script 可能尚未載入
    showView("unsupported-view");
  }
}

// 儲存 API 金鑰
document.getElementById("save-token-btn").addEventListener("click", async () => {
  const token = document.getElementById("token-input").value.trim();
  if (!token) return;
  await setToken(token);
  init();
});

// 基本儲存（不含 AI 解析）
document.getElementById("save-basic-btn").addEventListener("click", async () => {
  const companyName = document.getElementById("company-name").value.trim();
  const jobTitle = document.getElementById("job-title").value.trim();

  if (!companyName || !jobTitle) {
    showError("公司名稱和職位名稱為必填");
    return;
  }

  showView("loading-view");

  try {
    await createJob({
      company_name: companyName,
      job_title: jobTitle,
      job_url: currentJobData?.job_url || "",
    });
    showView("success-view");
  } catch (err) {
    showError(err.message || "儲存失敗");
  }
});

// AI 解析並儲存
document.getElementById("save-ai-btn").addEventListener("click", async () => {
  if (!currentJobData?.raw_text) {
    showError("無法擷取職缺描述文字，請嘗試基本儲存");
    return;
  }

  showView("loading-view");

  try {
    const parsed = await parseJob(currentJobData.raw_text);

    // 用解析結果 + 原始 URL 建立職缺
    await createJob({
      company_name: parsed.company_name || currentJobData.company_name || "",
      job_title: parsed.job_title || currentJobData.job_title || "",
      job_url: currentJobData.job_url || "",
      job_description: parsed.job_description || "",
      salary_min: parsed.salary_min,
      salary_max: parsed.salary_max,
    });
    showView("success-view");
  } catch (err) {
    showError(err.message || "解析失敗");
  }
});

// 重試
document.getElementById("retry-btn").addEventListener("click", () => {
  if (currentJobData) {
    showView("job-view");
  } else {
    init();
  }
});

// 啟動
init();

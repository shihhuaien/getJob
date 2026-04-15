// Offery API client for Chrome extension
// 注意：上線前請將 API_BASE 改為正式網域
const API_BASE = "https://offery.vercel.app";

async function getToken() {
  const result = await chrome.storage.local.get("apiToken");
  return result.apiToken || null;
}

async function setToken(token) {
  await chrome.storage.local.set({ apiToken: token });
}

async function clearToken() {
  await chrome.storage.local.remove("apiToken");
}

async function parseJob(text) {
  const token = await getToken();
  if (!token) throw new Error("未設定 API 金鑰");

  const res = await fetch(`${API_BASE}/api/jobs/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "解析失敗");
  return data.data;
}

async function createJob(jobData) {
  const token = await getToken();
  if (!token) throw new Error("未設定 API 金鑰");

  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "儲存失敗");
  return data.data;
}

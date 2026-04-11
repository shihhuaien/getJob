# iOS App 專案開發框架（歷史附錄）

> ⚠️ **本文件已被重構**：內容已整合至 `knowledge-base/` 下的結構化知識庫中。
> 請改用以下文件：
> - `00-iOS-App-Framework-Universal.md` — 通用框架
> - `01-Tech-Expo-Supabase.md` — Expo + Supabase 技術棧
> - `02-Tech-Native-Swift.md` — 原生 Swift 技術棧
> - `03-Case-HomeBar.md` / `04-Case-WedSnap.md` / `05-Case-DuoRatio.md` — 專案案例
>
> 本文件保留作為歷史參考，不再更新。

---

> 本文件從 Home Bar 與 WedSnap 兩個專案（Expo + Supabase → App Store 上架）的實戰經驗中提煉而成。
> 新專案啟動時，將本文件交給 AI，即可按照此框架建立 CLAUDE.md、PRD.md、TODO.md、TECHNICAL_DOCS.md 並開始開發。

---

## 一、CLAUDE.md 框架（AI 行為準則）

> 新專案的 `CLAUDE.md` 應包含以下章節，依專案需求調整細節。

### 1.0 AI 角色定義與行為指令

> 放在 `CLAUDE.md` 最上方，作為 System Prompt 級別設定。

```markdown
## AI 角色定義

你是一位資深的 React Native (Expo) 與 Supabase 全端工程師。你的首要任務是寫出穩定、安全、符合 iOS 審核規範的程式碼，並嚴格遵守本文件所述之架構與規範。

### 文件連動機制
- 每次完成一個功能的 Commit 後，你必須主動檢視 TODO.md，並詢問使用者是否需要幫忙勾選已完成項目或更新進度。
- 若在開發過程中發現 PRD.md 或 TECHNICAL_DOCS.md 的設計有遺漏或與實作不符，必須主動提出並協助更新文件。
- 涉及 App Store 審核相關的修改，須同步檢查本文件第五章的檢查清單。

### Context 載入策略
> 以下「啟動咒語」範本可在新對話開頭使用，減少 Token 浪費：
>
> 「這是本專案的基礎架構文件。請先完整閱讀並記住 CLAUDE.md 的規範。接下來的任務我會指定你讀取 PRD.md 的特定章節與 TODO.md 的進度來進行開發。」
```

### 1.1 工作流與 Git 規範

```markdown
## 工作流與 Git 規範（Claude 行為準則）

> 以下規則為最高優先級，必須嚴格遵守。

### Git 版本控制與 Commit 規範
- 當使用者輸入「幫我 commit」時，必須先執行 `git status` 與 `git diff`，完整閱讀所有變更後再進行後續動作。
- 嚴格遵守 Conventional Commits：`feat`、`fix`、`refactor`、`style`、`docs`、`chore`、`test`。
- Commit Message 標題使用英文簡述，格式為 `type: short description`。
- 若有較複雜的邏輯改動，內文使用繁體中文條列式說明。
- 撰寫好 Commit Message 後，先向使用者確認，同意後才執行 `git add` 與 `git commit`。

### 語言與溝通規範
- 與使用者對話、程式碼註解、文件一律使用繁體中文。
- 絕對不可出現簡體中文字。

### 專案技術棧原則
- 修改任何程式碼前，必須先閱讀相關檔案，確保理解現有邏輯再動手。
<!-- 以下二擇一，依專案語言選擇 -->
<!-- TypeScript 專案 -->
- TypeScript 嚴格模式：修改後執行 `npx tsc --noEmit` 確認無型別錯誤。
<!-- JavaScript 專案 -->
- 專案使用 JavaScript（非 TypeScript），以 JSDoc 進行型別註解。
- 新增或修改程式碼時，須補上 JSDoc 型別定義（@typedef、@param、@returns）。
```

### 1.2 Supabase 規範（若使用 Supabase）

```markdown
### Supabase 查詢規範
- 所有查詢集中在 `hooks/` 內的 custom hook，不直接在 component 中寫查詢。
- 所有查詢結果須對應型別定義（TypeScript: `lib/database.types.ts`；JavaScript: JSDoc @typedef）。
- 在撰寫任何 Supabase 查詢前，必須先查看型別定義檔。嚴禁使用 `any` 或憑空猜測欄位名稱。若發現 schema 與型別檔不符，請先提醒使用者執行型別同步指令（如 `npm run types:gen`）。
- RLS 政策已啟用，撰寫查詢時需考慮使用者身份與資料權限。

### Supabase Migration 規範
- 每次 schema 變更都必須建立 migration 檔案，不可直接在 Dashboard 手動修改。
- Schema 變更（DDL）與資料變更（DML）必須分開為不同 migration 檔案。
- 已上線的 migration 檔案不可修改或刪除；若需修正，建立新的 migration。
- 大型資料表的索引建立使用 `CREATE INDEX CONCURRENTLY`。
- 零停機變更採用 Expand-Contract 模式：新增欄位 → 回填資料 → 更新邏輯 → 移除舊欄位。

### Supabase Edge Functions 規範
- 需要 Admin 權限的操作（帳號刪除、webhook 處理）透過 Edge Functions 實作。
- Edge Functions 使用 `SUPABASE_SERVICE_ROLE_KEY`，透過 Supabase Dashboard Secret 設定。
- 對外的 webhook endpoint 設定 `--no-verify-jwt`，並自行驗證 webhook secret。
```

### 1.3 安全性規範

```markdown
### 安全性規範
- 金鑰與憑證絕對不可寫入程式碼，一律透過環境變數管理。
- 使用參數化查詢，禁止字串拼接 SQL。
- RLS 為強制要求：所有涉及使用者資料的資料表必須啟用 Row Level Security。
- 錯誤訊息不可洩漏敏感資訊（stack trace、DB 結構、內部 ID）。
- 數量限制必須在 DB 層實作 SECURITY DEFINER 函式，前端檢查僅為 UX 輔助，不可作為唯一防線。
- 定期執行 `npm audit` 檢查已知漏洞。
```

### 1.4 程式碼品質規範

```markdown
### 程式碼品質規範
- 禁止 `console.log` 出現在正式程式碼中，改用適當的 error state 或錯誤處理。
- Immutable 資料更新：一律使用 spread operator 或 `map`/`filter`，不可直接 mutate state。
- 圖片元件統一使用 `expo-image`，不使用 React Native 的 `Image`。
- 所有非同步操作（Auth、SDK 初始化、Realtime 訂閱、AsyncStorage）必須加 try-catch，避免未捕獲錯誤導致閃退。
- Context 的 consumer 必須處理 null/undefined 初始值，不可直接 throw。

### 錯誤監控規範（正式版）
- 所有未預期的嚴重錯誤（Catch block 中的 error）不應只是 `console.error`，必須保留串接 Sentry 或 Crashlytics 的彈性。
- 統一使用 `lib/logger.js`（或 `.ts`）處理錯誤記錄，不可將錯誤細節直接暴露給使用者。
- `lib/logger.js` 範例：開發階段輸出至 console，正式版轉送至錯誤監控服務。

### 前端狀態與快取管理
- 伺服器狀態（Server State）建議引入 TanStack Query (React Query) 或 SWR 處理 Supabase 的資料拉取與快取，避免重複 Request 與手動管理 loading/error 狀態。
- 若專案規模較小，可先用 custom hooks + useEffect，但須在 TECHNICAL_DOCS.md 記錄此決策，以便日後評估遷移。
```

### 1.5 專案資訊區塊（依專案填入）

```markdown
## Project Overview
<!-- 一句話描述專案 -->

## Tech Stack
| 領域 | 技術 |
|------|------|
| **Mobile App** | Expo (React Native), JavaScript (JSDoc) 或 TypeScript |
| **Web Client** | Next.js (App Router), Tailwind CSS（若需要 Web 前台） |
| **Backend/DB** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **i18n** | i18next + react-i18next（若需多語系） |
| **付費機制** | RevenueCat（若需訂閱制） |
| **Target** | iOS (App Store) |

## Commands

> 建議將常用指令包裝為 `package.json` 的 npm scripts，AI 與開發者皆可直接使用 `npm run <script>`，減少冗長指令出錯。

```jsonc
// package.json scripts 範例
{
  "scripts": {
    "dev": "npx expo start --dev-client -c",
    "lint": "npx expo lint",
    "build:dev": "eas build --platform ios --profile development",
    "build:preview": "eas build --platform ios --profile preview",
    "build:prod": "eas build --platform ios --profile production",
    "submit": "eas submit --platform ios --latest",
    "db:push": "npx supabase db push",
    "db:migrate": "npx supabase migration new",
    "types:gen": "npx supabase gen types typescript --local > lib/database.types.ts"
  }
}
```

```bash
# Mobile App（須使用 development build，不可用 Expo Go）
npm run dev                              # 開發伺服器（清除快取）
cd mobile-app && npx expo lint           # Lint 檢查

# Web Client（若有）
cd web-client && npm run dev

# Supabase
npx supabase migration new <name>       # 建立 migration
npx supabase db push                     # 部署 schema 變更
npx supabase functions serve             # 本地測試 Edge Functions
npm run types:gen                        # 同步 DB 型別定義（TypeScript 專案）

# EAS Build
eas build --platform ios --profile development   # 開發版 build
eas build --platform ios --profile preview       # 內部測試版 build（Ad Hoc）
eas build --platform ios --profile production    # 正式版 build
eas submit --platform ios --latest               # 提交 App Store
```

## Project Structure
<!-- 依專案實際結構填寫，參考第八章的目錄結構範本 -->

## Environment Variables
```
EXPO_PUBLIC_SUPABASE_URL=         # Supabase API Endpoint
EXPO_PUBLIC_SUPABASE_ANON_KEY=    # Supabase Client Key
<!-- 以 EXPO_PUBLIC_ 前綴暴露給 client，service role key 只在 Edge Functions 使用 -->

# ⚠️ 重要：EAS 雲端 build 必須用 eas env:create 設定環境變數
# 本地 .env 不會帶入雲端 build，未設定會導致 App crash
```

## Key Business Rules
<!-- 列出核心業務規則，例如：免費/付費用戶的功能差異、數量限制、資料權限等 -->
<!-- 這些規則是 AI 修改程式碼時的重要參考依據 -->

## Apple Developer 資訊
- **Bundle ID**: `com.xxx.appname`
- **Team ID**: `XXXXXXXXXX`
```

---

## 二、PRD.md 框架（產品需求文件）

> 新專案的 `PRD.md` 應包含以下章節。

### 2.1 基本結構

```markdown
# PRD：{App 名稱} — {一句話描述}

**版本**：v1.0
**日期**：{YYYY-MM-DD}
**狀態**：規劃中 / 開發中 / 準備上架 / App Store Review

## 一、產品概述
### 產品願景
### 目標用戶
- **主要**：
- **次要**：
### 核心價值主張
### 商業模式
<!-- 一次性買斷 / 免費 + IAP / 訂閱制 / 完全免費 -->

## 二、使用者問題與痛點
| 痛點 | 解決方案 |
|------|----------|

## 三、功能規格
### 3.1 系統架構
| 模組 | 技術 | 路徑 | 說明 |
|------|------|------|------|
### 3.2 各畫面規格
<!-- 每個畫面包含：目的、功能需求、驗收標準 -->
<!-- 已完成的項目標記 ✅，未完成標記 ⬜ -->

## 四、資料模型
| 資料表 | 說明 |
|--------|------|
### Storage
<!-- Bucket 名稱、路徑結構、允許格式 -->

## 五、非功能性需求
| 項目 | 需求 |
|------|------|
| 平台 | iOS（App Store） |
| 語言 | 繁體中文（若需多語系，列出支援語言） |
| 效能 | 首屏渲染 < 2 秒 |
| 安全性 | RLS + 環境變數 + DB 層數量限制 |

## 六、MVP 範圍（v1.0）
### 包含
### 排除（規劃至 v2.0）

## 六之二、v2.0 功能規格
<!-- 非必填，但建議在 v1.0 開發期間就記錄未來規劃 -->

## 七、成功指標（KPI）

## 八、App Store 上架規範（防退件檢查清單）
<!-- 引用第四章的完整清單，加上專案特定的狀態追蹤 -->

## 九、開放問題（待決策）
| # | 問題 | 備註 |
|---|------|------|
```

---

## 三、TODO.md 框架（待辦管理）

> 新專案的 `TODO.md` 應包含以下結構。

```markdown
# TODO：{App 名稱} 待辦事項

**最後更新**：{YYYY-MM-DD}
**檢測方式**：Lint + JSDoc/TypeScript + 程式碼審查
**收費模式**：<!-- 一次性買斷 / 訂閱制 / 免費 -->

## 已決策（無需再討論）
| 項目 | 決策結果 |
|------|---------|
| UI 套件 | <!-- e.g. StyleSheet (Neumorphism) / React Native Paper --> |
| 設計風格 | <!-- e.g. Soft Neumorphism、色系 --> |
| 登入方式 | <!-- e.g. Apple + Google + Email --> |
| 收費模式 | <!-- e.g. 免費下載 + 訂閱制 (RevenueCat) --> |
| Bundle ID | <!-- e.g. com.xxx.appname --> |
| EAS Project ID | <!-- e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --> |
| URL Scheme | <!-- e.g. myapp --> |
| 圖片元件 | `expo-image`（非 React Native Image） |

## 已完成
<!-- 按功能分組，使用 [x] checkbox -->

## 🔴 高優先（App Store 強制要求）
<!-- 阻擋上架的項目 -->

## 🟡 中優先（核心功能完善）
<!-- 正式上線前必須完成 -->

## 🟠 安全邊際（防止資料庫爆量與惡意攻擊）
<!-- DB 層數量限制、Rate Limiting 等 -->

## 🔵 功能開發
<!-- 按版本或功能分組 -->

## 🟢 低優先（上架前完成即可）
<!-- 素材、圖片、美化、效能優化 -->

## 畫面開發進度
| 畫面 | 路徑 | 狀態 |
|------|------|------|

## 🙋 需要手動處理的項目（AI 無法代勞）
<!-- 外部平台設定：Apple Developer Console、App Store Connect、Google Cloud Console、EAS 環境變數、Supabase Dashboard、Vercel 等 -->

## App Store 上架防退件檢查清單
<!-- 引用第四章清單，加上專案特定狀態追蹤（✅ / ⬜） -->
```

---

## 四、TECHNICAL_DOCS.md 框架（技術規格文件）

> WedSnap 專案新增的文件類型。當專案規模較大或需要交接時，建議獨立維護技術規格文件。

```markdown
# {App 名稱} - 技術規格文件

> **版本**：v1.0
> **日期**：{YYYY-MM-DD}
> **狀態**：開發中

## 1. 專案概述
<!-- 核心價值、商業模式、使用限制 -->

## 2. 技術架構 & 開發規範
| 領域 | 技術選型 | 備註 |
| :--- | :--- | :--- |

### 2.1 JSDoc 標準化範例（JavaScript 專案）
<!-- 展示專案中 JSDoc 的撰寫標準 -->

## 3. 資料庫設計 (Schema)
### 3.1 Tables
<!-- 每張表列出所有欄位、型別、約束條件 -->
### 3.2 安全性策略 (RLS Policies)
<!-- 以表格列出每張表的 RLS 政策、角色、操作、條件 -->
### 3.2.1 安全性輔助函式 (Security Functions)
<!-- SECURITY DEFINER 函式：數量限制、訂閱驗證等 -->
### 3.3 檔案儲存 (Storage)
<!-- Bucket、路徑結構、安全規範 -->

## 4. 關鍵業務邏輯
<!-- Slug 生成、訂閱機制、刪除邏輯等核心流程的詳細說明 -->

## 5. 環境變數與部署

## 6. 接手/維運指令 (Handover Guide)

## 7. 多語系架構 (i18n)
<!-- 若有實作多語系 -->

## 8. 本地打包指南 (EAS Local Build)
### 8.1 環境需求
### 8.2 本地打包指令
### 8.3 上傳 TestFlight
### 8.4 疑難排解
### 8.5 本地憑證管理
```

---

## 五、App Store 上架完整檢查清單

> 此清單從 Home Bar 與 WedSnap 實戰經驗整理，適用於所有 iOS App 上架。

### 5.1 Apple 強制要求（缺一退件）

| # | 項目 | 說明 |
|---|------|------|
| 1 | **Sign in with Apple** | 若 App 提供任何第三方登入（Email、Google），必須同時提供 Apple Sign-in，且 UI 優先顯示 |
| 2 | **帳號刪除功能** | 若 App 支援帳號建立，必須提供帳號刪除（不只是登出）。Supabase 可用 Edge Function 呼叫 Admin API |
| 3 | **隱私權政策** | 必須提供公開 URL，填入 App Store Connect 與 App 內。建議部署在 Web Client 上（如 `/privacy`），而非 GitHub Gist，方便日後更新且更專業 |
| 4 | **服務條款**（若有付費功能）| 含使用者上傳內容的 App 建議提供服務條款頁面（`/terms`），載明內容授權與責任歸屬 |
| 5 | **隱私「營養標籤」** | 在 App Store Connect 如實填寫資料收集項目，每項需回答用途、是否關聯身份、是否用於追蹤 |
| 6 | **測試帳號** | 審核備註欄必須提供可登入的測試帳號密碼，**用英文撰寫** |

### 5.2 內容與 UI 要求

| # | 項目 | 說明 |
|---|------|------|
| 7 | **內容充足** | 不可有空白頁面、半成品功能、placeholder 文字。Web 首頁若有，須替換為正式的產品說明頁 |
| 8 | **所有頁面正常運作** | 審核員會點擊每個頁面，須透過 TestFlight 真機測試驗證 |
| 9 | **網路失敗處理** | 無網路時須顯示錯誤提示與重試按鈕，不可白屏或 crash |
| 10 | **空狀態** | 列表無資料時須有友善提示（圖示 + 文字引導） |
| 11 | **閃退防護** | Auth、SDK 初始化、Realtime 訂閱、AsyncStorage 等非同步操作必須 try-catch |
| 12 | **年齡限制內容** | 酒精/菸草相關 App 須實作年齡驗證閘 + 評級設為 17+ |

### 5.3 付費功能要求（若有 IAP / 訂閱）

| # | 項目 | 說明 |
|---|------|------|
| 13 | **IAP 產品設定** | 在 App Store Connect 建立產品，並提交審核（IAP 有獨立審核流程） |
| 14 | **免費試用條款標示** | 付費牆必須清楚標示：「X 天免費試用，之後每月/年 $X.XX」（Apple 審核要求） |
| 15 | **訂閱管理入口** | App 內必須提供「管理訂閱」連結，導向系統訂閱設定頁 |
| 16 | **還原購買** | 必須提供「還原購買」按鈕（`restorePurchases()`） |
| 17 | **App 定價** | 訂閱制 App 應設定為「免費」下載，不可設定付費下載 + 訂閱 |

### 5.4 App Store Connect 素材

| 素材 | 規格 |
|------|------|
| App Icon | 1024×1024px，PNG，無圓角，無透明 |
| iPhone 截圖（6.9 吋）| 1320×2868px，至少 3 張 |
| iPhone 截圖（6.5 吋）| 1242×2688px（備選） |
| 副標題 | 最多 30 字元 |
| 關鍵字 | 最多 100 字元，逗號分隔 |
| 促銷文字 | 最多 170 字元 |
| App 描述 | 詳細功能說明 |
| 隱私權政策 URL | 公開可存取 |
| 支援 URL | 可聯絡開發者（可用 email 或網頁） |

### 5.5 隱私營養標籤填寫指南

勾選後 Apple 會對每項問 3 個問題：

| 問題 | 常見回答 |
|------|---------|
| 資料用途？ | **App 功能** |
| 是否與使用者身份關聯？ | 若透過 Auth UID 關聯 → **是** |
| 是否用於追蹤？ | 若未整合追蹤 SDK → **否** |

常見勾選項目（Supabase Auth 專案）：
- **電子郵件地址**（聯絡資訊）→ 帳號建立
- **使用者識別碼**（識別碼）→ Auth UID
- **照片或影片**（使用者內容）→ 若有照片上傳功能
- **其他使用者內容**（使用者內容）→ 若有使用者輸入的文字資料

> **App Tracking Transparency (ATT) 備註**：若未來整合 PostHog、Google Analytics、Facebook SDK 等分析或廣告工具，Apple 會強制要求實作 ATT 彈窗（`requestTrackingPermission`）。目前若無追蹤 SDK 則不需要，但應在加入追蹤工具時同步處理。

### 5.6 技術合規

| # | 項目 | 說明 |
|---|------|------|
| 1 | 不使用私有 API | Expo managed workflow 通常安全 |
| 2 | `app.json` 版本號 | 每次送審必須遞增 `version` 或 `buildNumber` |
| 3 | 環境變數 | **必須在 EAS 設定**，本地 `.env` 不會帶入雲端 build |
| 4 | `ITSAppUsesNonExemptEncryption` | 若僅用 HTTPS，設為 `false` 免填出口合規文件 |
| 5 | iPhone-only 提交 | 若不支援 iPad，在 `app.json` 設定 `"supportsTablet": false` 並在 `infoPlist` 設定 `"UIDeviceFamily": [1]` |
| 6 | 內容版權 | 含使用者上傳內容的 App，選「是，包含第三方內容」並在服務條款載明授權 |

---

## 六、開發、測試、上線流程

### 6.1 開發階段

```bash
# 啟動開發伺服器（必須使用 development build，不可用 Expo Go）
npx expo start --dev-client -c
```

- 涉及原生模組（Apple Auth、Google Sign-In、RevenueCat 等）必須使用 development build，Expo Go 不支援
- 每完成一個邏輯單元就 commit（Conventional Commits）
- DB schema 變更必須建立 migration 檔案

### 6.2 測試階段

```bash
# Lint 檢查
npx expo lint

# 建立測試版 build
# 雲端打包（Ad Hoc，透過 TestFlight 內部測試）
eas build --platform ios --profile preview

# 本地打包（需安裝 Xcode + CocoaPods + Fastlane）
eas build --platform ios --profile preview --local
```

- 在真機上測試所有改動的功能
- 確認網路斷線、空狀態等 edge case
- 確認所有非同步操作的錯誤處理（Auth 失敗、SDK 初始化失敗、Realtime 斷線等）

### 6.3 合併 & 上線

```bash
# 更新 app.json 的 version（依變更規模）
# Bug 修復：1.0.1 / 小功能：1.1.0 / 大改版：2.0.0
# buildNumber 由 EAS autoIncrement 自動處理

# 正式 build + 提交
eas build --platform ios --profile production
eas submit --platform ios --latest

# commit 版本號變更
git add app.json
git commit -m "chore: bump version for vX.Y.Z release"
```

- 到 App Store Connect 選擇新 Build → 提交審核
- 審核通常需 1–3 天

### 6.4 Supabase Schema 變更流程

```bash
npx supabase migration new add_some_feature     # 1. 產生 migration
# 2. 撰寫 SQL（DDL 與 DML 分開）
npx supabase db push                              # 3. 部署 production
# 4. 若使用 TypeScript：重新產生型別
npx supabase gen types typescript --local > lib/database.types.ts
# 5. 若使用 Zod：更新 lib/schemas.ts
```

### 6.5 Edge Functions 部署流程

```bash
# 本地測試
npx supabase functions serve

# 部署（一般 Edge Function）
npx supabase functions deploy function-name

# 部署 Webhook endpoint（不驗證 JWT，自行驗證 secret）
npx supabase functions deploy webhook-name --no-verify-jwt

# 設定 Secret
npx supabase secrets set SECRET_NAME=secret_value
```

### 6.6 整體流程圖

```
開發 → Lint 檢查 → preview build → TestFlight 測試
    ↓
production build → eas submit → App Store 審核
    ↓
審核通過 → 發佈上線
```

---

## 七、新專案啟動 Checklist

> 建立新專案時，按順序執行以下步驟。

### 7.1 專案初始化

- [ ] `npx create-expo-app {app-name} --template`
- [ ] `eas init`（取得 EAS Project ID）
- [ ] 建立 `eas.json`（development / preview / production 三個 profile，production 開啟 `autoIncrement`）
- [ ] 設定 `app.json`：name、slug、scheme、bundleIdentifier、`ITSAppUsesNonExemptEncryption: false`、`supportsTablet: false`
- [ ] 安裝核心套件：`@supabase/supabase-js`、`expo-image`
- [ ] 安裝 Auth 套件：`expo-apple-authentication`、`@react-native-google-signin/google-signin`
- [ ] 安裝 UI 套件（依設計風格選擇：StyleSheet / React Native Paper / NativeWind）
- [ ] 建立 `lib/supabase.js`（或 `.ts`）
- [ ] 建立 `lib/theme.js`（設計系統：色彩、字型、間距）
- [ ] 建立 `.env`（本地）+ `eas env:create`（EAS 雲端，**務必設定，否則 production build 會 crash**）
- [ ] 設定 ESLint
- [ ] 建立 CLAUDE.md、PRD.md、TODO.md

### 7.2 Monorepo 初始化（若需 Web Client）

- [ ] 建立根目錄結構：`mobile-admin/`、`web-client/`、`supabase/`
- [ ] Web Client：`npx create-next-app web-client`
- [ ] Web Client 建立 `src/lib/supabase.js`
- [ ] 部署 Web Client 至 Vercel
- [ ] 設定 Vercel 環境變數

### 7.3 Apple Developer Console

- [ ] 建立 App ID，確認 Bundle ID
- [ ] 啟用 Sign in with Apple capability
- [ ] 記錄 Team ID

### 7.4 App Store Connect

- [ ] 建立 App 條目（名稱、Bundle ID、語言、SKU）
- [ ] 填寫年齡評級問卷
- [ ] 設定售價（訂閱制 App 設為「免費」）
- [ ] 填寫隱私營養標籤
- [ ] 設定內容版權

### 7.5 Supabase Dashboard

- [ ] 建立專案，取得 URL 與 Anon Key
- [ ] Authentication → Providers → 啟用 Apple OAuth（Client ID = Bundle ID，Secret 留空）
- [ ] Authentication → Providers → 啟用 Google OAuth（見 7.6 取得 Client ID）
- [ ] URL Configuration → 新增 `{scheme}://` Redirect URL

### 7.6 Google Cloud Console（若需 Google Sign-in）

- [ ] 建立專案 → OAuth 同意畫面 → User Type 設為「外部」
- [ ] 建立 OAuth 用戶端 ID（**Web application** 類型）→ 取得 Web Client ID 與 Client Secret → 填入 Supabase Google Provider
- [ ] 建立 OAuth 用戶端 ID（**iOS** 類型）→ 填入 Bundle ID → 取得 iOS URL Scheme
- [ ] Supabase Google Provider 開啟 **Skip nonce checks**（React Native 必須）
- [ ] 在 `app.json` 的 `infoPlist.CFBundleURLTypes` 註冊 iOS URL Scheme
- [ ] OAuth 同意畫面發佈至正式模式（非測試模式）

### 7.7 RevenueCat（若需訂閱制）

- [ ] 建立 RevenueCat 專案
- [ ] 連接 App Store Connect（上傳 App Store Connect API Key）
- [ ] 建立 Products（對應 App Store Connect IAP 產品 ID）
- [ ] 建立 Entitlement（如 `premium`）並關聯 Products
- [ ] 建立 Offering（如 `default`）並關聯 Packages
- [ ] 設定 Webhook → 指向 Supabase Edge Function URL
- [ ] 安裝 `react-native-purchases` SDK
- [ ] 在 Supabase 設定 `REVENUECAT_WEBHOOK_SECRET`

### 7.8 i18n 初始化（若需多語系）

- [ ] 安裝 `i18next`、`react-i18next`、`expo-localization`
- [ ] Mobile：建立 `lib/i18n/index.js`（使用 `expo-localization` 的 `getLocales()` **同步**偵測裝置語言，避免非同步初始化造成首次渲染閃現英文）
- [ ] Mobile：建立翻譯資源檔 `lib/i18n/zh-TW.js`、`lib/i18n/en.js`
- [ ] Mobile：建立 iOS 權限本地化檔案 `locales/en.json`、`locales/zh-Hant.json`（包含 `CFBundleDisplayName` 與 `NSPhotoLibraryUsageDescription` 等），並在 `app.json` 的 `expo.locales` 中註冊
- [ ] Web：安裝 `i18next-browser-languagedetector`
- [ ] Web：建立 `src/lib/i18n/index.js`、翻譯資源檔
- [ ] 語言持久化：Mobile 用 `AsyncStorage`、Web 用 `localStorage`

> **重要**：iOS 繁體中文的 locale code 為 `zh-Hant`（非 `zh-TW`）。`locales/` 目錄下的檔案命名必須使用 iOS 標準 locale code，否則 iOS 無法匹配，權限彈窗會 fallback 到英文。App 內部的 i18n 資源檔（`lib/i18n/zh-TW.js`）命名不受此限制。

---

## 八、實戰教訓（踩坑紀錄）

> 這些是 Home Bar 與 WedSnap 兩個專案實際踩過的坑，新專案務必注意。

### 8.1 EAS Build & 環境變數

| # | 教訓 | 說明 |
|---|------|------|
| 1 | **EAS 環境變數必須手動設定** | 本地 `.env` 不會帶入雲端 build。未設定會導致 Supabase client 初始化失敗 → App 啟動即 crash。用 `eas env:create` 設定。 |
| 2 | **本地打包使用本地 `.env`** | `eas build --local` 從專案目錄下的 `.env` 讀取，不需 EAS 雲端設定。出現 `No environment variables found on EAS` 提示是正常的。 |
| 3 | **`eas submit` 需要 `ascAppId`** | 首次 submit 需要互動模式登入 Apple ID。完成後將 `ascAppId` 寫入 `eas.json`，後續可用 `--non-interactive`。 |
| 4 | **`buildNumber` 由 EAS 自動遞增** | `eas.json` 的 `production` profile 設定 `"autoIncrement": true`，不需手動改。 |
| 5 | **只有 production profile 能上傳 TestFlight** | `development` 和 `preview` 使用 Ad Hoc 簽署，上傳會被拒絕（Invalid Provisioning Profile）。 |

### 8.2 原生模組 & Expo

| # | 教訓 | 說明 |
|---|------|------|
| 6 | **必須用 Development Build** | 涉及原生模組（Apple Auth、Google Sign-In、RevenueCat）的套件無法在 Expo Go 中運行，必須透過 EAS 打包 development build。 |
| 7 | **新增/移除原生套件後必須重新打包** | 安裝 `react-native-purchases` 等原生套件後，需重新執行 `eas build --profile development`。 |
| 8 | **`expo-image` 取代 React Native `Image`** | 內建 `Image` 無磁碟快取，每次進頁面都重新下載。統一用 `expo-image` + `cachePolicy="disk"`。 |
| 9 | **Splash Screen 控制** | 在 `_layout.js` 的 module scope 呼叫 `preventAutoHideAsync()`，待 Auth 初始化完成再 `hideAsync()`，避免閃爍。 |
| 10 | **`npx expo install` 確保版本相容** | 手動 `npm install` 可能安裝不相容的套件版本（如 `expo-localization@55` vs SDK 54），一律用 `npx expo install` 安裝。 |

### 8.3 第三方登入

| # | 教訓 | 說明 |
|---|------|------|
| 11 | **Google Sign-In 資料結構變更** | `@react-native-google-signin` v13+ 的 `idToken` 移到 `data` 物件內。需用 Optional Chaining 相容：`userInfo?.data?.idToken \|\| userInfo?.idToken`。 |
| 12 | **Supabase Google Provider 必須開 Skip nonce checks** | React Native 無法傳遞 nonce 給 Supabase，不開會導致驗證失敗。 |
| 13 | **Apple Sign-In 純 iOS 不需 .p8 密鑰** | 純 iOS 原生登入只需在 Apple Developer 啟用 capability + Supabase 填入 Bundle ID。.p8 密鑰留待未來 Web 版後台登入使用。 |

### 8.4 Supabase & 資料庫

| # | 教訓 | 說明 |
|---|------|------|
| 14 | **Migration DDL 與 DML 分開** | 在同一個 migration 混合 schema 變更和資料更新，若中途失敗會導致難以回復的狀態。 |
| 15 | **數量限制必須在 DB 層實作** | 前端檢查可被繞過。使用 SECURITY DEFINER 函式在 RLS 中強制限制（如 `check_photo_limit`、`check_event_limit`）。 |
| 16 | **Webhook endpoint 用 `--no-verify-jwt`** | 外部服務（RevenueCat）呼叫 Edge Function 時不帶 JWT，需關閉驗證並自行驗證 webhook secret。 |

### 8.5 App Store 審核

| # | 教訓 | 說明 |
|---|------|------|
| 17 | **隱私營養標籤要保守填寫** | 寧可多勾不要少勾，漏報比多報的後果嚴重。 |
| 18 | **審核備註用英文** | Apple 審核員可能不懂中文，測試帳號說明建議用英文。 |
| 19 | **App Store Connect 的「內容版權」** | 容易忽略的欄位，未設定會阻擋提交。含使用者上傳內容選「是，包含第三方內容」。 |
| 20 | **行銷 URL 不可填假 URL** | 留空即可，填 `http://example.com` 可能被退件。 |
| 21 | **付費牆必須標示免費試用條款** | 「7 天免費試用，之後每年 $49.99」— Apple 對試用條款的標示有嚴格要求。 |
| 22 | **iOS 權限字串必須本地化** | 權限彈窗語言須與 App 語言一致。透過 `app.json` 的 `expo.locales` 設定 `locales/*.json`，locale code **必須用 iOS 標準**（`zh-Hant`，非 `zh-TW`），否則 iOS 無法匹配，fallback 到英文 → 審核退件（Guideline 4 - Design）。 |
| 23 | **App 語言須跟隨裝置語言** | 使用 `expo-localization` 的 `getLocales()` 同步偵測裝置語言，i18next 同步初始化。若用非同步方式，首次渲染會閃現英文。 |

### 8.6 閃退防護（從 WedSnap 學到）

| # | 教訓 | 說明 |
|---|------|------|
| 24 | **Auth 回呼中的 SDK 同步加 try-catch** | RevenueCat 登入/登出若失敗，不可中斷 Auth 流程。 |
| 25 | **Context consumer 處理 null** | Context 初始值為 null 時，consumer 應返回安全預設值而非 throw。 |
| 26 | **Realtime subscribe 加 try-catch** | Supabase Realtime 訂閱失敗不應導致整頁閃退。 |
| 27 | **response.json() 加 try-catch** | Edge Function 回傳非 JSON（如 500 HTML 頁面）時會 throw。 |
| 28 | **optional chaining 存取深層物件** | SDK 回傳的資料結構可能不完整，如 `entitlements?.active?.premium`。 |

### 8.7 本地打包（EAS Local Build）

| # | 教訓 | 說明 |
|---|------|------|
| 29 | **WWDR 中繼憑證** | 本地打包需安裝 Apple WWDR 憑證，否則 `security find-identity` 回傳 0 個有效身份。依 Distribution Cert 的 issuer（G3 或 G4）下載對應版本。 |
| 30 | **Xcode 26+ 不內建 iOS SDK** | 需手動至 Xcode → Settings → Components 下載 iOS 平台。 |
| 31 | **本地打包需安裝額外工具** | CocoaPods（`brew install cocoapods`）、Fastlane（`brew install fastlane`）、EAS CLI（`npm i -g eas-cli`）。 |

---

## 九、推薦專案目錄結構

### 9.1 純 Mobile App

```
app/                        # Expo Router file-based routing
  _layout.js                # Root layout（Provider、Auth 狀態、Splash Screen、i18n）
  index.js                  # 登入頁（Apple + Google + Email）
  dashboard/
    index.js                # Dashboard（主頁）
    [slug].js               # 動態路由詳細頁

components/                 # 可複用 UI 元件
  ui/                       # 基礎 UI 元件（設計系統）

contexts/                   # React Context（全域狀態共享）

hooks/                      # Custom hooks（Supabase 查詢、Auth、業務邏輯）

locales/                    # iOS 系統權限字串本地化（Expo locales）
  en.json                   # 英文（CFBundleDisplayName + 權限描述）
  zh-Hant.json              # 繁體中文（注意：iOS 用 zh-Hant，非 zh-TW）

lib/
  supabase.js               # Supabase client 初始化
  theme.js                  # 設計系統（色彩、字型、間距）
  logger.js                 # 統一錯誤記錄（預留 Sentry/Crashlytics 串接）
  i18n/                     # i18n 設定與翻譯資源（若需多語系）
    index.js
    zh-TW.js
    en.js

supabase/
  functions/                # Edge Functions
  migrations/               # SQL migration 檔案

assets/                     # 靜態圖片、字型

CLAUDE.md                   # AI 行為準則
PRD.md                      # 產品需求文件
TODO.md                     # 待辦管理
TECHNICAL_DOCS.md           # 技術規格文件（選用）
eas.json                    # EAS Build 設定
```

### 9.2 Monorepo（Mobile + Web + Supabase）

```
project-root/
├── mobile-admin/              # Expo React Native App
│   ├── app/                   # Expo Router
│   ├── components/            # 可複用 UI 元件
│   │   └── ui/                # 基礎 UI 元件（設計系統）
│   ├── contexts/              # React Context
│   ├── hooks/                 # Custom hooks
│   ├── locales/               # iOS 權限字串本地化
│   │   ├── en.json
│   │   └── zh-Hant.json
│   ├── lib/                   # 工具函式、SDK 初始化
│   │   ├── supabase.js
│   │   ├── logger.js          # 統一錯誤記錄
│   │   ├── i18n/
│   │   └── theme.js
│   ├── app.json
│   └── eas.json
├── web-client/                # Next.js Web App
│   └── src/
│       ├── app/               # App Router pages
│       └── lib/               # 工具函式、SDK 初始化
│           ├── supabase.js
│           └── i18n/
├── supabase/
│   ├── functions/             # Edge Functions
│   │   ├── delete-account/    # 帳號刪除
│   │   └── xxx-webhook/       # Webhook 處理
│   ├── migrations/            # SQL migration 檔案
│   └── config.toml
├── CLAUDE.md
├── PRD.md
├── TODO.md
└── TECHNICAL_DOCS.md
```

---

## 十、常見功能實作模式

> 從 WedSnap 專案提煉的可複用模式。

### 10.1 訂閱制架構（RevenueCat + Supabase）

**推薦模式**：DB 為唯一真相來源

```
App Store → RevenueCat → Webhook → Supabase DB → App 讀取
```

- RevenueCat SDK 僅用於：發起購買（`purchasePackage`）、取得方案列表（`getOfferings`）、還原購買（`restorePurchases`）
- 訂閱狀態**只從 Supabase DB 讀取**，不從 RevenueCat SDK 判斷
- 支援 Admin Override：`subscription_override` 為 `true` 時，Webhook 不覆蓋該用戶狀態
- 程式碼結構：
  - `lib/revenuecat.js` — SDK 初始化、登入/登出
  - `hooks/useSubscription.js` — 訂閱狀態查詢、購買、還原
  - `contexts/SubscriptionContext.js` — 全域訂閱狀態共享
  - `components/PaywallModal.js` — 付費牆 UI
  - `supabase/functions/revenuecat-webhook/` — Webhook 處理

### 10.2 帳號刪除（Supabase Edge Function）

Apple 強制要求，實作模式：
- Edge Function 使用 `SUPABASE_SERVICE_ROLE_KEY` 呼叫 Admin API
- 刪除流程：清除使用者資料 → `auth.admin.deleteUser(userId)`
- 前端：確認對話框 → 呼叫 Edge Function → 登出 → 導回登入頁

**軟刪除 vs 硬刪除策略**：
- 若有其他資料表參照到 User ID，應在資料庫層級設定 `ON DELETE CASCADE`，或在 Edge Function 中依序清除關聯資料
- 若有合規需求需保留交易紀錄（如 RevenueCat 訂閱記錄），應實作個資匿名化（Anonymization）而非純粹刪除：將 email、name 等 PII 欄位替換為匿名值，保留交易記錄的完整性
- 在 TECHNICAL_DOCS.md 中記錄哪些資料表採用硬刪除、哪些採用匿名化，確保合規可追溯

### 10.3 Realtime 即時同步

```javascript
// 訂閱資料變更
const channel = supabase
  .channel('changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'target_table',
    filter: `column=eq.${value}`
  }, (payload) => { /* 處理變更 */ })
  .subscribe()

// 清理訂閱（useEffect cleanup）
return () => { supabase.removeChannel(channel) }
```

### 10.4 i18n 多語系架構

- **語言偵測**：
  - Mobile：使用 `expo-localization` 的 `getLocales()`（同步 API），不要用 `NativeModules.SettingsManager`（不穩定且跨平台不一致）
  - Web：`i18next-browser-languagedetector`
- **i18next 初始化必須同步**：以 `getLocales()` 取得裝置語言後直接呼叫 `i18n.init()`，不可用 async/await，否則 App 首次渲染會閃現 fallback 語言
- **使用者語言偏好**：啟動後異步從 `AsyncStorage` 讀取，若使用者曾手動切換語言則覆蓋裝置預設
- **非中文裝置預設英文**
- **翻譯資源檔 Mobile 與 Web 獨立維護**（UI 文案不同）
- **iOS 權限字串本地化**：透過 `app.json` 的 `expo.locales` 註冊 `locales/*.json`，prebuild 時自動產生 `InfoPlist.strings`。locale code 必須使用 iOS 標準（`zh-Hant`，非 `zh-TW`）
- **注意**：`t()` 在 `useCallback` 中使用時，必須加入依賴陣列

### 10.5 DB 層安全防護模式

```sql
-- SECURITY DEFINER 函式範例：數量限制檢查
CREATE OR REPLACE FUNCTION check_item_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT count(*) FROM items WHERE owner_id = p_user_id) < 10;
END;
$$;

-- 在 RLS 中使用
CREATE POLICY "limit_insert" ON items
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
    AND check_item_limit(auth.uid())
  );
```

---

## 十一、外部資源參考

### everything-claude-code
> https://github.com/affaan-m/everything-claude-code

| 類別 | 說明 |
|------|------|
| **Agents**（21 個）| 子代理：規劃師、架構師、Code Review、安全稽核、Build 錯誤修復、E2E 測試 |
| **Commands**（52 個）| Slash 指令：`/tdd`、`/plan`、`/code-review`、`/build-fix`、`/e2e` 等 |
| **Skills**（102+）| 語言／框架最佳實踐（TypeScript、Swift、Django、Spring Boot 等） |
| **Rules**（34 個）| 語言無關原則 + 各語言專屬規範 |
| **Hooks** | 自動化觸發：格式化、金鑰偵測、Session 生命週期、Context 壓縮 |
| **MCP Configs** | 外部服務整合：GitHub、Supabase、Vercel、Railway |

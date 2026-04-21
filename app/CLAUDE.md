@AGENTS.md

# Offery - 智慧求職平台

## AI 角色定義

你是一位資深的 Next.js 與 Supabase 全端工程師。你的首要任務是寫出穩定、安全、符合產品需求的程式碼，並嚴格遵守本文件所述之架構與規範。

### 文件連動機制

- 每次完成一個功能的 Commit 後，你必須主動檢視 TODO.md，並詢問使用者是否需要幫忙勾選已完成項目或更新進度。
- 若在開發過程中發現 PRD.md 的設計有遺漏或與實作不符，必須主動提出並協助更新文件。

### Context 載入策略

> 新對話開頭使用：
>
> 「這是本專案的基礎架構文件。請先完整閱讀並記住 CLAUDE.md 的規範。接下來的任務我會指定你讀取 PRD.md 與 TODO.md 的進度來進行開發。」

---

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
- TypeScript 嚴格模式：修改後確認無型別錯誤。
- 優先使用 Server Components，需要互動才加 `"use client"`。

---

## 編碼原則（Coding Principles）

### 1. 先思考再動手（Think Before Coding）

不假設、不隱藏疑惑、主動呈現取捨。

- 實作前明確陳述你的假設。若不確定，先問。
- 若存在多種解讀方式，全部列出——不要默默選一個。
- 若有更簡單的做法，主動提出。必要時應該推回需求。
- 若有任何不清楚之處，停下來，指出困惑點，然後提問。

### 2. 簡潔優先（Simplicity First）

用最少的程式碼解決問題，不做推測性開發。

- 不做超出需求範圍的功能。
- 單次使用的程式碼不抽象化。
- 未被要求的「彈性」或「可配置性」不加。
- 不為不可能發生的情境加錯誤處理。
- 若寫了 200 行但 50 行就能搞定，重寫。
- 自問：「資深工程師會覺得這太複雜嗎？」如果是，簡化。

### 3. 手術式修改（Surgical Changes）

只動該動的地方，只清理自己製造的問題。

編輯現有程式碼時：
- 不「順便改善」周圍的程式碼、註解或格式。
- 不重構沒壞的東西。
- 配合現有風格，即使你會用不同方式寫。
- 若發現不相關的死碼，提出即可——不要自行刪除。

當你的修改產生孤立程式碼時：
- 移除因你的修改而變成未使用的 import / 變數 / 函式。
- 不移除先前就存在的死碼，除非被要求。

**檢驗標準：每一行變更都應該能直接追溯到使用者的需求。**

### 4. 目標驅動執行（Goal-Driven Execution）

定義成功標準，循環驗證直到確認完成。

將任務轉化為可驗證的目標：
- 「加入驗證」→「為無效輸入寫測試，然後讓測試通過」
- 「修復 bug」→「寫出重現 bug 的測試，然後讓測試通過」
- 「重構 X」→「確保重構前後測試都通過」

多步驟任務須陳述簡要計劃：
```
1. [步驟] → 驗證：[檢查項目]
2. [步驟] → 驗證：[檢查項目]
3. [步驟] → 驗證：[檢查項目]
```

明確的成功標準讓你能獨立循環驗證；模糊的標準（如「讓它能動」）則需要持續確認。

---

## Tech Stack

| 領域        | 技術                                                |
| ----------- | --------------------------------------------------- |
| 框架        | Next.js 16 (App Router)                             |
| 語言        | TypeScript (strict mode)                            |
| 樣式        | Tailwind CSS v4                                     |
| 後端/資料庫 | Supabase (Auth + PostgreSQL + RLS + Storage)        |
| 支付        | Stripe (Subscription)                               |
| 狀態管理    | Zustand                                             |
| 表單 / 驗證 | React Hook Form + Zod                               |
| 多語系      | next-intl（zh-TW 預設、en）                         |
| AI          | Google Generative AI SDK（`gemini-2.5-flash`）      |
| 拖拉        | @dnd-kit                                            |
| 動畫        | @lottiefiles/dotlottie-react（loading spinner）     |
| 日期        | date-fns                                            |
| 圖示        | Lucide React                                        |
| 部署        | Vercel                                              |

---

## 開發規範

### 程式碼風格

- 所有 UI 文字使用繁體中文
- 元件使用 PascalCase 命名
- Supabase 伺服器端用 `@/lib/supabase/server`，客戶端用 `@/lib/supabase/client`

### 安全性規範

- 金鑰與憑證絕對不可寫入程式碼，一律透過環境變數管理（`.env.local`）。
- 錯誤訊息不可洩漏敏感資訊（stack trace、DB 結構、內部 ID）。
- 使用參數化查詢，禁止字串拼接 SQL。
- 定期執行 `npm audit` 檢查已知漏洞。

### 程式碼品質規範

- 禁止 debug log 出現在正式程式碼中（`console.log`）。
- 所有非同步操作必須妥善處理錯誤（try-catch）。
- Immutable 資料更新：一律使用 spread operator 或 map/filter，不可直接 mutate state。

### Supabase 查詢規範

- 資料查詢邏輯集中管理，不直接在 component 中散落查詢。
- 所有查詢結果須對應型別定義。
- 撰寫查詢前必須先查看型別定義檔（`src/types/database.ts`），嚴禁憑空猜測欄位名稱。
- RLS 政策已啟用，撰寫查詢時需考慮使用者身份與資料權限。

### Supabase Migration 規範

- 每次 schema 變更都必須建立 migration 檔案，不可直接在 Dashboard 手動修改。
- Schema 變更（DDL）與資料變更（DML）必須分開為不同 migration 檔案。
- 已上線的 migration 檔案不可修改或刪除；若需修正，建立新的 migration。
- 大型資料表的索引建立使用 `CREATE INDEX CONCURRENTLY`。

### Stripe 規範

- Stripe webhook 必須驗證簽名（`stripe.webhooks.constructEvent`）。
- 訂閱狀態以 Supabase DB 為唯一真相來源，不從 Stripe SDK 即時查詢判斷。
- 數量限制（如免費方案履歷上限）必須在 DB 層用 SECURITY DEFINER 函式實作，前端檢查僅為 UX 輔助。

### 資料庫安全規範

- 所有涉及使用者資料的資料表必須啟用 Row Level Security（RLS）。
- 數量限制必須在 DB 層實作 SECURITY DEFINER 函式，前端檢查僅為 UX 輔助。
- 使用 middleware 保護需要認證的路由。

---

## Commands

```bash
npm run dev      # 開發模式
npm run build    # 建置
npm run lint     # 檢查程式碼
```

### Supabase Schema 變更流程

```bash
npx supabase migration new add_some_feature     # 1. 產生 migration
# 2. 撰寫 SQL（DDL 與 DML 分開）
npx supabase db push                             # 3. 部署 production
# 4. 重新產生型別
npx supabase gen types typescript --local > src/types/database.ts
```

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/                    # 多語系根（zh-TW 預設、en）
│   │   ├── (auth)/                  # login, register
│   │   ├── (dashboard)/             # dashboard, jobs, resume, cover-letter, interview, analytics, settings
│   │   ├── privacy/                 # 隱私權政策
│   │   ├── terms/                   # 服務條款
│   │   ├── error.tsx                # locale 層級錯誤邊界
│   │   ├── not-found.tsx            # locale 層級 404
│   │   └── layout.tsx               # html/body + NextIntlClientProvider + metadata
│   ├── api/                         # account, auth, cover-letter, interview, jobs, profile, resume, stripe, tokens
│   ├── icon.tsx                     # 32×32 favicon（ImageResponse 動態產生）
│   ├── apple-icon.tsx               # 180×180
│   ├── opengraph-image.tsx          # 1200×630 OG card
│   ├── twitter-image.tsx
│   ├── sitemap.ts                   # 動態 sitemap（多語系）
│   ├── robots.ts
│   ├── global-error.tsx             # 根層級錯誤（含 html/body）
│   ├── not-found.tsx                # 根層級 404 fallback
│   ├── globals.css                  # 品牌 CSS 變數 + 微擬物工具類
│   └── layout.tsx                   # passthrough root layout
├── components/
│   ├── ui/                          # Button, Card, Input, LottieSpinner, LocaleSwitcher
│   ├── layout/                      # Navbar, Footer, DashboardShell, DashboardSidebar
│   ├── landing/                     # Hero, Features, Pricing, CTA
│   ├── dashboard/                   # JobsBoard, JobDetail, ResumeEditor, CoverLetterEditor, Create/Upgrade/Cancel/Delete 等按鈕
│   └── interview/                   # InterviewRunner, VoiceRecorder, RadarChart, QuestionBankList 等
├── content/
│   └── legal/                       # privacy / terms 的 zh-TW 與 en content 模組
├── i18n/                            # next-intl 設定（routing, navigation, request）
├── lib/
│   ├── supabase/                    # client.ts, server.ts, middleware.ts
│   ├── interview/                   # generate-questions / drill-down / hint / evaluate-session
│   ├── auth/                        # verify-api-token
│   ├── gemini.ts                    # Gemini client + withGeminiRetry（指數退避）
│   ├── generate-cover-letter.ts
│   ├── optimize-resume.ts
│   ├── parse-job.ts
│   ├── parse-resume-pdf.ts
│   ├── stripe.ts
│   ├── theme.ts                     # 品牌常數（色彩、間距、陰影）
│   └── validations.ts               # Zod schemas
├── store/                           # auth.ts, jobs.ts
├── types/                           # database.ts, resume.ts, interview.ts
└── middleware.ts                    # Supabase session + next-intl locale（matcher 排除靜態副檔名）
messages/
├── zh-TW.json
└── en.json
public/
└── loading.lottie                   # Button loading 動畫資產
supabase/
└── migrations/                      # SQL migration 檔案
```

---

## 品牌設計

- **設計風格**：Calm & Trustworthy（沈穩信賴與微擬物風），詳見 `BRAND_GUIDELINES.md`
- **主色**：靜謐鼠尾草綠 `#688F79`，背景：暖燕麥白 `#FCFBF9`，強調：柔赤陶 `#D97D54`
- **微擬物陰影**：使用 `shadow-neu`、`shadow-neu-hover`、`shadow-neu-inset` 工具類
- **品牌常數**：所有色彩、間距、陰影引用 `src/lib/theme.ts`，禁止硬編碼色票值
- **文案語氣**：專業但溫暖，用「你」不用「您」，鼓勵但不空洞，去焦慮化

---

## Key Business Rules

- **免費方案**：職缺追蹤無限、最多 3 份履歷、基本分析
- **Pro 方案**：US$9.99/月（Stripe 月循環），無限 AI 功能、無限履歷、進階分析、AI 面試模擬
- 訂閱狀態流程：`用戶購買 → Stripe → Webhook → Supabase DB 更新 → App 讀取 DB 判斷權限`
- 訂閱狀態值：`free`（免費）、`pro`（訂閱中）

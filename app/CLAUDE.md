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

## Tech Stack

| 領域        | 技術                               |
| ----------- | ---------------------------------- |
| 框架        | Next.js 16 (App Router)            |
| 語言        | TypeScript (strict mode)           |
| 樣式        | Tailwind CSS v4                    |
| 後端/資料庫 | Supabase (Auth + PostgreSQL + RLS) |
| 支付        | Stripe (Subscription)              |
| 狀態管理    | Zustand                            |
| 表單        | React Hook Form + Zod              |
| 圖示        | Lucide React                       |
| 部署        | Vercel                             |

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
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認證相關頁面（login, register）
│   ├── (dashboard)/       # 登入後功能頁面（dashboard, jobs, resume, cover-letter, settings）
│   └── api/               # API Routes（auth/callback, stripe/webhook, stripe/checkout）
├── components/
│   ├── ui/                # 通用 UI 元件
│   ├── layout/            # 佈局元件（Navbar, Footer, DashboardSidebar）
│   ├── landing/           # 首頁元件（Hero, Features, Pricing, CTA）
│   └── dashboard/         # 儀表板元件（JobsBoard）
├── lib/
│   ├── supabase/          # Supabase 客戶端（client.ts, server.ts, middleware.ts）
│   ├── stripe.ts          # Stripe 設定
│   └── theme.ts           # 品牌設計系統常數（色彩、間距、陰影）
├── store/                 # Zustand 狀態管理（auth.ts, jobs.ts）
└── types/                 # TypeScript 型別定義（database.ts）
supabase/
└── migrations/            # SQL migration 檔案
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
- **Pro 方案**：NT$299/月，無限 AI 功能、無限履歷、進階分析
- 訂閱狀態流程：`用戶購買 → Stripe → Webhook → Supabase DB 更新 → App 讀取 DB 判斷權限`
- 訂閱狀態值：`free`（免費）、`pro`（訂閱中）

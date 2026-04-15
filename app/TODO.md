# TODO：Offery 待辦事項

**最後更新**：2026-04-13
**收費模式**：免費 + 訂閱制（Stripe，NT$299/月）

---

## 已決策（無需再討論）

| 項目         | 決策結果                    |
| ------------ | --------------------------- |
| 支付方案     | Stripe 訂閱制               |
| 訂閱狀態來源 | Supabase DB 唯一真相        |
| 數量限制     | DB 層 SECURITY DEFINER 強制 |
| 狀態管理     | Zustand                     |
| 資料驗證     | Zod                         |
| 部署         | Vercel                      |

---

## 已完成

### 專案初始化

- [x] Next.js 16 + TypeScript + Tailwind CSS v4 專案建立
- [x] Supabase client/server/middleware 設定
- [x] Stripe 整合設定
- [x] Zustand store（auth, jobs）
- [x] TypeScript 型別定義（database.ts）
- [x] CLAUDE.md / PRD.md / TODO.md / BRAND_GUIDELINES.md 文件建立

### Landing Page

- [x] Navbar（響應式，含手機選單）
- [x] Hero Section（標語 + CTA）
- [x] Features Section（6 大功能卡片）
- [x] Pricing Section（免費 vs Pro）
- [x] CTA Section
- [x] Footer

### 認證系統

- [x] Email + 密碼登入頁
- [x] Email 註冊頁（含確認信流程）
- [x] Google OAuth 登入
- [x] Auth callback route
- [x] Middleware 路由保護（未登入 → /login，已登入 → /dashboard）

### Dashboard

- [x] Dashboard layout（側邊欄 + 主區域）
- [x] Dashboard 總覽（統計卡片 + 快速操作）
- [x] 職缺追蹤看板（5 欄 Kanban + 新增表單 + 狀態切換）
- [x] 履歷管理頁（列表 + 空狀態）
- [x] 求職信管理頁（列表 + 空狀態）
- [x] 設定頁（個人資料 + 訂閱狀態）

### 品牌設計系統

- [x] BRAND_GUIDELINES.md 品牌白皮書（Calm & Trustworthy 微擬物風）
- [x] `src/lib/theme.ts` Theme 常數檔（色彩、間距、圓角、陰影）
- [x] `globals.css` 品牌 CSS 變數 + 微擬物工具類（shadow-neu）

### 後端

- [x] Supabase migration（5 資料表 + RLS + Triggers）
- [x] Supabase migration（resume limit SECURITY DEFINER）
- [x] Stripe Checkout API route
- [x] Stripe Webhook API route（訂閱建立/取消）

---

## 🔍 程式碼審查結果（2026-04-13）

> 以下為靜態程式碼審查發現的問題，依嚴重程度分類。

### 🔴 必須修復（影響安全/功能）

- [x] **Middleware 路由保護漏洞** — 已修復，`protectedPaths` 現在涵蓋 `/dashboard`、`/jobs`、`/resume`、`/cover-letter`、`/settings`
- [x] **Stripe webhook 缺少 `customer.subscription.updated` 處理** — 已新增，`active`/`trialing` → pro，其餘狀態 → free

### 🟡 建議改善

- [x] Dashboard 快速操作使用原生 `<a>` 而非 Next.js `<Link>`，導致全頁重新載入 — `src/app/(dashboard)/dashboard/page.tsx:104-119`（審查時已修復）
- [x] 設定頁「升級 Pro」按鈕無 onClick handler，未串接 Stripe Checkout — `src/app/(dashboard)/settings/page.tsx:64`（先前已修復）
- [x] Google OAuth 的 `signInWithOAuth` 沒有 error handling — `src/app/(auth)/login/page.tsx:37-44`
- [x] Stripe Webhook 未檢查 Supabase 更新結果，失敗時仍回傳 200 — `src/app/api/stripe/webhook/route.ts:39-41`
- [x] Stripe Checkout route 缺少 try-catch，Stripe API 錯誤直接 500 — `src/app/api/stripe/checkout/route.ts:37-48`

### ✅ 審查通過項目

- Landing Page 6 區塊全部正確引用，響應式 class 完整
- 資料表結構 5 張表與 TypeScript 型別（`database.ts`）完全一致
- RLS 政策覆蓋完整（5 張表皆啟用，CRUD policy 齊全）
- `check_resume_limit` SECURITY DEFINER 邏輯正確（Pro 無限、Free < 3）
- Auth callback、登入/註冊流程邏輯正確
- JobsBoard 5 欄看板 + 新增/切換狀態正確
- Trigger 正確（`handle_new_user` 自動建立 profile、`handle_updated_at` 5 張表皆掛載）

---

## 🔴 高優先（阻擋上線）

- [x] **修復 Middleware 路由保護漏洞**（見審查結果）
- [x] **補充 Stripe webhook `subscription.updated` 處理**（見審查結果）
- [x] 設定 Supabase 專案並執行 migration
- [x] 設定 Stripe 產品與價格（Pro 方案 NT$299/月）
- [x] 填入 `.env.local` 所有環境變數
- [x] SECURITY DEFINER：`check_resume_limit(user_id)` — 免費方案履歷上限 3 份（migration 已建立，已部署）
- [x] 設定頁「升級 Pro」按鈕串接 Stripe Checkout
- [x] 設定頁「變更方案」功能-讓使用者取消訂閱
- [x] 帳號刪除功能（隱私權要求）
- [ ] Stripe 從沙盒測試環境轉換為正式環境

---

## 🟡 中優先（核心體驗完善）

- [x] 履歷編輯器（結構化表單：個人資訊、學歷、工作經歷、技能）
- [x] 求職信編輯器（富文字編輯）
- [x] 職缺詳情頁（薪資、備註、關聯履歷、職缺描述）
- [x] 職缺看板拖拉排序（drag & drop）
- [x] 職缺搜尋與篩選功能
- [x] 個人資料編輯表單
- [x] 履歷預覽 / PDF 匯出
- [x] Dashboard 快速操作 `<a>` 改為 `<Link>`（見審查結果）
- [x] Google OAuth error handling（見審查結果）
- [x] Stripe Checkout route 加入 try-catch（見審查結果）
- [x] Stripe Webhook 檢查 Supabase 更新結果（見審查結果）

---

## 🟠 安全邊際（穩定性 — 防止攻擊與錯誤）

- [x] 所有 API Routes 加入錯誤處理與適當的 HTTP 狀態碼
- [x] Rate limiting（API Routes）— 依賴 Vercel 內建 DDoS 防護 + Supabase 限流，未來可用 Upstash Redis
- [x] 輸入驗證（Zod schema）— 所有使用者輸入
- [x] XSS 防護確認（React 自動轉義 + job_url 協議檢查）
- [x] CSRF 防護確認（Supabase SameSite=Lax cookies + POST/PATCH only）

---

## 🔵 功能開發（依階段排序）

### v1.1

- [ ] 人脈管理 CRM（聯絡人 CRUD、關聯職缺、追蹤提醒）
- [x] 求職數據分析圖表（投遞轉換率、面試成功率、時間軸）
- [x] Dashboard 最近活動列表（取代佔位文字）

### v2.0

- [ ] AI 履歷優化（職缺關鍵字比對、ATS 評分 0-100）
- [ ] AI 求職信生成器（根據職缺 + 履歷自動產生）
- [ ] 職缺描述解析（自動擷取公司、職位、薪資、技能需求）

### v3.0

- [ ] Chrome 擴充套件（一鍵從 104/CakeResume/LinkedIn 儲存職缺）
- [ ] AI 面試模擬練習（根據職缺產生題目）
- [ ] 薪資情報整合
- [ ] 多語言支援（English）

---

## 🟢 低優先（上線前完成即可）

- [ ] 品牌套用：所有現有頁面套用品牌色彩（替換 indigo-600 → 品牌主色 #5B6ABF）
- [ ] 品牌套用：Dashboard 卡片套用微擬物陰影（shadow-neu）
- [ ] 品牌套用：Landing Page 背景套用暖奶白（#FAF8F5）
- [ ] 封裝 UI 元件：Button（主要/次要/文字/危險）
- [ ] 封裝 UI 元件：Card（微擬物卡片）
- [ ] 封裝 UI 元件：Input（微凹陷輸入框）
- [ ] Landing Page SEO 優化（meta tags, OG image, sitemap.xml）
- [ ] 404 / 500 錯誤頁面
- [ ] Loading skeleton / spinner
- [ ] 響應式微調（平板尺寸）
- [ ] Favicon + OG image 設計
- [ ] 隱私權政策頁面
- [ ] 服務條款頁面

---

## 🗺️ 未來版本路線圖

### v1.1（上線後 1 個月）

- 履歷編輯器 + PDF 匯出
- 求職信編輯器
- 人脈管理 CRM
- 數據分析圖表

### v2.0（上線後 3 個月）

- AI 履歷優化 + ATS 評分
- AI 求職信生成器
- 職缺描述智慧解析

### v3.0（上線後 6 個月）

- Chrome 擴充套件
- AI 面試模擬
- 多語言支援

---

## 畫面開發進度

| 畫面         | 路徑            | 狀態                        |
| ------------ | --------------- | --------------------------- |
| Landing Page | `/`             | ✅ 完成                     |
| 登入         | `/login`        | ✅ 完成                     |
| 註冊         | `/register`     | ✅ 完成                     |
| Dashboard    | `/dashboard`    | ✅ 完成                     |
| 職缺追蹤     | `/jobs`         | ✅ 基本完成（缺拖拉、搜尋） |
| 履歷管理     | `/resume`       | ✅ 完成                     |
| 求職信       | `/cover-letter` | ✅ 完成                     |
| 設定         | `/settings`     | ✅ 完成                     |
| 數據分析     | `/analytics`    | ✅ 完成                     |
| 人脈管理     | `/contacts`     | ⬜ 未開始                   |

---

## 🙋 需要手動處理的項目（AI 無法代勞）

### Supabase Console

- [x] 建立 Supabase 專案
- [x] 執行 migration SQL
- [x] 啟用 Google OAuth Provider
- [x] 取得 Supabase URL + Anon Key + Service Role Key

### Stripe Dashboard

- [x] 建立 Stripe 帳號
- [x] 建立 Pro 方案產品與價格（美金$9.99/月）
- [x] 設定 Webhook endpoint（指向 `/api/stripe/webhook`）
- [x] 取得 Secret Key + Publishable Key + Webhook Secret + Price ID

### Vercel

- [x] 建立 Vercel 專案
- [x] 設定環境變數
- [x] 連接 GitHub repo
- [x] 設定自訂網域（選用）

### 其他

- [ ] 撰寫隱私權政策（獨立網頁部署）
- [ ] 撰寫服務條款
- [ ] 設計 Logo / Favicon / OG image

# TODO：JobHunter 待辦事項

**最後更新**：2026-04-11
**收費模式**：免費 + 訂閱制（Stripe，NT$299/月）

---

## 已決策（無需再討論）

| 項目 | 決策結果 |
|------|---------|
| 支付方案 | Stripe 訂閱制 |
| 訂閱狀態來源 | Supabase DB 唯一真相 |
| 數量限制 | DB 層 SECURITY DEFINER 強制 |
| 狀態管理 | Zustand |
| 資料驗證 | Zod |
| 部署 | Vercel |

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

## 🔴 高優先（阻擋上線）

- [ ] 設定 Supabase 專案並執行 migration
- [ ] 設定 Stripe 產品與價格（Pro 方案 NT$299/月）
- [ ] 填入 `.env.local` 所有環境變數
- [x] SECURITY DEFINER：`check_resume_limit(user_id)` — 免費方案履歷上限 3 份（migration 已建立，待部署）
- [ ] 設定頁「升級 Pro」按鈕串接 Stripe Checkout
- [ ] 帳號刪除功能（隱私權要求）

---

## 🟡 中優先（核心體驗完善）

- [ ] 履歷編輯器（結構化表單：個人資訊、學歷、工作經歷、技能）
- [ ] 求職信編輯器（富文字編輯）
- [ ] 職缺詳情頁（薪資、備註、關聯履歷、職缺描述）
- [ ] 職缺看板拖拉排序（drag & drop）
- [ ] 職缺搜尋與篩選功能
- [ ] 個人資料編輯表單
- [ ] 履歷預覽 / PDF 匯出

---

## 🟠 安全邊際（穩定性 — 防止攻擊與錯誤）

- [ ] 所有 API Routes 加入錯誤處理與適當的 HTTP 狀態碼
- [ ] Rate limiting（API Routes）
- [ ] 輸入驗證（Zod schema）— 所有使用者輸入
- [ ] XSS 防護確認（特別是職缺描述、備註等富文字欄位）
- [ ] CSRF 防護確認

---

## 🔵 功能開發（依階段排序）

### v1.1
- [ ] 人脈管理 CRM（聯絡人 CRUD、關聯職缺、追蹤提醒）
- [ ] 求職數據分析圖表（投遞轉換率、面試成功率、時間軸）
- [ ] Dashboard 最近活動列表（取代佔位文字）

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

| 畫面 | 路徑 | 狀態 |
|------|------|------|
| Landing Page | `/` | ✅ 完成 |
| 登入 | `/login` | ✅ 完成 |
| 註冊 | `/register` | ✅ 完成 |
| Dashboard | `/dashboard` | ✅ 完成 |
| 職缺追蹤 | `/jobs` | ✅ 基本完成（缺拖拉、搜尋） |
| 履歷管理 | `/resume` | ⬜ 列表完成，缺編輯器 |
| 求職信 | `/cover-letter` | ⬜ 列表完成，缺編輯器 |
| 設定 | `/settings` | ⬜ 顯示完成，缺編輯與升級 |
| 人脈管理 | `/contacts` | ⬜ 未開始 |

---

## 🙋 需要手動處理的項目（AI 無法代勞）

### Supabase Console
- [ ] 建立 Supabase 專案
- [ ] 執行 migration SQL
- [ ] 啟用 Google OAuth Provider
- [ ] 取得 Supabase URL + Anon Key + Service Role Key

### Stripe Dashboard
- [ ] 建立 Stripe 帳號
- [ ] 建立 Pro 方案產品與價格（NT$299/月）
- [ ] 設定 Webhook endpoint（指向 `/api/stripe/webhook`）
- [ ] 取得 Secret Key + Publishable Key + Webhook Secret + Price ID

### Vercel
- [ ] 建立 Vercel 專案
- [ ] 設定環境變數
- [ ] 連接 GitHub repo
- [ ] 設定自訂網域（選用）

### 其他
- [ ] 撰寫隱私權政策（獨立網頁部署）
- [ ] 撰寫服務條款
- [ ] 設計 Logo / Favicon / OG image

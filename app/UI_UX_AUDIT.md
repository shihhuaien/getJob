# Offery UI/UX 設計審查報告

> 以資深 UI/UX 設計師視角，對 Offery（智慧求職平台）進行系統性設計審查。
>
> 本文件為**審查紀錄**，列出優化建議與實作批次，並非已完成的變更紀錄。實作時請建立獨立 PR 並更新 `TODO.md`。

## 目錄

- [脈絡](#脈絡)
- [一、品牌識別](#一品牌識別brand-identity)
- [二、按鈕 Hover 與互動設計](#二按鈕-hover-與互動設計buttons--micro-interactions)
- [三、畫面變化絲滑度](#三畫面變化絲滑度motion--transitions)
- [四、新手教學 / Onboarding](#四新手教學--onboarding最大改善空間)
- [五、狀態回饋](#五狀態回饋feedback-systems)
- [六、無障礙](#六無障礙accessibility)
- [七、資訊架構與導覽](#七資訊架構與導覽ia--navigation)
- [八、內容密度與視覺層級](#八內容密度與視覺層級information-density)
- [九、文案與品牌語氣](#九文案與品牌語氣microcopy)
- [優先級總覽](#優先級總覽建議實作順序)
- [受影響的關鍵檔案](#受影響的關鍵檔案)
- [驗證方式](#驗證方式)
- [實作紀律](#建議的實作紀律)

---

## 脈絡

本審查依據 `BRAND_GUIDELINES.md`（377 行完整設計系統）、`CLAUDE.md`（「禁止硬編碼色票值」原則）及實際程式碼實作進行對照，列出**改善項目並附優先級**，讓後續可按批次實作。

**設計哲學**：Calm & Trustworthy（沈穩信賴）+ 微擬物風，主色靜謐鼠尾草綠 `#688F79`、背景暖燕麥白 `#FCFBF9`，核心目標是為求職者降低焦慮。

**目前專案已具備的優點**：

- 完整的品牌設計系統文件（`BRAND_GUIDELINES.md`）
- 一致的微擬物陰影工具類（`shadow-neu`、`shadow-neu-hover`、`shadow-neu-inset`、`shadow-neu-pressed`）
- 統一的 Button / Card / Input 元件 API
- next-intl 雙語支援（zh-TW / en）
- 手機抽屜轉場已使用 `motion-safe` 與高品質 cubic-bezier
- ARIA 基礎無障礙（`aria-label`、`aria-expanded`、`aria-modal`、Escape 關閉）

---

## 一、品牌識別（Brand Identity）

### 1.1 【高】色彩變數落實不一致，違反自己的設計規範

`CLAUDE.md` 明定「禁止硬編碼色票值」，但多處仍用 Tailwind 原生灰階。

**證據**：

- `src/components/ui/Card.tsx:75` — `CardTitle` 用 `text-gray-900`（應為 `text-[color:var(--color-text)]`）
- `src/components/ui/Card.tsx:89` — `CardDescription` 用 `text-gray-500`（應為 `text-[color:var(--color-text-light)]`）
- `src/components/landing/HeroSection.tsx:25,31,51` — `text-gray-900 / gray-600 / gray-500`
- `src/app/[locale]/(dashboard)/dashboard/page.tsx:66-67,113,116,134-136,146,150,153,159,170,177,183,186,190,197` — 大量 `text-gray-*`、`border-gray-200`、`hover:bg-gray-50`
- `src/components/ui/Button.tsx:28` — Danger 變體 `bg-[#D96B6B]` 硬編碼（應為 `var(--color-error)`）
- `src/components/ui/Input.tsx:16,31` — 錯誤色 `#D96B6B` 硬編碼

**建議**：

- 在 `@theme inline` 新增 `--color-text`、`--color-text-light`、`--color-text-placeholder`、`--color-error`、`--color-success`、`--color-warning`、`--color-info`、`--color-accent`，讓 `text-error`、`bg-error` 等工具類可直接使用（Tailwind v4 的 `@theme` 會自動產生）
- 一次性替換全站 `text-gray-900 → text-[color:var(--color-text)]`（grep + 批次修改）
- 建立 ESLint 自訂規則或 codemod 攔截 `text-gray-*` / `bg-gray-*` / `border-gray-*`

### 1.2 【中】Logo 與品牌記憶點過於中性

目前 Logo 已是 `/brand/logo-mark.svg`（不再是 lucide 的 Briefcase），但品牌 lockup（符號+字標）僅簡單並列 `logo-mark` + `Offery` 文字，缺乏：

- 符號與字標的比例、間距 token 化（`BRAND_GUIDELINES.md` 應補 clear-space 規範）
- 反白 / 單色版本（mobile PWA icon、email signature、外部合作素材）
- 品牌動態 Logo 或 app 啟動動畫（即使只有 400ms 淡入 + 筆畫描繪，也能顯著加深記憶）

**建議**：

- 建立 `/brand/logo-mark-white.svg`、`/brand/logo-mark-mono.svg`、`/brand/logo-lockup.svg`
- 在 `BRAND_GUIDELINES.md` 補「Logo clear space = 符號高度 × 0.25」「最小使用尺寸 20px」
- Landing 首次載入時 Hero 區加入輕量筆畫動畫（SVG stroke-dasharray）

### 1.3 【低】Favicon / OG image 可再提升記憶度

目前 `icon.tsx`、`opengraph-image.tsx` 使用 `ImageResponse` 動態生成。可確認：

- Favicon 是否有深色模式版本（prefers-color-scheme）
- OG image 文案是否與首頁 Hero 對齊（品牌 voice 一致）

---

## 二、按鈕 Hover 與互動設計（Buttons & Micro-interactions）

### 2.1 【高】Hover 缺乏「抬升感」，與微擬物風格未充分呼應

現行 Button hover 僅有 `bg` + `shadow-neu → shadow-neu-hover`（`src/components/ui/Button.tsx:23,25,28`），沒有垂直位移或縮放回饋。微擬物設計的靈魂是「可觸摸的物體感」，沒有位移會讓 hover 感覺扁平。

**建議（於 `Button.tsx` base class 加上）**：

```
transition-all duration-200 ease-out
hover:-translate-y-0.5  active:translate-y-0
active:scale-[0.98]
motion-reduce:transform-none
```

- Hover 抬升 `-translate-y-0.5`（2px）+ `shadow-neu-hover` = 物體被吸起
- Active `scale-[0.98]` + `shadow-neu-pressed` = 按下塌陷
- 對應 `prefers-reduced-motion: reduce` 時關閉 transform

### 2.2 【中】Ghost 按鈕焦點狀態過弱

`variant: ghost`（`Button.tsx:26`）只有 hover 背景、focus-ring 靠基類。鍵盤使用者聚焦時若遇到低對比背景可能看不見 ring。

**建議**：`focus-visible:bg-brand-50`（與 hover 同步）+ 更厚 `focus-visible:ring-[2.5px]`

### 2.3 【中】Transition duration 全站不一致

- Button / Card / Input: 150ms
- Navbar icon rotate: 200ms
- 手機抽屜: 280ms
- 遮罩 opacity: 300ms

建議建立三級節奏 token：

```css
--motion-fast: 150ms; /* 小型色彩切換 */
--motion-base: 220ms; /* 按鈕、卡片狀態 */
--motion-slow: 320ms; /* 面板、抽屜、頁面 */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
```

全站 `duration-150 → duration-[var(--motion-base)]`，視覺節奏立刻統一。

### 2.4 【中】Card `hoverable` 與 Button 觸覺回饋級距重疊

兩者都只是 shadow 改變，使用者分不清「這是可點擊卡片」vs「這是按鈕」。

**建議**：`Card variant="hoverable"` 加 `hover:-translate-y-1`（比按鈕再明顯一點）+ `cursor-pointer`，形成「卡片 > 按鈕 > 連結文字」三級互動語彙。

### 2.5 【低】Danger 按鈕色階可再柔化

當前 `#D96B6B → #C65959` hover。對「沈穩、去焦慮」的品牌調性而言稍顯刺激，可改為 `#D96B6B` + hover 時 `shadow-neu-hover` + 次要色內收（不加深紅色飽和度）。

---

## 三、畫面變化絲滑度（Motion & Transitions）

### 3.1 【高】缺乏頁面層級轉場（Next.js 16 的機會）

目前路由切換是 instant，無過渡。Next.js 16 已支援 **View Transitions API**，幾乎零成本就能得到原生級別的跨頁動畫。

**建議**：

- 在 `src/app/[locale]/layout.tsx` 啟用 View Transitions（Next.js 16 的 `unstable_ViewTransition`）
- 主要 page headline 加 `style={{ viewTransitionName: 'page-title' }}`，由列表頁 → 詳情頁會有平滑 morph
- 儀表板側欄項目切換時，主內容區 180ms cross-fade

### 3.2 【中】列表與卡片進場無層次感

`/jobs`、`/resume`、`/cover-letter` 的卡片是瞬間全部出現。

**建議**：

- 使用 CSS `@starting-style` + `animation-delay: calc(var(--i) * 40ms)` 做 stagger
- 或用 Framer Motion 的 `staggerChildren: 0.04`
- 首屏 4-6 個項目有階梯感，後續即時出現即可

### 3.3 【中】Loading 骨架屏覆蓋率不足

僅 `(dashboard)/loading.tsx` 有骨架，其他路由 fallback 空白。

**證據**：

- `app/src/app/[locale]/(dashboard)/loading.tsx` 僅做 dashboard 首頁骨架
- `/jobs`、`/resume`、`/cover-letter`、`/interview`、`/analytics` 各自的 `loading.tsx` 缺失

**建議**：

- 為每個 dashboard 子路由建立對應 `loading.tsx` 骨架（卡片列表、表格、編輯器各自的版型）
- 骨架色改用 `bg-[var(--color-brand-100)]/40` 而非 `bg-gray-200`，降低視覺噪音
- `animate-pulse` 改為自訂 shimmer（左到右漸層掃過），比單純閃爍更有質感

### 3.4 【低】面試報告 Radar chart 出現瞬間

`InterviewReport` 的雷達圖一次性渲染。可加 0.6s 的「從中心點向外擴張」動畫，放大「成果揭曉」的情緒峰值，提升使用者完成面試後的成就感。

### 3.5 【低】Hero 背景裝飾過於靜態

`HeroSection.tsx:15` 的 blur circle 永遠在原地。可加入**非常緩慢**（30s+）的呼吸縮放（1.0 → 1.05 → 1.0）+ 微漂移，傳達「平靜有活力」的品牌情緒，但絕不能搶視線。

---

## 四、新手教學 / Onboarding（最大改善空間）

這是目前**最明顯的 UX 缺口**。使用者註冊完成後直接被丟到空的 dashboard，沒有任何引導。

### 4.1 【高】首次登入缺 Welcome 流程

**現狀**：註冊 → 確認信 → 登入 → 進 dashboard 顯示「尚無活動」。

**建議三段式 onboarding**：

1. **首登 Modal**（3 步驟，可 skip）：
   - Step 1: 歡迎 + 價值主張（「我們會陪你追蹤每份申請，並用 AI 幫你優化履歷」）
   - Step 2: 讓使用者選擇「求職狀態」（積極找工作 / 被動觀望 / 剛畢業 / 轉職中）— 收集個人化資料，也讓使用者感受被理解
   - Step 3: 設定「目標職稱 / 產業」— 後續 AI 面試題庫可依此推薦
2. **引導性第一動作**：完成 onboarding 後 dashboard 顯示 **3 張 Next-step 卡片**：
   - 「新增第一份追蹤職缺」（含貼 JD 自動解析示範）
   - 「上傳或建立第一份履歷」
   - 「試試 3 分鐘 AI 模擬面試」
3. **進度徽章**：以漸進方式達成 4 項核心動作（追蹤 1 份職缺 / 建立履歷 / 生成 Cover Letter / 完成模擬面試），用柔和進度條呈現（「你已完成 2/4 關鍵設定」），而非炫耀式遊戲化。

**實作建議**：

- 不引入 joyride / shepherd（品牌風格偏沈穩），自建 `<OnboardingModal>` + `<NextStepCards>` 組件即可
- 新增 `profile.onboarding_completed_at` 欄位（Supabase migration）
- Dashboard 根據此欄位條件渲染

### 4.2 【高】Empty State 全面缺失

查核所列位置目前僅用一句「尚無活動」灰字處理：

- `app/src/app/[locale]/(dashboard)/dashboard/page.tsx:197` — Recent Activity
- JobsBoard 5 個 Kanban 欄位的空欄（需實際檢視）
- Resume / Cover Letter 無資料時
- Interview 報告列表無資料時
- Analytics 無資料時

**建議每個空狀態 = 圖示 + 一句暖心文案 + 主要 CTA**（三段式）：

```
[圖示] 還沒有追蹤的職缺
   貼上職缺連結，我們會用 AI 幫你抓出重點
   [+ 新增第一份職缺]
```

- 圖示可用 Lucide 線條圖或輕量 Lottie（`/public` 已有 loading.lottie 的既有設定）
- 文案遵循 `BRAND_GUIDELINES.md` 的「用『你』不用『您』，去焦慮化」

### 4.3 【中】複雜功能缺少情境提示

- **AI 解析職缺 Modal**：使用者第一次貼 JD 時，不知道要貼整段還是只貼連結。
- **AI 面試模擬**：進入 `/interview/[id]` 前沒有「會開啟麥克風 / 鏡頭」「預計需要 X 分鐘」的預告頁。
- **履歷編輯器**：分頁式編輯（個人/學經歷/技能）沒有完成度提示。

**建議**：

- Modal / 功能入口加 Contextual Tooltip（首次進入時顯示，已看過則收起，用 localStorage 記住）
- Interview 增加「準備頁」：檢查麥克風 / 鏡頭 / 預計時長 / 本次 5 題題型分布
- Resume editor 加進度條 `3/5 段落已填寫`

### 4.4 【中】錯誤訊息偏技術性且缺乏救援路徑

目前錯誤處理模式（`{error && <p className="text-red-600">{error}</p>}`）只回報「哪裡錯」，沒告訴使用者「怎麼辦」。

**建議**：

- 所有錯誤訊息改為 `{問題} + {下一步建議}`
  - ❌「Email 已被註冊」
  - ✅「這組 Email 已經有帳號了。你可以 [登入] 或 [忘記密碼]」
- API 429 / 5xx 引入統一「系統忙線，正在重試…」inline banner，而非彈 alert

---

## 五、狀態回饋（Feedback Systems）

### 5.1 【高】缺少 Toast 通知系統

全站所有成功 / 錯誤都靠 inline state，導致：

- 儲存履歷後無確認訊息（只能靠 `router.refresh()` 觀察頁面變化）
- 長按鈕 loading 完成後沒有 closure（只回到 idle）
- 跨頁動作無法傳遞訊息（如「已刪除職缺」跳回列表頁）

**建議**：

- 引入 Sonner（輕量 4KB，與 Tailwind 配合良好）或自建 `<Toaster>` + Zustand store
- 套用至：儲存成功 / 刪除確認 / 錯誤重試 / AI 生成完成
- Toast 樣式延續神經形擬物：`shadow-neu` + 成功用 `--color-success`、錯誤用 `--color-error` 細左邊框

### 5.2 【中】表單驗證時機錯位

目前驗證僅在 submit 時觸發，使用者輸入錯誤 email 要按到送出才知道。

**建議**：

- React Hook Form 設定 `mode: "onBlur"`（失焦時驗證），`reValidateMode: "onChange"`
- 電子郵件 / 密碼強度可同步顯示即時指示燈（綠/橘/紅點）

### 5.3 【中】編輯器缺 Autosave 指示

Resume / Cover Letter Editor 是長時間編輯場景。

**建議**：

- 5 秒 debounce autosave → 右上角顯示 `已儲存於 12:03` / `儲存中…`
- 離開頁面未儲存時 `beforeunload` 提醒（已儲存則跳過）

### 5.4 【低】AI 生成過程缺「正在思考」訊息

目前 AI cover letter / 面試評估生成時只顯示 Lottie spinner。用戶等 8-15 秒看不到任何狀態更新容易焦慮。

**建議**：

- 串流（streaming）顯示 AI 逐字輸出（Gemini SDK 支援 `generateContentStream`）
- 若無法串流，至少輪播訊息：「分析職缺關鍵字…」→「對照你的履歷…」→「撰寫開頭段落…」

---

## 六、無障礙（Accessibility）

### 6.1 【高】Placeholder 顏色對比不足

`--color-text-placeholder: #9CA3AF` 在 `--color-bg: #FCFBF9` 上對比僅約 3.1:1，**小於 WCAG AA 要求的 4.5:1**。

**建議**：改為 `#7A7F88`（約 5.0:1），或僅將 placeholder 用於提示而非必要資訊（永遠有 `<Label>` 伴隨）。

### 6.2 【高】Button size=sm 觸控區域不足

`Button.tsx:32` — `sm: "h-8 px-3 text-xs"` = 32px 高，低於 Apple HIG / Material 的 44px 最低觸控區。

**建議**：

- `sm` 保留 `h-8` 但手機版自動升至 `h-10`（`sm:h-8` → `h-10 sm:h-8`）
- 或以 `::before { content: ''; position: absolute; inset: -6px; }` 擴大觸控判定

### 6.3 【中】Focus-visible 靠 shadow 切換，視障輔具可能漏判

Input `focus:shadow-neu-pressed` 對視覺使用者清楚，但螢幕放大鏡使用者可能看不清陰影差異。

**建議**：

- Input 聚焦時加 `focus:ring-2 focus:ring-brand-500 focus:ring-offset-2`
- 與 Button 一致，形成系統化焦點語彙

### 6.4 【中】缺 Skip-to-content 連結

鍵盤使用者每頁都要 Tab 過整個 Navbar。

**建議**：`layout.tsx` body 頂端加 `<a href="#main" className="sr-only focus:not-sr-only ...">跳至主要內容</a>`

### 6.5 【低】尚無 Dark mode

`globals.css` 只有 `:root`，但 CSS 變數架構已支援 dark mode。履歷編輯是長時間任務，夜間使用者受益明顯。

**建議（Phase 2）**：

- 新增 `[data-theme="dark"]` / `@media (prefers-color-scheme: dark)` 覆蓋變數
- 深色版背景 `#1A1D1B`、卡片 `#252927`、primary 保留 sage green（提升亮度至 `#8BAC96`）
- 微擬物陰影 dark 版本用更深黑色 `rgba(0,0,0,0.4)`

---

## 七、資訊架構與導覽（IA / Navigation）

### 7.1 【中】側邊欄 7 項未分組，隨功能增加會雜亂

`DashboardSidebar` 目前扁平列 7 項。

**建議分組**：

- **申請管理**：儀表板、職缺追蹤、分析
- **求職素材**：履歷、自傳
- **面試準備**：模擬面試、題庫
- **帳戶**：設定

用 `<SidebarSection title="...">` 包起來，更符合使用者心智模型。

### 7.2 【中】缺麵包屑與頁面層級指示

進到 `/resume/[id]` 或 `/jobs/[id]` 後，只能靠側邊欄高亮知道位置，無法直接「返回列表」。

**建議**：`<Breadcrumb>` 元件（履歷列表 › 我的履歷 A），並加 `<BackButton>` icon。

### 7.3 【低】缺全站搜尋與快捷鍵

Cmd+K 搜尋（Linear-style）可大幅提升重度使用者效率，但為低優先級，使用者量達成一定規模後再做。

---

## 八、內容密度與視覺層級（Information Density）

### 8.1 【中】Dashboard Stats Cards 可讀性中等

目前 4 張卡片用 `text-blue-600 bg-blue-100` 等 tailwind 色（`dashboard/page.tsx:88-107`），跟 sage green 品牌主色**脫鉤**，看起來像 Bootstrap 預設。

**建議**：

- 統一改為品牌衍生色階：tracking（brand-600）、resume（accent 赤陶）、cover-letter（secondary fog blue）、interview（success mint）
- Icon 容器改為 `shadow-neu-inset` 凹陷圓角，與整體微擬物一致

### 8.2 【低】JobsBoard Kanban 卡片密度可優化

5 個狀態欄在 1024px 以下會擠。建議：

- `<1280px` 改為水平滑動 + snap scroll
- 卡片顯示「last updated · 相對時間」而非絕對日期

---

## 九、文案與品牌語氣（Microcopy）

### 9.1 【中】按鈕文案偏功能性

目前「儲存」「刪除」「建立」「取消」等較冰冷。

**建議微調**（符合 `BRAND_GUIDELINES.md` 的「溫暖專業」）：

- 「儲存」→「已儲存」動作完成後切換文案
- 「刪除」確認 Modal：「這份履歷會永久消失，確定嗎？」（不只「確定刪除」）
- 「AI 產生自傳」→「讓 AI 幫你草稿」

### 9.2 【低】面試結束的慶祝文案

目前面試結束跳 report 頁，但缺「你完成了！」的情緒峰值瞬間。加一個 1.5s 的過渡頁（輕量 confetti 或柔和 Lottie 打勾），顯著提升體驗黏著度。

---

## 優先級總覽（建議實作順序）

### 🔴 批次 1：品牌一致性與按鈕手感（1-2 天）

修這些最小成本、最大視覺質感提升：

- [x] 1.1 CSS 變數全站替換（`text-gray-*` → `var(--color-text*)`）
- [x] 1.1 `@theme inline` 補齊 error/success/warning/info/accent/text 顏色 tokens
- [x] 2.1 Button hover 加 `-translate-y-0.5` + active `scale-[0.98]` + `motion-reduce:transform-none`
- [x] 2.3 建立 motion duration 三級 token 並套用
- [x] 2.4 Card hoverable 增加 translateY + cursor-pointer
- [x] 6.1 Placeholder 顏色改為 `#7A7F88`（WCAG AA）
- [x] 6.2 sm 按鈕 mobile 自動 `h-10`

### 🟡 批次 2：狀態回饋與空狀態（2-3 天）

- [x] 5.1 引入 Sonner 或自建 Toaster，全站串起成功 / 錯誤提示
- [x] 5.2 表單驗證改 onBlur
- [x] 4.2 為 6 個主要空狀態畫面建立 `<EmptyState>` 元件
- [x] 3.3 為每個 dashboard 子路由補 `loading.tsx` 骨架屏
- [x] 8.1 Dashboard stats cards 色彩對齊品牌色階

### 🟢 批次 3：Onboarding 完整流程（3-5 天）

- [x] 4.1 三步驟 Welcome Modal
- [x] 4.1 Dashboard 首次登入 Next-step 卡片
- [x] 4.1 進度徽章（4/4 關鍵設定）
- [x] 4.3 AI 面試準備頁 + 情境 Tooltip
- [x] 5.3 Resume / Cover Letter Autosave 指示
- [x] Supabase migration: `profile.onboarding_completed_at`、`profile.target_role`

### 🔵 批次 4：動效精緻化（1-2 天）

- [x] 3.1 啟用 Next.js 16 View Transitions
- [x] 3.2 列表 stagger 進場
- [x] 3.4 Interview radar chart 中心擴張動畫
- [x] 5.4 AI 生成改串流輸出（Gemini `generateContentStream`）
- [x] 9.2 面試完成慶祝過渡頁

### ⚪ 批次 5：資訊架構與進階無障礙（1-2 天）

- [x] 7.1 側邊欄分組
- [x] 7.2 Breadcrumb 元件
- [x] 6.3 Input 加 focus-visible ring
- [x] 6.4 Skip-to-content 連結
- [x] 1.2 Logo 多版本（反白/單色/lockup）

### 🟣 批次 6（長期）： Cmd+K / 其他

- [x] 7.3 Cmd+K 全站搜尋
- [x] 8.2 JobsBoard 響應式優化

---

## 受影響的關鍵檔案

| 類別             | 檔案                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 設計 Token       | `app/src/app/globals.css`、`app/src/lib/theme.ts`、`app/BRAND_GUIDELINES.md`                                                       |
| 核心元件         | `app/src/components/ui/Button.tsx`、`Card.tsx`、`Input.tsx`                                                                        |
| 新元件（需建立） | `ui/Toast.tsx`、`ui/EmptyState.tsx`、`ui/Breadcrumb.tsx`、`ui/OnboardingModal.tsx`、`ui/NextStepCards.tsx`、`ui/SkipToContent.tsx` |
| Layout           | `components/layout/Navbar.tsx`、`DashboardShell.tsx`、`DashboardSidebar.tsx`                                                       |
| Landing          | `components/landing/HeroSection.tsx`、`Features.tsx`、`Pricing.tsx`                                                                |
| Dashboard        | `app/[locale]/(dashboard)/dashboard/page.tsx` 與各子路由 `loading.tsx`                                                             |
| 資料層           | 新 Supabase migration: `add_onboarding_fields.sql`                                                                                 |
| 翻譯             | `messages/zh-TW.json`、`messages/en.json`（新增 empty state / onboarding / toast 文案）                                            |

---

## 驗證方式

1. **視覺一致性**：`grep -r "text-gray-" app/src/` 應回傳 0 筆；`grep -r "#D96B6B\|#C65959\|#9CA3AF" app/src/` 應全部換成 CSS 變數。
2. **Hover 手感**：桌機開 dev server，Tab 過所有按鈕 / 卡片，確認 hover 有 `-translate-y` 抬升且 active 有塌陷。
3. **動效節奏**：開 Chrome DevTools → Animations 面板，所有 transition duration 應只出現 `150 / 220 / 320ms` 三個值。
4. **無障礙**：
   - axe DevTools 掃首頁 + dashboard + 表單，應無 color-contrast error
   - 純鍵盤操作完整走一遍（Tab / Shift+Tab / Enter / Escape），所有互動元素都應可達
   - Lighthouse Accessibility 分數 ≥ 95
5. **新手流程**：註冊新帳號 → 觀察 onboarding 三步驟流暢度 → 完成後 dashboard 出現 Next-step 卡片 → 點一張「建立第一份履歷」→ 完成後徽章更新。
6. **視圖轉場**：列表 → 詳情 → 返回，觀察 headline morph 是否流暢。
7. **Toast 系統**：儲存履歷、刪除職缺、API 錯誤三種情境都應跳對應 toast 並自動消失（5s）。
8. **手機測試**：iPhone 12 / Pixel 7 真機開 Safari / Chrome，側邊欄抽屜、Button sm 觸控、所有表單輸入確認無問題。
9. **Dark mode（若實作）**：系統切換深色模式時，整站自動切換且對比度符合 WCAG AA。

---

## 建議的實作紀律

1. **每個批次獨立 PR**，避免混合導致 review 難度暴增。
2. **先做批次 1-2**，這兩批已能把視覺品質從 75 分拉到 90 分，CP 值最高。
3. **批次 3 Onboarding 需配合 PM / 文案 review**，三步驟的訊息措辭是品牌決策不是工程決策。
4. 所有修改務必遵守 `CLAUDE.md` 的「手術式修改」原則，不要順手重構無關程式碼。
5. 品牌色變動務必同步更新 `BRAND_GUIDELINES.md`，否則文件會過期。

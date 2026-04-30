# Dashboard 求職指南區塊（Blog Hub）— 產品規劃

> 文件版本：v1.1（2026-04-30）
> 狀態：MVP 已實作（手動測試通過）；內容種子擴充至 15 篇
> 對應 PRD：本文件 + `PRD.md` §4.2 求職指南（Blog Hub）
> 對應 TODO：見 `TODO.md`「批次 8：求職指南（Blog Hub）」

---

## 1. Context（為什麼要做）

**目前狀況**：Offery 的 Dashboard 已具備 Stats、Quick Actions、Recent Activity、Next Steps、Milestone 五個區塊，協助使用者「執行求職任務」與「看見進度」。但缺少一個面向是—**當使用者卡關、迷惘、或進度停滯時，平台沒有提供「下一步該怎麼想」的內容**。

**問題**：
- 求職是一段焦慮、孤立的旅程，使用者每天打開 Dashboard 不見得有具體任務可做（如：投了 10 份履歷在等回應）。
- 競品（Teal、Huntr）都把「career content」當作 Dashboard 第一螢核心模組之一，提升日活與留存。
- 現有 AI 工具（履歷優化、面試模擬）使用率受「使用者不知道何時該用」所限—好的內容是天然的功能引流。

**機會**：
1. **留存（Retention）**：給使用者「沒任務時也想打開」的理由。
2. **教育（Education）**：把 Offery 的方法論（如何寫好的 bullet point、如何回答行為面試）變成可消費的內容資產。
3. **SEO（Acquisition）**：以台灣求職關鍵字（「外商履歷怎麼寫」「PM 面試題目」）長期累積有機流量。
4. **功能轉化（Conversion）**：每篇文章引導回對應的 Offery 工具（讀完履歷文 → CTA 試用履歷優化器）。

**預期成果**：3 個月內，Dashboard Blog 區塊 CTR > 15%、文章頁平均停留 > 90 秒、有機流量月均 +20%。

---

## 2. 使用者洞察與設計假設

**目標使用者**：台灣求職者，正在主動找工作（被動觀望者非主要 TA）。

**三種典型情境（決定個人化邏輯）**：

| 情境 | 使用者狀態 | 心理需求 | 建議內容 |
|------|-----------|---------|---------|
| 起步迷惘 | 還沒新增職缺 / 沒履歷 | 不知道從何下手 | 求職起步、履歷基礎 |
| 投出但無回應 | 已投 5+ 份、面試數 = 0 | 開始懷疑自己 | 履歷優化、ATS 關鍵字、產業分析 |
| 進入面試 | 有 interview 狀態的職缺 | 想做最後一哩準備 | 面試題庫、行為題框架、薪資談判 |

**核心設計原則**：
- **去焦慮化**：標題不用恐嚇式（避免「90% 求職者都犯的錯」），改用建設性（「三個讓履歷被看完的開頭」）。
- **可行動**：每篇文末必有「現在就試用 [對應工具]」的 CTA。
- **短而精**：3–5 分鐘讀完，比「萬字長文」更符合求職空檔的閱讀情境。
- **本地脈絡**：台灣職場語境（外商、新創、傳產），不直接翻譯歐美內容。

---

## 3. 目標與成功指標

**北極星指標**：Dashboard Blog 區塊「點擊後到工具」轉化率（Article CTA → Tool Use）。

**輔助指標**：
- 區塊 CTR（dashboard 看到 → 點進文章）：目標 > 15%。
- 文章頁完讀率（滾動到 80%）：目標 > 40%。
- 個人化區塊比通用區塊 CTR 提升：目標 +30%。
- 每月有機 SEO 流量（/blog 路由）：3 個月內達 1,000 UV。

**反指標**：
- Dashboard 整體載入時間不可因此 > +200ms。
- 不可因為 blog 區塊推擠其他模組導致主要任務（新增職缺）CTR 下降。

---

## 4. MVP 範圍

✅ Dashboard 區塊（情境化推薦 3 篇）
✅ `/blog` 列表頁（依分類瀏覽 + 最新）
✅ `/blog/[slug]` 文章閱讀頁
✅ 內容來源：**TSX 內容模組**（雙語：zh-TW、en）
✅ 個人化邏輯：依使用者 pipeline 狀態挑文章（規則式，不需 ML）

**MVP 不做**：
- 留言、按讚、收藏（待驗證留存後再加）
- 訂閱電子報（已有 Stripe，但 email 系統尚未建置）
- 內文 AI 問答（先看完讀率再決定是否值得做）
- 後台 CMS（5–20 篇規模 git 管理足矣）

---

## 5. 資訊架構（IA）

```
Dashboard
└─ 求職指南 區塊（顯示 3 篇情境化推薦）
   └─ 「查看全部文章 →」  ─┐
                         ↓
/blog （列表頁）
├─ 分類 tab：全部 / 履歷 / 面試 / 求職策略 / 薪資與職涯
├─ 個人化推薦（與 Dashboard 同邏輯，置頂 3 篇）
└─ 最新文章（時間排序）
   └─ 文章卡片 ─┐
                ↓
/blog/[slug] （文章頁）
├─ 麵包屑：求職指南 > [分類] > [標題]
├─ 文章 metadata：分類 tag、作者、更新日、閱讀時間
├─ 內文（TSX 模組）
├─ 文末 CTA 卡片：「現在就試用 [對應工具]」
└─ 延伸閱讀（同分類 3 篇）
```

**內容分類（內容支柱 / Content Pillars）**：
1. **履歷**（resume）— 寫法、ATS、客製化
2. **面試**（interview）— 行為題、技術題、Mock
3. **求職策略**（job-search）— 找職缺、人脈、Cold message
4. **薪資與職涯**（career）— 談薪、Offer 比較、跳槽時機

---

## 6. 個人化推薦邏輯（規則引擎）

不需要 ML。Dashboard 已能拿到所有訊號（jobCount、resumeCount、interviewCount、completedInterviewCount），只要再算一個衍生指標：

**新增訊號**：`appliedWithoutInterview`（status=applied 且使用者尚無任何 interview 階段職缺的數量）。

**推薦規則（依優先序，第一個 match 即套用）**：

| 條件 | 推薦分類權重 | 情境訊息 |
|------|-------------|---------|
| `!hasResume` | 履歷 (3) | 「先打好基礎，從第一份履歷開始」 |
| `!hasJob` | 求職策略 (3) | 「不知道從哪找起？這幾招幫你開局」 |
| `interviewCount > 0` | 面試 (3) | 「有面試了！這幾篇幫你做最後準備」 |
| `appliedWithoutInterview >= 5` | 履歷 (2) + 求職策略 (1) | 「投了一陣子還沒回音？換個方式試試」 |
| 預設 | 編輯精選 evergreen 3 篇 | 「為你精選的求職指南」 |

> 注意：`interviewCount > 0` 排在 `appliedWithoutInterview >= 5` 之前，避免「有面試了卻還在被推薦履歷優化」的不合理情境。

**前端實作**：在 `dashboard/page.tsx` 已 fetch 的訊號基礎上加一筆 `appliedWithoutInterview` 查詢，傳給 `<BlogRecommendations />` server component，組件內部用純函式 `pickArticles(state, allArticles)` 計算。

---

## 7. UX 設計

### 7.1 Dashboard 區塊
位置：放在 `<NextStepCards />` 之後、`<MilestoneBadge />` 之前（屬「教育/啟發」性質，自然延續 Next Step 的學習脈絡）。

```
┌─────────────────────────────────────────────────────────────┐
│ 為你而選的求職指南                          查看全部文章 →  │
│ 根據你目前的進度推薦                                         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│ │ [履歷] 5min │  │ [履歷] 4min │  │ [策略] 3min │          │
│ │             │  │             │  │             │          │
│ │ 三個讓履歷  │  │ ATS 關鍵字  │  │ 投了沒回音  │          │
│ │ 被看完的開頭│  │ 怎麼塞進    │  │ 該檢查的    │          │
│ │             │  │ 履歷？      │  │ 5 件事      │          │
│ │             │  │             │  │             │          │
│ │ 摘要句⋯⋯   │  │ 摘要句⋯⋯   │  │ 摘要句⋯⋯   │          │
│ └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

- 樣式遵循現有 `rounded-2xl bg-white p-6 shadow-neu`。
- 內部 3 張小卡 hover 時 `shadow-neu-hover` + 微微上浮。
- 響應式：mobile 1 欄、tablet 2 欄、desktop 3 欄。
- 分類 tag 用該分類專屬色（履歷=brand、面試=accent、策略=secondary、薪資=success）。
- 閱讀時間用 lucide `Clock` icon。

### 7.2 `/blog` 列表頁
- 沿用 dashboard shell（左側 sidebar 仍在）。
- 頁首：H1「求職指南」+ 副標 + 分類 tab（pill 樣式）。
- 第一區：個人化推薦 3 篇（與 dashboard 同邏輯，但展示更大卡片）。
- 第二區：最新文章（grid 2×N）。
- MVP 直接顯示全部（< 20 篇），分頁未來再加。

### 7.3 `/blog/[slug]` 文章頁
- Reading-optimised：max-width 約 720px、行高 1.7、字級 17px。
- 頁首：分類 tag、H1、作者、更新日、閱讀時間。
- 內文：TSX 元件，可使用自訂的 callout、image、CTA 卡片元件。
- 文末：固定 CTA 卡片（依文章 metadata 的 `ctaTool` 連到對應工具，例如 `ctaTool: "resume-optimizer"` → `/resume`）。
- 延伸閱讀：同分類 3 篇。

---

## 8. 技術架構

### 8.1 設計原則
- **零新增 npm 依賴**：完全不引入 MDX、gray-matter、reading-time 等套件，沿用現有 `src/content/legal/*.tsx` 的純 TSX 內容模組模式。
- **型別安全**：每篇文章是一個明確型別 `Article`，metadata 與內文（React 元件）皆編譯期檢查。
- **Server Components only**：blog 區域全部走 RSC，無 client hydration 成本。
- **靜態化**：文章頁 `generateStaticParams`，build 時產出 HTML，幾乎零執行成本。

### 8.2 為何不用 MDX
1. CLAUDE.md「簡潔優先」原則：MVP 5–20 篇文章，TSX 已足夠且更一致。
2. AGENTS.md 警告 Next.js 16 有 breaking changes，`@next/mdx` 與 Turbopack 的整合風險高。
3. 既有 legal 內容已是 TSX 模式，新增 MDX 會造成「兩種內容系統」不必要的分歧。
4. 作者目前是工程師團隊，不需要為非工程師的 markdown 體驗付出複雜度。

未來若編輯體驗成痛點，再評估遷移至 MDX。

### 8.3 檔案結構
```
src/
├─ content/
│  └─ blog/
│     ├─ index.ts              # 集中註冊所有文章
│     ├─ zh-TW/
│     │  ├─ resume-opening-hooks.tsx
│     │  ├─ ats-keywords-guide.tsx
│     │  └─ ...
│     └─ en/
│        ├─ resume-opening-hooks.tsx   # 英文版（MVP 可先 stub「Coming soon」）
│        └─ ...
├─ lib/
│  └─ blog/
│     ├─ types.ts              # Article、ArticleCategory、UserPipelineState
│     ├─ articles.ts           # listArticles、getArticleBySlug、getRelatedArticles
│     └─ recommend.ts          # pickArticles(state, articles) 純函式
├─ components/
│  ├─ blog/
│  │  ├─ ArticleCard.tsx       # dashboard / 列表共用卡片（compact + featured 兩種變體）
│  │  ├─ ArticleHero.tsx       # 文章頁頁首
│  │  ├─ ArticleCTA.tsx        # 文末工具引導卡
│  │  ├─ ArticleProse.tsx      # 內文容器（控制 max-width、行高、heading 樣式）
│  │  ├─ Callout.tsx           # 內文可用的提示框
│  │  └─ CategoryTab.tsx       # 列表頁分類切換
│  └─ dashboard/
│     └─ BlogRecommendations.tsx
└─ app/
   └─ [locale]/
      └─ (dashboard)/
         └─ blog/
            ├─ page.tsx                # 列表頁
            └─ [slug]/
               └─ page.tsx             # 文章頁（generateStaticParams）
```

### 8.4 Article 型別（TS）
```ts
export type ArticleCategory = "resume" | "interview" | "job-search" | "career";

export type ArticleCtaTool = "resume-optimizer" | "cover-letter" | "interview" | "jobs";

export type PersonaTag =
  | "no-resume"
  | "no-job"
  | "applied-without-interview"
  | "has-interview"
  | "evergreen";

export type ArticleLocale = "zh-TW" | "en";

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  personaTags: PersonaTag[];
  publishedAt: string;       // ISO date
  updatedAt: string;         // ISO date
  readingMinutes: number;    // 手動填寫，避免引入 reading-time
  author: string;            // 'offery-team'
  ctaTool: ArticleCtaTool;
  ctaText: string;
  featured?: boolean;
}

export interface Article extends ArticleMeta {
  locale: ArticleLocale;
  Content: React.ComponentType;   // 文章內容元件
}
```

### 8.5 國際化策略
- UI 字串（區塊標題、CTA 按鈕、tab 名稱）放 `messages/{locale}.json` 新增 namespace `blog`。
- **文章內容本身**用獨立 TSX 檔案（每篇獨立翻譯，非機翻）。
- 路由：`/blog/resume-opening-hooks` 同個 slug 兩種語言（next-intl 自動切換 locale 載入對應內容）。
- MVP 階段：zh-TW 為主，en 可先 stub「Coming soon」內容，降低初期內容量壓力。

### 8.6 效能與 SEO
- 全部 SSG（`generateStaticParams`），不打 DB。
- 文章頁產出 `<script type="application/ld+json">` Article schema。
- `app/sitemap.ts` 補上 blog 路由。
- 未登入也應可讀（SEO 需要）：在 dashboard route group 內仍會被 supabase middleware 重導，**MVP 暫接受 blog 在 auth 後**，v2 移出 (dashboard) group 至公開 layout。

---

## 9. 實作里程碑（commit 拆分建議）

每個里程碑為一個獨立 commit，依 CLAUDE.md 規範使用 Conventional Commits、commit 前先確認訊息。

1. `feat(blog): add types, article registry, and recommendation engine` — 內容資料層
2. `feat(blog): add 5 evergreen articles in zh-TW` — 內容種子
3. `feat(blog): add article detail page with hero and CTA` — 文章閱讀頁
4. `feat(blog): add /blog list page with category tabs` — 列表頁
5. `feat(dashboard): add personalized blog recommendations widget` — Dashboard 區塊
6. `feat(blog): add i18n strings, sitemap, and SEO metadata` — 收尾

---

## 10. 後續迭代（不在 MVP）

| 優先級 | 項目 | 觸發條件 |
|-------|------|---------|
| P1 | 收藏文章 | 文章頁完讀率 > 40% 後 |
| P1 | 文章內 AI 問答 | 收藏功能驗證有人用後 |
| P2 | 將 /blog 移出 (dashboard) group 改為公開頁 | SEO 流量達 500 UV/月 後 |
| P2 | Email 訂閱（每週精選） | 累積 ≥ 15 篇文章後 |
| P2 | 留言 / 提問 | 月活 > 1000 後 |
| P3 | 改用 MDX 或外部 CMS | 編輯團隊擴大、非工程師寫文需求出現 |
| P3 | UGC：使用者投稿成功故事 | Pro 訂閱 > 100 後 |

---

## 11. 關鍵檔案（修改 / 新增）

**修改**：
- `app/src/app/[locale]/(dashboard)/dashboard/page.tsx` — 新增 `appliedWithoutInterview` 查詢、新增 `<BlogRecommendations />` 區塊
- `app/messages/zh-TW.json` 與 `en.json` — 新增 `blog` namespace
- `app/src/app/sitemap.ts`（若已存在）— 補上 blog 路由
- `app/TODO.md` — 依 CLAUDE.md 規範新增此功能進度區塊

**新增**：
- `app/src/content/blog/index.ts`、`app/src/content/blog/zh-TW/*.tsx`、`app/src/content/blog/en/*.tsx`
- `app/src/lib/blog/{types,articles,recommend}.ts`
- `app/src/components/blog/{ArticleCard,ArticleHero,ArticleCTA,ArticleProse,Callout,CategoryTab}.tsx`
- `app/src/components/dashboard/BlogRecommendations.tsx`
- `app/src/app/[locale]/(dashboard)/blog/page.tsx`
- `app/src/app/[locale]/(dashboard)/blog/[slug]/page.tsx`

**重複使用既有資產**：
- `Card`、`Button`、`Link` from `src/components/ui/`
- `getTranslations` from `next-intl/server`
- `colors`、`shadows` from `src/lib/theme.ts`
- 設計 token：`shadow-neu`、`rounded-2xl`、`text-text`、`text-text-light`、`bg-brand-600`
- Lucide icons（`Clock`、`ArrowRight`、`BookOpen`、`Sparkles`）

---

## 12. 驗證方式（End-to-End 測試）

實作完成後依此清單手動驗證：

**個人化邏輯**：
1. 全新帳號登入 → Dashboard 區塊顯示「履歷起步」相關 3 篇
2. 建立 1 份履歷 → 重新整理 → 切換為「求職策略起步」3 篇
3. 新增 5 個 status=applied 的職缺 → 切換為「履歷優化 + ATS」相關
4. 將任一職缺改為 status=interview → 切換為「面試準備」相關

**閱讀流程**：
5. 點 Dashboard 文章卡片 → 進入文章頁，metadata、內文、CTA 都正確
6. 文末 CTA 點擊 → 連到對應工具頁
7. 「查看全部文章」→ /blog 列表頁，分類 tab 可切換、卡片正常

**多語系**：
8. 切換 locale 至 en → 區塊標題、tab、CTA 文字皆切換；TSX 內容載入英文版本
9. 英文無對應翻譯時 → 顯示 fallback「Coming soon」而非崩潰

**效能與 SEO**：
10. `npm run build` → blog 頁面 SSG 成功，無 runtime error
11. 開瀏覽器 view-source → `<script type="application/ld+json">` Article schema 正確
12. Lighthouse 跑 `/blog/[任一篇]` → Performance、SEO 皆 > 90

**回歸測試**：
13. 既有 Stats、Quick Actions、Recent Activity、Next Steps、Milestone 全部正常顯示
14. 新增職缺、建立履歷流程不受影響
15. `npm run lint`、`npm run build` 全綠

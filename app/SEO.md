# Offery SEO 文件

> 版本：v2.0（2026-05-06）
> 主網域：`https://offery.thdg.site`，預設語系 `zh-TW`、次要語系 `en`

---

## 一、SEO 三大支柱總覽

SEO 自然排名由三件事共同決定，缺一塊就會出現瓶頸：

| 支柱 | 說明 | Offery 現況 |
|------|------|------------|
| **技術 SEO** | 讓 Google 能正確抓取、索引、理解頁面 | ✅ 已建置完整 |
| **內容 SEO** | 提供使用者真正在搜尋的答案，累積長尾流量 | 🟡 架構已建，需持續產出 |
| **外部連結（Off-page）** | 其他網站的連結是 Google 信任度的外部訊號 | 🔴 尚未系統性經營 |

> **關於付費廣告（Google Ads）**：廣告帶來的是付費流量，不影響自然排名。廣告一停流量立刻歸零，對 SEO 沒有直接幫助。早期預算有限時，投資在內容和技術的 ROI 遠高於廣告。
>
> **關於自動化工具（Bot 點擊／自動發文）**：Google 會偵測異常點擊模式與垃圾連結，輕則忽略、重則手動懲罰（Manual Penalty），直接將網站從搜尋結果移除。此類 Black-hat 手法風險極高，絕對不做。

---

## 二、技術 SEO（已建置）

### 2.1 環境變數

所有 SEO 相關 URL 與 token 都透過環境變數注入，**禁止寫死在程式碼**。

| Key | 值 | 用途 | 是否必填 |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://offery.thdg.site` | canonical / sitemap / robots / OG 連結 | ✅ 必填 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | GSC 提供的 token | Google Search Console 擁有權驗證 | 條件必填 |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXX` | Google Analytics 4 評估 ID | 選填 |

> 程式碼 fallback 都已對齊 `https://offery.thdg.site`，環境變數遺漏時不會輸出錯誤連結，但仍應以環境變數為準。

### 2.2 Metadata API（`src/app/[locale]/layout.tsx`）

依 locale 動態產生 metadata：
- **`title`** + **`titleTemplate`**：來自 `messages/{locale}.json` 的 `metadata` 命名空間
- **`description`**、**`keywords`**：同上
- **`alternates.canonical`**：依 locale 計算 canonical URL
- **`alternates.languages`**：宣告 hreflang（`zh-TW` / `en` / `x-default`）
- **`openGraph`**：type、url、siteName、title、description、locale
- **`twitter`**：`summary_large_image` 卡片
- **`robots`**：`index: true`、googleBot 配置（`max-image-preview: large` 等）
- **`verification.google`**：讀 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`，輸出 `<meta name="google-site-verification">`

### 2.3 Sitemap（`src/app/sitemap.ts`）

| Path | priority | changeFrequency |
|---|---|---|
| `/` | 1.0 | weekly |
| `/login` | 0.5 | yearly |
| `/register` | 0.6 | yearly |
| `/privacy` | 0.3 | yearly |
| `/terms` | 0.3 | yearly |
| `/blog` | 0.8 | weekly |
| `/blog/[slug]` × 35 篇 | 0.7 | monthly |

每筆 URL 產出兩個語系版本（zh-TW 無前綴、en 加 `/en` 前綴），並附 `alternates.languages`（`zh-TW` / `en` / `x-default`），符合 Google 多語系最佳實踐。

### 2.4 Robots（`src/app/robots.ts`）

- **Allow**：`/`（落地頁、login、register、privacy、terms、blog）
- **Disallow**：`/api/` 與認證後路由（`/dashboard`、`/jobs`、`/resume`、`/cover-letter`、`/settings`、`/analytics`、`/interview`），同步擋住 `/en` 前綴版本

### 2.5 JSON-LD 結構化資料（`src/components/seo/StructuredData.tsx`）

落地頁 `[locale]/page.tsx` 注入四組 schema：

| Schema | 重點欄位 |
|---|---|
| **Organization** | `name`、`url`、`logo: ${SITE_URL}/brand/logo-mark.png` |
| **WebSite** | `name`、`url`、`inLanguage: ["zh-TW", "en"]` |
| **SoftwareApplication** | `applicationCategory: "BusinessApplication"`、`operatingSystem: "Web"`、`offers: [Free $0, Pro $9.99/月, Pro Yearly $77.88/年]` |
| **FAQPage** | 由 `FAQ_KEYS` 對照 `messages/{locale}.json` 的 `landing` 命名空間動態產生 Q/A |

**刻意不加**：
- `aggregateRating` / `review`：沒有真實使用者評論不可虛構，Google 會懲罰
- `WebSite.potentialAction.SearchAction`：Offery 沒有公開搜尋 API
- `Breadcrumb`：落地頁無麵包屑，硬加反而扣分

Blog 文章頁可考慮加入 `Article` schema（見第六節待辦）。

### 2.6 Open Graph / Twitter / Favicon

透過 Next.js Metadata Routes 動態產生（`ImageResponse`）：

| 檔案 | 規格 | 路徑 |
|---|---|---|
| `src/app/icon.tsx` | 32×32 PNG | `/icon` |
| `src/app/apple-icon.tsx` | 180×180 PNG | `/apple-icon` |
| `src/app/opengraph-image.tsx` | 1200×630 PNG | `/opengraph-image` |
| `src/app/twitter-image.tsx` | 重新匯出 OG 圖 | `/twitter-image` |

> 目前 OG 圖文案為中文，英文使用者也會看到中文版。待英文流量佔比 > 10% 後再建立 `[locale]/opengraph-image.tsx`。

### 2.7 多語架構

- 預設語系 `zh-TW` 不加前綴（`/`、`/login`...）
- 次要語系 `en` 加前綴（`/en`、`/en/login`...）
- `src/i18n/routing.ts` 設 `localePrefix: "as-needed"`，避免 `/` 被重導到 `/zh-TW` 導致 canonical 失準
- Sitemap 與 Metadata 均明確宣告 hreflang 對應

### 2.8 middleware matcher

明確排除 metadata routes（`icon`、`apple-icon`、`opengraph-image`、`twitter-image`、`robots.txt`、`sitemap.xml`），避免被 next-intl 重導到 `/zh-TW/...` 而 404。

### 2.9 分析與監測工具

| 工具 | 套件 | 用途 |
|---|---|---|
| **Vercel Analytics** | `@vercel/analytics` | 造訪量、來源、轉換漏斗 |
| **Vercel Speed Insights** | `@vercel/speed-insights` | Core Web Vitals（LCP / INP / CLS）— 影響 Google 排名 |
| **Google Analytics 4** | `@next/third-parties/google` | 跨工具行為追蹤（無 `NEXT_PUBLIC_GA_ID` 時不掛載） |

三者全部掛在 `src/app/[locale]/layout.tsx` 的 `<body>` 內。

---

## 三、內容 SEO（持續經營）

技術 SEO 讓 Google 能讀到你，內容 SEO 讓 Google 認為你值得推薦。Offery 的 Blog 系統（35 篇種子文章）已是最具潛力的長期流量引擎。

### 3.1 為什麼內容比廣告更有價值

- 廣告停止投放，流量立刻歸零；文章發布後，SEO 流量可持續數年
- 台灣求職市場的搜尋量大、競爭相對不高，長尾文章容易排到第一頁
- 文章 → CTA → 工具試用，是自然的轉換漏斗，不需要額外付費

### 3.2 關鍵字策略

**目標市場**：台灣繁體中文求職者（主力）、海外華人（次要）

**三層關鍵字**：

| 層級 | 月搜尋量 | 競爭度 | 範例 | 目標 |
|------|---------|--------|------|------|
| 品牌字 | 低（初期） | 低 | 「Offery」 | 第 1–4 週鞏固品牌排名 |
| 長尾字 | 中 | 低–中 | 「外商履歷怎麼寫」「PM 面試題目」「ATS 是什麼」 | 最優先，現有 35 篇文章已覆蓋 |
| 大字 | 高 | 高 | 「履歷範本」「找工作」 | 6 個月後，透過長尾建立 Domain Authority 後再衝 |

**現有 35 篇文章已覆蓋的關鍵字分類**：
- 履歷（ATS、bullet point、開頭寫法）
- 面試（行為題 STAR 框架、薪資談判）
- 求職策略（投遞節奏、LinkedIn 優化）
- 職涯規劃（外商 vs 新創、轉職）

### 3.3 Blog 文章 SEO 規格

每篇文章應包含：

| 項目 | 規格 |
|------|------|
| `<title>` | 主關鍵字放最前面，50–60 字元以內 |
| `<meta description>` | 包含主關鍵字，150–160 字元，有 CTA 語氣 |
| H1 | 只有一個，含主關鍵字 |
| H2–H3 | 涵蓋相關長尾字（如 FAQ、步驟說明） |
| 內文字數 | 800–2,000 字（台灣市場，短而精比長文更適合） |
| 圖片 alt | 描述性文字，含目標關鍵字 |
| 內部連結 | 每篇至少連到 2 篇相關文章 + 1 個對應工具頁 |
| `Article` JSON-LD | `datePublished`、`dateModified`、`author`（見待辦） |

### 3.4 內容更新節奏

- **初期（第 1–3 個月）**：每 2 週發 1 篇新文章，聚焦現有關鍵字的深度補充
- **成長期（第 4–6 個月）**：追蹤 GSC「成效」報告，找出曝光高但點擊率低的文章，優化標題與 meta description
- **穩定期**：每季更新舊文章（修改日期 + 補充新資訊），告訴 Google 內容仍然新鮮

---

## 四、外部連結（Off-page SEO）

外部連結是 Google 判斷網站權威性的重要訊號。以下只列有效且合規的方法。

### 4.1 產品目錄提交（一次性，高 ROI）

| 平台 | 說明 | 預期效益 |
|------|------|---------|
| **Product Hunt** | 英文市場最大產品社群，發布當天可帶數百 UV | 高品質反向連結 + 英文曝光 |
| **GitHub Awesome 清單** | 搜尋 `awesome-job-search`、`awesome-career` 等列表，提 PR 加入 Offery | 高 DA 連結 |
| **數位時代 / TechOrange** | 投遞台灣新創報導，或以「AI 求職工具」角度自寫新聞稿 | 台灣在地媒體連結 |
| **AppSumo / SaaSHub** | 軟體工具目錄 | 英文 SaaS 反向連結 |

### 4.2 社群真實參與（持續進行，不是垃圾發文）

規則：先提供真實價值，再自然帶出工具，不在無關討論中硬塞連結。

| 平台 | 作法 |
|------|------|
| **PTT（Soft_Job、Oversea_Job）** | 回答求職問題、分享真實案例，底部附「我最近用的工具：Offery」 |
| **Dcard（職場板）** | 以使用者角度分享求職心得，文末帶 Offery 連結 |
| **LinkedIn** | 發布台灣求職洞察（數據＋建議），@Offery 官方頁、附文章連結 |
| **Facebook 求職社團** | 分享 Blog 文章，文章本身有價值，社員自然會收藏傳播 |

### 4.3 免費工具策略（中期，最高 ROI 的反向連結來源）

做一個**公開免費的小工具**，放在 `/tools/[工具名]`，不需登入即可使用。好工具會被部落客、媒體主動連結。

**適合 Offery 的工具方向**：
- **薪資計算機**：輸入年薪 → 試算月薪、每日薪資、時薪、換算稅後
- **履歷 ATS 關鍵字掃描（免費版）**：貼上職缺說明 + 履歷文字 → 顯示關鍵字命中率（Pro 才能「自動改寫」）
- **面試題產生器**：輸入職位名稱 → 產生 5 題常見面試題（不需登入）

這類工具頁本身就是長尾關鍵字頁面（如「薪資計算機」每月有大量搜尋），同時累積外部連結。

---

## 五、效能現況與優化路徑

效能分數（尤其 Core Web Vitals）是 Google 排名的直接信號。LCP > 2.5s 或 CLS > 0.1 會被扣分。

### 5.1 歷史量測數據

#### 第一次（2026-04-28，部署前基準）

| 類別 / 指標 | Mobile | Desktop |
|---|---|---|
| Performance | 60 ⚠️ | 90 ✅ |
| Accessibility | 92 | 95 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |
| First Contentful Paint | 5.4s | 1.0s |
| Largest Contentful Paint | 9.3s ⚠️ | 1.8s ✅ |
| Total Blocking Time | 90ms | 10ms |
| Cumulative Layout Shift | 0 ✅ | 0 ✅ |

#### 第二次（2026-04-29，`display: swap` + 字型 preload 調整後）

| 類別 / 指標 | Mobile (Δ) | Desktop (Δ) |
|---|---|---|
| Performance | 70 (+10) ✅ | 96 (+6) ✅ |
| Accessibility | 92 (0) ⚠️ | 95 (0) ⚠️ |
| Best Practices | 96 (0) | 96 (0) |
| SEO | 100 (0) | 100 (0) |
| First Contentful Paint | 3.3s (-2.1s) ✅ | 0.4s (-0.6s) ✅ |
| Largest Contentful Paint | 4.9s (-4.4s) ✅ | 1.3s (-0.5s) ✅ |
| Total Blocking Time | 160ms (+70ms) ⚠️ | 70ms (+60ms) ⚠️ |
| Cumulative Layout Shift | 0 | 0 |
| 轉譯封鎖省下 | 750ms（原 6,160ms）🎯 | 220ms（原 930ms） |

> Mobile 以 Moto G Power + 慢速 4G 節流模擬，Lab 分數偏低為已知模型限制。
> Core Web Vitals 真實數據要等 4 週後 CrUX 回填，屆時以 GSC「網站使用體驗核心指標」為準。

### 5.2 Mobile 已知瓶頸（依優先序）

| 瓶頸 | 預估影響 | 建議做法 |
|------|---------|---------|
| 未使用 JS 92 KiB | LCP, TBT | 分析 bundle（`next bundle-analyzer`），確認是否有不必要的套件 |
| 未使用 CSS 35 KiB | FCP | PurgeCSS（Tailwind v4 已內建，確認設定正確） |
| 舊版 JS polyfill 14 KiB | TBT | `next.config` 設定 `browserslist` 排除過舊瀏覽器 |
| 強制自動重排（forced reflow） | TBT | 找出在 render 過程中讀取 `offsetWidth` 等觸發 reflow 的操作 |

### 5.3 Accessibility 待修項目

| 問題 | 影響頁面 | 修法 |
|------|---------|------|
| 前景／背景對比度不足（5 處 `text-text-light/40,60,70`） | 全站 | 調高對比或改用深色文字 |
| 標題層級跳級（h1 → h3 跳過 h2） | 部分頁面 | 依序排列，CSS 控制視覺大小不影響語意 |
| `alt` 屬性含「圖片／icon」等冗詞 | 共用 | 改為描述性文字 |
| `aria-hidden` 元素含可聚焦子元素 | 共用 | 加 `tabIndex="-1"` 或移除 `aria-hidden` |

> Accessibility 分數不僅是合規問題，Google 的 Lighthouse 會將其列入排名參考。

---

## 六、工作流程

### A. 部署後立即驗證

```
1. git push origin main → Vercel 自動觸發部署（約 1–3 分鐘）

2. 確認 Vercel Production 環境變數：
   ├─ NEXT_PUBLIC_APP_URL = https://offery.thdg.site  ← 必填
   ├─ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = (待 GSC 取得)
   └─ NEXT_PUBLIC_GA_ID = (待 GA4 建立)

3. 部署完成後驗證：
   ├─ 造訪 https://offery.thdg.site/robots.txt       → 確認 disallow 列表
   ├─ 造訪 https://offery.thdg.site/sitemap.xml      → 確認所有頁面 + hreflang
   ├─ View source 落地頁 → 確認 4 組 <script type="application/ld+json">
   ├─ Rich Results Test：https://search.google.com/test/rich-results
   └─ PageSpeed Insights：https://pagespeed.web.dev/
```

### B. Google Search Console 設定

```
1. 進入 https://search.google.com/search-console
2. 「新增資源」→「網址前置字元」→ 輸入 https://offery.thdg.site

3. 驗證方式：「HTML 標記」
   └─ 複製 content="..." 的 token

4. Vercel 設 NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = <token> → Redeploy

5. 回 GSC 按「驗證」→ 通過

6. GSC「索引 → Sitemap」→ 輸入 sitemap.xml → 提交

7. GSC 網址檢查 → Request Indexing：
   ├─ https://offery.thdg.site/
   ├─ https://offery.thdg.site/en
   ├─ https://offery.thdg.site/blog
   └─ 每篇 blog 文章 URL
```

### C. SEO 變更後的標準動作

修改任何 metadata、sitemap、robots、結構化資料後：

1. 本地執行 `npm run build` 確認無型別錯誤
2. 合併到 main → Vercel 自動部署
3. 部署完成 → Rich Results Test 重測落地頁
4. GSC「網址檢查」→ Request Indexing（強制 Google 重新抓取）

### D. 監測節奏

| 時程 | 動作 |
|---|---|
| **部署當天** | Rich Results Test、PageSpeed Lab 分數、GSC 驗證 + Sitemap 提交 |
| **每週** | GSC「索引 → 網頁」確認收錄數量、Vercel Analytics 來源分析 |
| **第 3–7 天** | 搜尋 `site:offery.thdg.site` 確認首頁已索引 |
| **第 7 天起** | GSC「成效」開始有曝光資料 |
| **第 4 週** | CrUX 真實 Core Web Vitals 數據出現，以此為優化基準 |
| **第 4–8 週** | 品牌字「Offery」應穩定排名前段 |
| **每月** | 用 GSC「成效」找出高曝光低點擊的頁面 → 優化標題或 meta description |

---

## 七、不做清單（明確排除）

| 方法 | 原因 |
|------|------|
| **付費廣告（Google Ads）用於 SEO** | 廣告不影響自然排名，停止投放流量立刻歸零 |
| **Bot 自動點擊** | Google 偵測異常點擊 → Manual Penalty → 網站從搜尋結果消失 |
| **自動發文散播連結（垃圾連結）** | 違反 Google Spam 政策，反向連結品質比數量重要 |
| **假評論 / 假評分（`aggregateRating`、`review`）** | Google 會降權，schema 不可捏造 |
| **關鍵字堆砌（keyword stuffing）** | `keywords` meta 已被 Google 忽略，現代演算法根本不看 |
| **AMP** | Google 不再特別優待，Next.js App Router 效能已足夠 |
| **自動化 AI 內容農場** | 違反 Google Spam 政策，大量低品質內容會拖累整個網域 |

---

## 八、待辦事項

### 🔴 上線前必做

- [ ] Vercel Production 設定 `NEXT_PUBLIC_APP_URL=https://offery.thdg.site`
- [ ] 部署後造訪 `/robots.txt` 確認 disallow 列表正確
- [ ] 部署後造訪 `/sitemap.xml` 確認所有頁面（含 blog）都有 + hreflang 正確
- [ ] Rich Results Test 確認 4 組 schema 都被辨識
- [ ] PageSpeed Lab 分數：LCP < 4.9s（現況），目標 < 2.5s

### 🟡 上線當天 / 隔天（GSC + Analytics）

- [ ] 建立 GSC 資源，取得 verification token → 設 Vercel 環境變數 → Redeploy
- [ ] GSC 提交 sitemap.xml
- [ ] GSC Request Indexing：首頁、`/en`、`/blog`、`/login`、`/register`
- [ ] 建立 GA4 資源 → 設 `NEXT_PUBLIC_GA_ID` → Redeploy → 即時報表確認
- [ ] Vercel Analytics Dashboard 確認資料進來

### 🟢 上線後優化（依優先序）

- [ ] **Blog `Article` JSON-LD**：在 `/blog/[slug]` 頁加入 `Article` schema（`datePublished`、`dateModified`、`author`），讓文章在搜尋結果顯示發布日期
- [ ] **Blog 內部連結**：每篇文章補上「相關文章」與「試用對應工具」的 CTA 連結
- [ ] **Mobile LCP 優化**：分析 bundle（`@next/bundle-analyzer`），針對未使用 JS 92 KiB 減量
- [ ] **Accessibility 修正**：對比度 5 處、標題層級跳級、aria-hidden 問題
- [ ] **產品目錄提交**：Product Hunt、GitHub Awesome 清單、台灣科技媒體
- [ ] **社群分發計畫**：PTT Soft_Job、Dcard 職場板、LinkedIn 官方頁貼文節奏確立
- [ ] **免費工具頁**：薪資計算機或 ATS 關鍵字掃描（免費版），吸引反向連結
- [ ] **多語 Open Graph 圖**：建立 `src/app/[locale]/opengraph-image.tsx`，英文流量 > 10% 後做
- [ ] **GSC「成效」關鍵字分析**：上線 4 週後，找出高曝光低點擊頁面，優化 meta description

---

## 九、相關檔案速查

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              ← generateMetadata + Analytics/SpeedInsights/GA
│   │   └── page.tsx                ← 注入 <StructuredData />
│   ├── icon.tsx                    ← 32×32 favicon
│   ├── apple-icon.tsx              ← 180×180
│   ├── opengraph-image.tsx         ← 1200×630 OG 圖
│   ├── twitter-image.tsx           ← 重新匯出 OG 圖
│   ├── sitemap.ts                  ← 動態 sitemap + hreflang（含 blog）
│   └── robots.ts                   ← 多語系 disallow
├── components/
│   └── seo/
│       └── StructuredData.tsx      ← Organization + WebSite + SoftwareApplication + FAQPage
├── i18n/
│   └── routing.ts                  ← 語系定義（localePrefix: "as-needed"）
└── middleware.ts                   ← matcher 排除 metadata routes

messages/
├── zh-TW.json                      ← metadata 命名空間
└── en.json                         ← metadata 命名空間

content/                            ← Blog 文章內容（TSX 模組）
├── zh-TW/
└── en/

public/
└── brand/
    └── logo-mark.png               ← Organization.logo + OG 圖左上角
```

---

## 十、外部資源

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
- [Schema.org Article](https://schema.org/Article)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Google 搜尋中心 — SEO 入門指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google 搜尋中心 — Spam 政策](https://developers.google.com/search/docs/essentials/spam-policies)

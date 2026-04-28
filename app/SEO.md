# Offery SEO 文件

> 本文件描述 Offery 的 SEO 架構、上線流程與後續優化項目。
> 主網域：`https://offery.thdg.site`，預設語系 `zh-TW`、次要語系 `en`。

---

## 一、目前架構

### 1. 環境變數

所有 SEO 相關 URL 與 token 都透過環境變數注入，**禁止寫死在程式碼**。

| Key | 值 | 用途 | 是否必填 |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://offery.thdg.site` | canonical / sitemap / robots / OG 連結 | ✅ 必填 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | GSC 提供的 token | Google Search Console 擁有權驗證 | 條件必填 |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXX` | Google Analytics 4 評估 ID | 選填 |

> 程式碼 fallback 都已對齊 `https://offery.thdg.site`，環境變數遺漏時不會輸出錯誤連結，但仍應以環境變數為準。

### 2. Metadata API（`src/app/[locale]/layout.tsx`）

依 locale 動態產生 metadata：
- **`title`** + **`titleTemplate`**：來自 `messages/{locale}.json` 的 `metadata` 命名空間
- **`description`**、**`keywords`**：同上
- **`alternates.canonical`**：依 locale 計算 canonical URL
- **`alternates.languages`**：宣告 hreflang（`zh-TW` / `en` / `x-default`）
- **`openGraph`**：type、url、siteName、title、description、locale
- **`twitter`**：`summary_large_image` 卡片
- **`robots`**：`index: true`、googleBot 配置（`max-image-preview: large` 等）
- **`verification.google`**：讀 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`，輸出 `<meta name="google-site-verification">`

### 3. Sitemap（`src/app/sitemap.ts`）

公開路徑清單：

| Path | priority | changeFrequency |
|---|---|---|
| `/` | 1.0 | weekly |
| `/login` | 0.5 | yearly |
| `/register` | 0.6 | yearly |
| `/privacy` | 0.3 | yearly |
| `/terms` | 0.3 | yearly |

每筆 URL 會產出兩個語系版本（zh-TW 預設無前綴、en 加 `/en` 前綴），共 10 筆。
每筆 entry 都附 `alternates.languages`：`zh-TW` / `en` / `x-default`，符合 Google 多語系最佳實踐。

部署後可造訪 `https://offery.thdg.site/sitemap.xml` 驗證。

### 4. Robots（`src/app/robots.ts`）

- **Allow**：`/`（含落地頁、login、register、privacy、terms）
- **Disallow**：`/api/` 與認證後路由（`/dashboard`、`/jobs`、`/resume`、`/cover-letter`、`/settings`、`/analytics`、`/interview`），且**同步擋住 `/en` 前綴版本**
- 宣告 `sitemap` 與 `host`

部署後可造訪 `https://offery.thdg.site/robots.txt` 驗證。

### 5. JSON-LD 結構化資料（`src/components/seo/StructuredData.tsx`）

落地頁 `[locale]/page.tsx` 注入四組 schema：

| Schema | 重點欄位 |
|---|---|
| **Organization** | `name`、`url`、`logo: ${SITE_URL}/brand/logo-mark.png` |
| **WebSite** | `name`、`url`、`inLanguage: ["zh-TW", "en"]` |
| **SoftwareApplication** | `applicationCategory: "BusinessApplication"`、`operatingSystem: "Web"`、`offers: [Free $0, Pro $9.99/月, Pro Yearly $77.88/年]` |
| **FAQPage** | 由 `FAQ_KEYS` 對照 `messages/{locale}.json` 的 `landing` 命名空間動態產生 Q/A 列表 |

**刻意不加**：
- `aggregateRating` / `review` — 沒有真實使用者評論不可虛構，Google 會懲罰
- `WebSite.potentialAction.SearchAction` — Offery 沒有公開搜尋 API
- `Breadcrumb` — 落地頁無麵包屑

### 6. Open Graph / Twitter / Favicon

全部透過 Next.js Metadata Routes 動態產生（`ImageResponse`）：

| 檔案 | 規格 | 路徑 |
|---|---|---|
| `src/app/icon.tsx` | 32×32 PNG | `/icon` |
| `src/app/apple-icon.tsx` | 180×180 PNG | `/apple-icon` |
| `src/app/opengraph-image.tsx` | 1200×630 PNG | `/opengraph-image` |
| `src/app/twitter-image.tsx` | 重新匯出 OG 圖 | `/twitter-image` |

> 目前 OG 圖文案為中文，英文使用者也會看到中文版（屬可接受 trade-off，待後續優化）。

### 7. 分析與監測工具

| 工具 | 套件 | 用途 |
|---|---|---|
| **Vercel Analytics** | `@vercel/analytics` | 造訪量、來源、轉換漏斗 |
| **Vercel Speed Insights** | `@vercel/speed-insights` | Core Web Vitals（LCP / INP / CLS）— 影響 Google 排名 |
| **Google Analytics 4** | `@next/third-parties/google` | 跨工具行為追蹤（條件渲染：無 `NEXT_PUBLIC_GA_ID` 即不掛載） |

三者全部掛在 `src/app/[locale]/layout.tsx` 的 `<body>` 內。

### 8. 多語架構

- 預設語系 `zh-TW` 不加前綴（`/`、`/login`...）
- 次要語系 `en` 加前綴（`/en`、`/en/login`...）
- `src/i18n/routing.ts` 明確設 `localePrefix: "as-needed"`，否則 next-intl 預設 `"always"` 會把 `/` 重導到 `/zh-TW`、與 sitemap canonical 失準
- 由 `next-intl` middleware 處理路由
- Sitemap 與 Metadata 均明確宣告 hreflang 對應

### 9. middleware（`src/middleware.ts`）matcher

明確排除 metadata routes（`icon`、`apple-icon`、`opengraph-image`、`twitter-image`、`robots.txt`、`sitemap.xml`），避免被 next-intl 重導到 `/zh-TW/...` 而 404。

---

## 二、工作流程

### A. 上線部署流程

```
1. 推送 commit
   └─ git push origin main

2. 確認 Vercel 環境變數（Production）
   ├─ NEXT_PUBLIC_APP_URL = https://offery.thdg.site  ← 必填
   ├─ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = (待 GSC 取得)
   └─ NEXT_PUBLIC_GA_ID = (待 GA4 建立)

3. Vercel 自動觸發部署（約 1–3 分鐘）

4. 部署完成後立即驗證（不需等待）：
   ├─ 造訪 https://offery.thdg.site/robots.txt
   ├─ 造訪 https://offery.thdg.site/sitemap.xml
   ├─ View source 落地頁 → 確認三組 <script type="application/ld+json">
   ├─ Rich Results Test：https://search.google.com/test/rich-results
   └─ PageSpeed Insights：https://pagespeed.web.dev/
```

### B. Google Search Console 設定流程

```
1. 進入 https://search.google.com/search-console
2. 「新增資源」→ 選「網址前置字元」
   └─ 輸入 https://offery.thdg.site

3. 驗證方式選「HTML 標記」
   └─ 複製 <meta> 中 content="..." 的 token

4. Vercel 設 NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = <token>
   └─ 觸發 Redeploy

5. 回 GSC 按「驗證」→ 通過

6. GSC「索引 → Sitemap」
   └─ 輸入 sitemap.xml → 提交

7. GSC 上方搜尋列做「網址檢查」
   ├─ 貼 https://offery.thdg.site/         → 要求建立索引
   ├─ 貼 https://offery.thdg.site/en       → 要求建立索引
   ├─ 貼 https://offery.thdg.site/login    → 要求建立索引
   └─ 貼 https://offery.thdg.site/register → 要求建立索引
```

### C. 監測節奏

| 時程 | 動作 |
|---|---|
| **部署當天** | Rich Results Test、PageSpeed Lab 分數、GSC 驗證 + Sitemap 提交 |
| **每天** | 看 GSC「索引 → 網頁」、Vercel Analytics、GA4 |
| **第 3–7 天** | 確認首頁已索引（搜尋 `site:offery.thdg.site`） |
| **第 7 天起** | GSC「成效」開始有曝光資料 |
| **第 4 週** | PageSpeed 開始有 CrUX 真實使用者數據 |
| **第 4–8 週** | 品牌字「Offery」應穩定排名前段 |

### D. SEO 變更後的標準動作

修改任何 metadata、sitemap、robots、結構化資料後：

1. 本地執行 `npm run build` 確認沒破型別與生成
2. PR 通過後合併到 main → Vercel 自動部署
3. 部署完成 → Rich Results Test 重測落地頁
4. GSC「網址檢查」→ Request Indexing（強制 Google 重新抓取）

---

## 三、待辦事項

### 🔴 上線前必做（部署後立即驗證）

- [ ] 推送 commit 到 origin/main
- [ ] Vercel Production 設定 `NEXT_PUBLIC_APP_URL=https://offery.thdg.site`
- [ ] 部署完成後造訪 `/robots.txt` 確認 disallow 列表正確
- [ ] 部署完成後造訪 `/sitemap.xml` 確認 10 筆 URL + hreflang
- [ ] Rich Results Test 確認 3 組 schema 都被辨識
- [ ] PageSpeed Insights Lab 分數：LCP < 2.5s、CLS < 0.1、INP < 200ms

### 🟡 GSC + Analytics 設定（上線當天 / 隔天）

- [ ] 建立 GSC 資源（網址前置字元）
- [ ] 取得 verification token → 設 Vercel 環境變數 → Redeploy
- [ ] GSC 驗證通過
- [ ] GSC 提交 sitemap.xml
- [ ] GSC Request Indexing 四個關鍵頁（`/`、`/en`、`/login`、`/register`）
- [ ] 建立 GA4 資源 → 設 `NEXT_PUBLIC_GA_ID` → Redeploy
- [ ] GA4 即時報表確認可看到自己造訪的訊號
- [ ] Vercel Analytics Dashboard 確認資料進來

### 🟢 上線後優化（依優先序）

- [ ] **多語 Open Graph 圖**：建立 `src/app/[locale]/opengraph-image.tsx`，依 `params.locale` 切換中英文文案。優先級：等英文流量 > 10% 後再做
- [ ] **內容 SEO（Blog / Resources）**：開 `/blog` 子目錄，發 SEO 導向的求職主題長文章（如「2026 年履歷 ATS 通過率提升指南」），衝長尾關鍵字流量
- [ ] **Breadcrumb Schema**：當 dashboard 內頁開放公開存取時（目前禁止索引）再考慮
- [ ] **結構化資料維護**：若推出企業方案，更新 `SoftwareApplication.offers`（目前已含 Free / Pro 月付 / Pro 年付）
- [ ] **效能優化**：依 PageSpeed CrUX 報告（4 週後出現）針對 LCP / INP 落點調整
- [ ] **反向連結**：列入行銷層工作，技術面僅需確保 robots/sitemap 開放抓取

### ⚪ 不做（明確排除）

- 假評論 / 假評分（`aggregateRating`、`review`）— Google 會降權
- 關鍵字堆砌（keyword stuffing）— `keywords` meta 已被 Google 忽略，僅供其他搜尋引擎
- AMP — 投入產出比已不佳，Google 不再特別優待
- 自動化 SEO 內容農場 — 違反 Google Spam 政策

---

## 四、相關檔案速查

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          ← generateMetadata + Analytics/SpeedInsights/GA
│   │   └── page.tsx            ← 注入 <StructuredData />
│   ├── icon.tsx                ← 32×32 favicon
│   ├── apple-icon.tsx          ← 180×180
│   ├── opengraph-image.tsx     ← 1200×630 OG 圖
│   ├── twitter-image.tsx       ← 重新匯出 OG 圖
│   ├── sitemap.ts              ← 動態 sitemap + hreflang
│   └── robots.ts               ← 多語系 disallow
├── components/
│   └── seo/
│       └── StructuredData.tsx  ← Organization + WebSite + SoftwareApplication
├── i18n/
│   └── routing.ts              ← 語系定義
└── middleware.ts               ← matcher 排除 metadata routes

messages/
├── zh-TW.json                  ← metadata 命名空間
└── en.json                     ← metadata 命名空間

public/
└── brand/
    └── logo-mark.png           ← Organization.logo + OG 圖左上角
```

---

## 五、外部資源

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Google 搜尋中心 — SEO 入門指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

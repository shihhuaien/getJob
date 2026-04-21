# Offery — 智慧求職平台

AI 驅動的繁體中文求職管理平台。追蹤職缺、優化履歷、產生求職信、模擬面試，一站式提升求職效率。

## Tech Stack

Next.js 16（App Router） · TypeScript · Tailwind CSS v4 · Supabase（Auth + PostgreSQL + RLS + Storage） · Stripe（訂閱）· Google Gemini · next-intl（zh-TW / en） · Zustand · Zod · Vercel

## 開發

```bash
npm install
# 建立 .env.local 並填入下方環境變數
npm run dev                        # http://localhost:3000
```

常用指令：

| 指令 | 用途 |
|---|---|
| `npm run dev` | 開發模式 |
| `npm run build` | 正式建置 |
| `npm run lint` | ESLint |

## 環境變數

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=
GOOGLE_AI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

## 文件

- `CLAUDE.md` — 專案架構、開發規範（AI 協作專用基礎文件）
- `PRD.md` — 產品需求與功能規格
- `BRAND_GUIDELINES.md` — 品牌設計白皮書（Calm & Trustworthy 微擬物風）
- `TODO.md` — 待辦清單與進度
- `AGENTS.md` — Next.js 16 變更提醒

## 部署

推送到 main 自動由 Vercel 部署。環境變數需同步設在 Vercel 專案設定；特別注意 `GEMINI_MODEL=gemini-2.5-flash` 需設，否則會回落到已被降配額的 2.0-flash。

## 授權

私有專案，未開放原始碼授權。

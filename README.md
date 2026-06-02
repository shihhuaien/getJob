# Offery — AI-Powered Job Application Platform

A full-stack SaaS that helps job seekers track applications, tailor resumes with AI, generate cover letters, and simulate interviews. Built as a production system with real subscription billing and a companion Chrome extension.

**Live:** [offery.thdg.site](https://offery.thdg.site)

---

## Problem & Motivation

Job seekers today face three concrete problems:

1. **Application tracking is scattered.** Most people manage their pipeline in spreadsheets or just their inbox. There is no good way to see which jobs are at which stage, or to keep notes alongside the application.

2. **Generic resumes fail ATS.** A resume that worked for one job rarely works for the next. Manually tailoring keywords and phrasing for each JD is tedious, and most people skip it — which is why qualified candidates get filtered before a human ever reads their resume.

3. **Interview preparation is hard to do alone.** Reading questions online gives no feedback. There is no structured way to practice, diagnose weak answers, and see what a stronger response looks like.

Offery addresses all three: a Kanban board for tracking, an AI pipeline for resume and cover letter tailoring, and a simulated interview coach that scores and rewrites your answers.

---

## Core Features

### Job Tracking (Kanban Board)
Drag-and-drop board with status stages: Saved → Applied → Interview → Offer / Rejected. A Chrome extension lets users save jobs from 104.com.tw, CakeResume, or LinkedIn in one click without leaving the job listing page.

### AI Resume Optimization
Two-step pipeline: first analyzes the resume against the JD to produce an ATS score and keyword gap report, then rewrites the resume to close those gaps — without inventing experience that isn't in the original.

### AI Cover Letter Generation
Streams the letter token-by-token. Saves to the database server-side after the stream ends, so the client never needs to make a separate save request.

### AI Interview Simulation
Generates 5 tailored questions from the resume and JD. Supports 3 interviewer personas (friendly HR, strict tech lead, CEO), 4 question types (behavioral, technical, case study, mixed), and 2 answer modes (text or voice). Produces a scored report per question with a rewritten "gold answer" derived from the candidate's actual resume.

### Subscription-Based Access Control
Free plan: unlimited job tracking, up to 3 resumes, no AI features.
Pro plan (Stripe, $9.99/month): all AI features, unlimited resumes.

Access is enforced at the database layer via PostgreSQL Row-Level Security and `SECURITY DEFINER` functions — not just at the API level. See [Key Technical Decisions](#key-technical-decisions) for details.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Chrome Extension (MV3)                                  │
│  Content scripts for 104, CakeResume, LinkedIn           │
│  → scrapes job data → POST to /api/jobs/save             │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Next.js 16 (App Router)  —  deployed on Vercel          │
│                                                          │
│  Server Components (default)                             │
│  Client Components only where interactivity needed       │
│                                                          │
│  /api routes                                             │
│  ├─ resume/parse-pdf, parse-text, optimize, generate     │
│  ├─ cover-letter/generate  (streaming SSE)               │
│  ├─ interview/*            (questions, evaluate)         │
│  ├─ jobs/*                                               │
│  └─ stripe/webhook, checkout, cancel                     │
└───────────┬─────────────────────────┬───────────────────┘
            │                         │
┌───────────▼──────────┐   ┌──────────▼──────────────────┐
│  Supabase             │   │  Google Gemini 2.5 Flash     │
│  ├─ Auth (magic link) │   │  ├─ PDF / text parsing       │
│  ├─ PostgreSQL + RLS  │   │  ├─ ATS analysis (JSON mode) │
│  └─ Storage           │   │  ├─ Resume optimization      │
└───────────────────────┘   │  ├─ Cover letter (streaming) │
                            │  └─ Interview Q&A evaluation │
┌───────────────────────┐   └─────────────────────────────┘
│  Stripe               │
│  └─ Subscription      │
│     billing (webhook) │
└───────────────────────┘
```

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Runtime | **Node.js** (via Vercel Functions) | All API routes run as Node.js serverless functions; streaming responses use Node.js `ReadableStream` |
| Framework | **Next.js 16** App Router | Server Components reduce client JS bundle; API routes and pages co-deployed without a separate backend server |
| Language | **TypeScript** strict mode | Catches AI JSON shape mismatches at compile time; all Gemini response types are fully typed |
| API design | **RESTful** (`/api/[resource]/[action]`) | Resource-oriented routes, standard HTTP verbs, JSON request/response bodies; see [API Design](#api-design) below |
| Database | Supabase (PostgreSQL + RLS) | Row-level security enforces data isolation at DB layer, not just API layer |
| AI | Gemini 2.5 Flash | Native PDF multimodal input; JSON response mode eliminates regex parsing |
| Payments | Stripe | Subscription webhooks as the canonical billing event source |
| State | Zustand | Minimal client state; most data lives in Server Components |
| Validation | Zod | Validates all AI-generated JSON responses before they touch the DB |
| i18n | next-intl | Route-level locale (`/zh-TW`, `/en`) with AI output language per user preference |
| Styling | Tailwind CSS v4 | |
| Deployment | Vercel | |

---

## API Design

All API routes follow a resource-oriented RESTful convention under `/api/`:

```
POST   /api/resume/parse-pdf        — upload PDF, returns structured ResumeContent JSON
POST   /api/resume/parse-text       — paste plain text, returns structured ResumeContent JSON
POST   /api/resume/optimize         — ATS analysis + AI rewrite (two-step, returns full ResumeContent)
POST   /api/resume/generate         — create blank resume

POST   /api/cover-letter/generate   — streams cover letter text, saves to DB on completion

POST   /api/interview/questions     — generate tailored interview questions
POST   /api/interview/evaluate      — score a completed session, return per-question feedback
POST   /api/interview/hint          — hint for a single question mid-session
POST   /api/interview/drill-down    — generate follow-up question for an answer

GET    /api/jobs                    — list user's job applications
POST   /api/jobs/save               — save a job (used by Chrome extension via Bearer token)
PATCH  /api/jobs/[id]               — update status, notes, salary

POST   /api/stripe/checkout         — create Stripe Checkout session
POST   /api/stripe/webhook          — receive and verify Stripe events (signature-verified)
POST   /api/stripe/cancel-subscription
```

**Auth pattern:** Every route that reads or writes user data calls `supabase.auth.getUser()` from the server-side Supabase client before any business logic. The Chrome extension authenticates using a long-lived API token stored in the `api_tokens` table (Bearer scheme).

**Error responses** use standard HTTP status codes: `400` for validation errors (Zod), `401` for unauthenticated, `403` for insufficient subscription tier, `404` for missing resources, `409` for duplicate constraints, `500` for unexpected failures. Error bodies always include an `error` string field.

---

## Key Technical Decisions

### 1. Subscription quota enforced at the database layer

Free plan users are limited to 3 resumes. The limit is implemented as a `SECURITY DEFINER` PostgreSQL function called directly inside the RLS `INSERT` policy — not in the API route.

```sql
-- migrations/00002_resume_limit.sql
CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND check_resume_limit(auth.uid())   -- DB-level gate
  );
```

This means the limit cannot be bypassed by calling the API directly or exploiting a frontend bug. The frontend check is purely cosmetic UX.

### 2. AI output validated with Zod + coerce fallback

Every Gemini response that returns JSON is parsed with a strict Zod schema. For the interview evaluation endpoint — where a malformed response would break the entire report — there is a `coerceLoosely()` fallback that salvages partial data rather than surfacing an error to the user.

```ts
const parsed = reportSchema.safeParse(json);
const data = parsed.success ? parsed.data : coerceLoosely(json, questions, locale);
```

### 3. Cover letter generation uses ReadableStream with in-band sentinels

The generation streams token-by-token to the client. After the stream ends, the server inserts the final text into the database and signals completion using an in-band sentinel appended to the stream body — avoiding a separate `/save` round-trip while keeping the client informed of the record ID.

```ts
// After stream completes, insert to DB, then:
controller.enqueue(encoder.encode(DONE_SENTINEL + JSON.stringify({ id: coverLetter.id })));
// On error:
controller.enqueue(encoder.encode(ERROR_SENTINEL + JSON.stringify({ error: message })));
```

### 4. Gemini API retry with exponential backoff

All Gemini calls are wrapped in `withGeminiRetry()` which retries on transient HTTP errors (429, 503, connection resets) with jittered exponential backoff. Non-transient errors (400 bad request, 401) are re-thrown immediately.

```ts
const delay = base * Math.pow(2, attempt) + Math.random() * 200;
```

### 5. Stripe subscription state lives only in Supabase

The app never queries Stripe at runtime to determine access. The Stripe webhook handler updates `profiles.subscription_tier` in Supabase on every relevant event (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`). All permission checks read from the DB.

```
Stripe event → webhook signature verification → update profiles table → app reads DB
```

### 6. Deduplication via partial unique indexes

Job URL deduplication and the "one cover letter per job" constraint are enforced at the index level, not in application code. Using `WHERE` clauses allows NULL values (manually created entries without a URL) to coexist without violating the constraint.

```sql
-- Prevents saving the same job URL twice, allows URL-less manual entries
CREATE UNIQUE INDEX idx_job_applications_user_url_unique
  ON job_applications (user_id, job_url)
  WHERE job_url IS NOT NULL;
```

### 7. AI resume optimization is a two-step pipeline

To prevent the model from hallucinating experience or skills, resume optimization runs in two sequential steps:

1. **Analyze**: Gemini returns an ATS score, matched/missing keywords, and section-level suggestions as structured JSON.
2. **Optimize**: A second call passes the original resume, the job description, *and the analysis output* together. The prompt explicitly prohibits adding companies, titles, degrees, or skills not present in the original.

After the AI returns the optimized content, the server overwrites identity fields (name, email, dates) from the original resume — so even a hallucinating model cannot change factual data.

---

## Chrome Extension

A Manifest V3 extension with three content scripts targeting 104.com.tw, CakeResume, and LinkedIn. Each script scrapes job title, company name, URL, and description from the DOM and responds to a message from the popup. The popup then calls the Offery API to save the job directly into the user's Kanban board.

```
User visits job page
  → popup button click
  → popup sends GET_JOB_DATA to content script
  → content script returns scraped data
  → popup POSTs to /api/jobs/save with Bearer token
  → job appears in dashboard
```

---

## AI Interview Simulation

The interview module generates tailored questions from the resume and JD, then evaluates the full session. The system supports:

- **3 interviewer personas**: Friendly HR, strict tech lead, business-focused CEO
- **4 question types**: Behavioral (STAR), technical, case study, mixed
- **2 answer modes**: Text input or voice (Web Speech API → transcript)
- **Per-question evaluation**: diagnosis, a model "gold answer" rewritten from the candidate's actual resume, and 3 predicted follow-up questions

The evaluation prompt passes the full session transcript with question IDs so the model's `per_question` array can be matched back to the original questions by UUID — with an index-based fallback if the model returns IDs out of order.

---

## Database Schema (core tables)

```
profiles          — extends auth.users; holds subscription_tier, stripe_customer_id
resumes           — JSONB content field (personal, education, experience, skills)
job_applications  — status enum: saved → applied → interview → offer / rejected
cover_letters     — linked to job_application_id (partial unique index)
interview_sessions — linked to job_application_id; stores questions + answers + report
```

All tables have RLS enabled. `updated_at` is maintained by a shared trigger function.

---

## Local Setup

```bash
# 1. Install dependencies
cd app && npm install

# 2. Set environment variables
cp .env.local.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          SUPABASE_SERVICE_ROLE_KEY, GOOGLE_AI_API_KEY,
#          STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

# 3. Run database migrations
npx supabase db push

# 4. Start dev server
npm run dev
```

---

## Project Structure

```
app/                          # Next.js application
├── src/
│   ├── app/
│   │   ├── [locale]/         # Route groups: (auth), (dashboard)
│   │   └── api/              # cover-letter, interview, jobs, resume, stripe
│   ├── lib/
│   │   ├── gemini.ts         # Gemini client + withGeminiRetry
│   │   ├── generate-cover-letter.ts
│   │   ├── optimize-resume.ts    # analyzeResume + generateOptimizedResume
│   │   ├── parse-resume-pdf.ts
│   │   └── interview/        # generate-questions, evaluate-session, hint, drill-down
│   └── types/                # database.ts (generated), resume.ts, interview.ts
└── supabase/migrations/      # 11 versioned SQL migration files

extension/                    # Chrome Extension (MV3)
├── content-scripts/          # 104.js, cakeresume.js, linkedin.js
├── popup/
└── manifest.json
```

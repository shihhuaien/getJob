-- AI 面試模擬練習：session 與個人題庫

-- Enums
CREATE TYPE interview_persona AS ENUM ('hr_friendly', 'tech_strict', 'ceo_business');
CREATE TYPE interview_type AS ENUM ('behavioral', 'technical', 'case_study', 'mixed');
CREATE TYPE interview_mode AS ENUM ('text', 'voice');
CREATE TYPE interview_status AS ENUM ('in_progress', 'completed', 'abandoned');

-- 面試 session
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_application_id UUID REFERENCES job_applications(id) ON DELETE SET NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  persona interview_persona NOT NULL,
  interview_type interview_type NOT NULL,
  mode interview_mode NOT NULL DEFAULT 'text',
  drill_down_enabled BOOLEAN NOT NULL DEFAULT false,
  status interview_status NOT NULL DEFAULT 'in_progress',
  questions JSONB NOT NULL DEFAULT '[]',
  answers JSONB NOT NULL DEFAULT '[]',
  report JSONB,
  locale TEXT NOT NULL DEFAULT 'zh-TW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 個人題庫
CREATE TABLE interview_question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  category TEXT,
  source_session_id UUID REFERENCES interview_sessions(id) ON DELETE SET NULL,
  source_job_id UUID REFERENCES job_applications(id) ON DELETE SET NULL,
  user_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX idx_interview_sessions_user ON interview_sessions(user_id, created_at DESC);
CREATE INDEX idx_interview_sessions_job ON interview_sessions(job_application_id);
CREATE INDEX idx_interview_bank_user ON interview_question_bank(user_id, created_at DESC);

-- RLS
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_question_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interview sessions"
  ON interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interview sessions"
  ON interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interview sessions"
  ON interview_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interview sessions"
  ON interview_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own question bank"
  ON interview_question_bank FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own question bank"
  ON interview_question_bank FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own question bank"
  ON interview_question_bank FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own question bank"
  ON interview_question_bank FOR DELETE USING (auth.uid() = user_id);

-- updated_at trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON interview_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON interview_question_bank
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Onboarding：補足 profiles 欄位以支援首次登入流程與目標職稱個人化

ALTER TABLE profiles
  ADD COLUMN onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN target_role TEXT,
  ADD COLUMN job_search_status TEXT;

COMMENT ON COLUMN profiles.onboarding_completed_at IS '首次 Onboarding 完成時間，NULL 代表尚未完成';
COMMENT ON COLUMN profiles.target_role IS '使用者目標職稱／產業，供 AI 面試與履歷推薦使用';
COMMENT ON COLUMN profiles.job_search_status IS '求職狀態：actively_looking / passively_open / new_grad / career_change';

ALTER TABLE profiles
  ADD CONSTRAINT profiles_job_search_status_check
  CHECK (
    job_search_status IS NULL
    OR job_search_status IN ('actively_looking', 'passively_open', 'new_grad', 'career_change')
  );

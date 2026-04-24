-- 防止重複儲存：職缺／求職信／履歷
-- 使用 Partial Unique Index，允許 NULL 欄位的獨立建立（例如手動建立的空白求職信）

-- 職缺：同一使用者不可儲存相同 URL 的職缺（僅對有 URL 者生效，手動建立無 URL 時不受限）
CREATE UNIQUE INDEX idx_job_applications_user_url_unique
  ON job_applications (user_id, job_url)
  WHERE job_url IS NOT NULL;

-- 求職信：同一使用者對同一職缺僅允許一份求職信；無關聯職缺的獨立草稿不受限
CREATE UNIQUE INDEX idx_cover_letters_user_job_unique
  ON cover_letters (user_id, job_application_id)
  WHERE job_application_id IS NOT NULL;

-- 履歷：同一使用者不可有同名履歷（AI 產出的優化履歷採固定命名，藉此阻擋重覆產生）
CREATE UNIQUE INDEX idx_resumes_user_title_unique
  ON resumes (user_id, title);

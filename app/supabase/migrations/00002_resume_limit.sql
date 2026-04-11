-- 免費方案履歷數量限制（SECURITY DEFINER）
-- 參考 WedSnap 經驗：數量限制必須在 DB 層實作，前端檢查可被繞過

CREATE OR REPLACE FUNCTION public.check_resume_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tier TEXT;
  v_count INTEGER;
BEGIN
  SELECT subscription_tier INTO v_tier
  FROM public.profiles
  WHERE id = p_user_id;

  -- Pro 用戶無限制
  IF v_tier = 'pro' THEN
    RETURN TRUE;
  END IF;

  -- 免費用戶最多 3 份履歷
  SELECT count(*) INTO v_count
  FROM public.resumes
  WHERE user_id = p_user_id;

  RETURN v_count < 3;
END;
$$;

-- 在 RLS INSERT 政策中加入數量限制
DROP POLICY IF EXISTS "Users can insert own resumes" ON resumes;
CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND check_resume_limit(auth.uid())
  );

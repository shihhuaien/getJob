-- 使用者自訂標籤表
CREATE TABLE job_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'sage',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

-- 職缺-標籤 中介表
CREATE TABLE job_application_tags (
  job_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES job_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, tag_id)
);

-- 索引
CREATE INDEX idx_job_tags_user_id ON job_tags(user_id);
CREATE INDEX idx_job_application_tags_tag_id ON job_application_tags(tag_id);
CREATE INDEX idx_job_application_tags_job_id ON job_application_tags(job_id);

-- RLS
ALTER TABLE job_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_application_tags ENABLE ROW LEVEL SECURITY;

-- job_tags policies
CREATE POLICY "Users can view own tags"
  ON job_tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags"
  ON job_tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags"
  ON job_tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags"
  ON job_tags FOR DELETE USING (auth.uid() = user_id);

-- job_application_tags policies（透過 job_applications 驗證所有權）
CREATE POLICY "Users can view own job tags"
  ON job_application_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_applications ja
      WHERE ja.id = job_id AND ja.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own job tags"
  ON job_application_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_applications ja
      WHERE ja.id = job_id AND ja.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own job tags"
  ON job_application_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM job_applications ja
      WHERE ja.id = job_id AND ja.user_id = auth.uid()
    )
  );

-- updated_at 自動更新
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON job_tags
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

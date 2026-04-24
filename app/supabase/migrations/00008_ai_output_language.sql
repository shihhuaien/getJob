-- 新增 AI 產出語言偏好欄位
-- 僅控制 AI prompt 中的輸出語言，不影響介面 next-intl 語系
-- NULL 代表跟隨介面語言（由 request locale 決定）

ALTER TABLE profiles
  ADD COLUMN ai_output_language TEXT
  CHECK (ai_output_language IS NULL OR ai_output_language IN ('zh-TW', 'en'));

COMMENT ON COLUMN profiles.ai_output_language IS 'AI 輸出語言偏好：NULL = 跟隨介面語系、zh-TW、en';

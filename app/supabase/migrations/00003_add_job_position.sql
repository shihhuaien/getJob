-- 為職缺新增排序欄位，支援看板手動排序
ALTER TABLE job_applications ADD COLUMN position integer NOT NULL DEFAULT 0;

-- 為現有資料設定初始排序（依 updated_at 降序，越新的 position 越小）
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY user_id, status
    ORDER BY updated_at DESC
  ) - 1 AS new_position
  FROM job_applications
)
UPDATE job_applications
SET position = ranked.new_position
FROM ranked
WHERE job_applications.id = ranked.id;

-- 建立索引加速排序查詢
CREATE INDEX idx_job_applications_position ON job_applications (user_id, status, position);

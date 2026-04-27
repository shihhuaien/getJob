-- 訂閱期別與下次扣款日（支援年繳方案）
-- plan_period: 月繳 / 年繳，NULL = 非 Pro 訂閱中
-- current_period_end: Stripe 訂閱本期結束時間（下次扣款日）
-- stripe_subscription_id: 對應 Stripe subscription，方便切換方案 / 取消查找

CREATE TYPE plan_period AS ENUM ('monthly', 'yearly');

ALTER TABLE profiles
  ADD COLUMN plan_period plan_period,
  ADD COLUMN current_period_end TIMESTAMPTZ,
  ADD COLUMN stripe_subscription_id TEXT;

CREATE INDEX idx_profiles_stripe_subscription_id
  ON profiles (stripe_subscription_id);

COMMENT ON COLUMN profiles.plan_period IS '訂閱期別：monthly = 月繳、yearly = 年繳、NULL = 非 Pro';
COMMENT ON COLUMN profiles.current_period_end IS 'Stripe 訂閱本期結束時間，等同下次扣款日';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Stripe subscription ID，用於切換方案／取消等操作';

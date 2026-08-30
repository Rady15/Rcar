-- Final production hardening: composite idempotency, session lifecycle and operational indexes.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='idempotency_keys_pkey') THEN
    ALTER TABLE idempotency_keys DROP CONSTRAINT idempotency_keys_pkey;
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS uq_idempotency_key_scope ON idempotency_keys(key, scope);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON app_entities(entity_type, phone) WHERE entity_type='booking';
CREATE INDEX IF NOT EXISTS idx_bookings_window ON app_entities(car_id, pickup_at, return_at) WHERE entity_type='booking';
CREATE INDEX IF NOT EXISTS idx_sessions_active ON auth_sessions(user_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_events_booking ON payment_events(booking_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_refunds_booking ON refunds(booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outbox_attempts ON notification_outbox(status, attempts, available_at);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_buckets(window_started_at);

-- Shared rate limiting across all application instances.
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_buckets(window_started_at);

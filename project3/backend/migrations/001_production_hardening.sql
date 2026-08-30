-- Al-Rufqah production hardening migration.
-- The application runtime uses app_entities as a safe document boundary while the
-- existing normalized schema remains available for reporting/integration work.
CREATE TABLE IF NOT EXISTS app_entities (
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  data JSONB NOT NULL,
  car_id TEXT,
  pickup_at TIMESTAMPTZ,
  return_at TIMESTAMPTZ,
  status TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_type, entity_id)
);
CREATE INDEX IF NOT EXISTS idx_app_entities_type ON app_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_app_entities_booking_window ON app_entities(entity_type, car_id, pickup_at, return_at, status);
CREATE INDEX IF NOT EXISTS idx_app_entities_email ON app_entities(entity_type, email);
CREATE INDEX IF NOT EXISTS idx_app_entities_status ON app_entities(entity_type, status);

-- Prevent obviously invalid booking windows at the persistence boundary.
CREATE OR REPLACE FUNCTION validate_booking_entity() RETURNS trigger AS $$
BEGIN
  IF NEW.entity_type = 'booking' AND NEW.pickup_at IS NOT NULL AND NEW.return_at IS NOT NULL AND NEW.return_at <= NEW.pickup_at THEN
    RAISE EXCEPTION 'return_at must be after pickup_at';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_validate_booking_entity ON app_entities;
CREATE TRIGGER trg_validate_booking_entity BEFORE INSERT OR UPDATE ON app_entities FOR EACH ROW EXECUTE FUNCTION validate_booking_entity();

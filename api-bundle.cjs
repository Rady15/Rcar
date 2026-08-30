var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// backend/production-db.ts
var production_db_exports = {};
__export(production_db_exports, {
  ProductionDB: () => ProductionDB
});
var import_node_crypto, ProductionDB;
var init_production_db = __esm({
  "backend/production-db.ts"() {
    import_node_crypto = require("node:crypto");
    ProductionDB = class _ProductionDB {
      constructor(pool) {
        this.pool = null;
        this.memory = /* @__PURE__ */ new Map();
        this.sessions = /* @__PURE__ */ new Map();
        this.devRateLimits = /* @__PURE__ */ new Map();
        this.pool = pool;
        this.persistent = Boolean(pool);
        for (const type of ["car", "branch", "booking", "user", "blog", "roadside", "inspection", "corporate", "audit", "contact", "offer", "usedCar", "loyaltyTier", "subscription", "faq", "seo", "paymentSettings", "usedCarLead", "protectionPlan", "addon", "category"]) this.memory.set(type, /* @__PURE__ */ new Map());
      }
      static async create() {
        if (!process.env.DATABASE_URL) {
          if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production");
          return new _ProductionDB(null);
        }
        const mod = await import("pg");
        let dbUrl = String(process.env.DATABASE_URL || "");
        dbUrl = dbUrl.replace(/[?&]channel_binding=[^&]+/gi, "").replace(/\?$/, "");
        const sslHint = /(neon\.tech|supabase|rds\.amazonaws|render\.com|herokuapp|amazonaws|sslmode=require|sslmode=verify)/i.test(dbUrl);
        const sslEnabled = process.env.DATABASE_SSL === "true" || sslHint || process.env.NODE_ENV === "production" && process.env.DATABASE_SSL !== "false";
        const pool = new mod.Pool({ connectionString: dbUrl, max: Number(process.env.DB_POOL_MAX || 10), idleTimeoutMillis: 3e4, connectionTimeoutMillis: 1e4, ssl: sslEnabled ? { rejectUnauthorized: false } : void 0 });
        const db2 = new _ProductionDB(pool);
        await db2.migrate();
        return db2;
      }
      async migrate() {
        await this.pool.query(`
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
      CREATE TABLE IF NOT EXISTS rate_limit_buckets (key TEXT PRIMARY KEY, window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(), count INTEGER NOT NULL DEFAULT 0);
      CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_buckets(window_started_at);
    `);
        await this.pool.query(`CREATE TABLE IF NOT EXISTS idempotency_keys (key TEXT NOT NULL, scope TEXT NOT NULL, response JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'), PRIMARY KEY (key, scope));
      CREATE TABLE IF NOT EXISTS auth_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, role TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, revoked_at TIMESTAMPTZ);
      CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id, expires_at);
      CREATE TABLE IF NOT EXISTS payment_events (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, provider TEXT NOT NULL, provider_event_id TEXT NOT NULL, booking_id TEXT, status TEXT NOT NULL, payload JSONB NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(provider, provider_event_id));
      CREATE TABLE IF NOT EXISTS integration_events (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, integration TEXT NOT NULL, correlation_id TEXT NOT NULL, operation TEXT NOT NULL, status TEXT NOT NULL, request_payload JSONB, response_payload JSONB, error_message TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, invoice_number TEXT UNIQUE NOT NULL, booking_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', currency CHAR(3) NOT NULL DEFAULT 'SAR', subtotal NUMERIC(14,2) NOT NULL DEFAULT 0, vat_amount NUMERIC(14,2) NOT NULL DEFAULT 0, total_amount NUMERIC(14,2) NOT NULL DEFAULT 0, invoice_payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS refunds (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, booking_id TEXT NOT NULL, payment_reference TEXT, amount NUMERIC(14,2) NOT NULL CHECK(amount > 0), currency CHAR(3) NOT NULL DEFAULT 'SAR', reason TEXT, status TEXT NOT NULL DEFAULT 'requested', provider_reference TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS notification_outbox (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, channel TEXT NOT NULL, recipient TEXT NOT NULL, template TEXT NOT NULL, payload JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, available_at TIMESTAMPTZ NOT NULL DEFAULT now(), sent_at TIMESTAMPTZ, last_error TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS vehicle_status_history (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, vehicle_id TEXT NOT NULL, previous_status TEXT, new_status TEXT NOT NULL, reason TEXT, actor_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS maintenance_work_orders (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, vehicle_id TEXT NOT NULL, branch_id TEXT, status TEXT NOT NULL DEFAULT 'open', type TEXT NOT NULL, description TEXT, odometer INTEGER, estimated_cost NUMERIC(14,2), actual_cost NUMERIC(14,2), scheduled_at TIMESTAMPTZ, completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS security_audit_events (id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text))::uuid, actor_id TEXT, action TEXT NOT NULL, resource_type TEXT, resource_id TEXT, ip_address INET, user_agent TEXT, before_data JSONB, after_data JSONB, request_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
    `);
        await this.pool.query(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='idempotency_keys_pkey') THEN ALTER TABLE idempotency_keys DROP CONSTRAINT idempotency_keys_pkey; END IF; EXCEPTION WHEN undefined_table THEN NULL; END $$; CREATE UNIQUE INDEX IF NOT EXISTS uq_idempotency_key_scope ON idempotency_keys(key,scope); CREATE INDEX IF NOT EXISTS idx_sessions_active ON auth_sessions(user_id,expires_at) WHERE revoked_at IS NULL;`);
      }
      async ping() {
        if (!this.persistent) return true;
        await this.pool.query("SELECT 1");
        return true;
      }
      async consumeRateLimit(key, limit, windowMs) {
        const now = Date.now();
        if (!this.persistent) {
          const current = this.devRateLimits.get(key);
          if (!current || now >= current.reset) {
            this.devRateLimits.set(key, { count: 1, reset: now + windowMs });
            return { allowed: true, retryAfterMs: 0 };
          }
          current.count += 1;
          return { allowed: current.count <= limit, retryAfterMs: Math.max(0, current.reset - now) };
        }
        if (Math.random() < 0.01) void this.pool.query("DELETE FROM rate_limit_buckets WHERE window_started_at < now() - interval '24 hours'").catch(() => {
        });
        const { rows } = await this.pool.query(`
      INSERT INTO rate_limit_buckets(key, window_started_at, count)
      VALUES ($1, now(), 1)
      ON CONFLICT (key) DO UPDATE
      SET count = CASE
        WHEN rate_limit_buckets.window_started_at <= now() - ($2::bigint * interval '1 millisecond') THEN 1
        ELSE rate_limit_buckets.count + 1
      END,
      window_started_at = CASE
        WHEN rate_limit_buckets.window_started_at <= now() - ($2::bigint * interval '1 millisecond') THEN now()
        ELSE rate_limit_buckets.window_started_at
      END
      RETURNING count, GREATEST(0, EXTRACT(EPOCH FROM (($2::bigint * interval '1 millisecond') - (now() - window_started_at))) * 1000)::bigint AS retry_ms
    `, [key, windowMs]);
        const row = rows[0];
        return { allowed: Number(row.count) <= limit, retryAfterMs: Number(row.retry_ms || 0) };
      }
      async list(type) {
        if (!this.persistent) return [...this.memory.get(type)?.values() || []];
        const { rows } = await this.pool.query("SELECT data FROM app_entities WHERE entity_type=$1 ORDER BY created_at DESC", [type]);
        return rows.map((r) => r.data);
      }
      async get(type, id2) {
        if (!this.persistent) return this.memory.get(type)?.get(id2) || null;
        const { rows } = await this.pool.query("SELECT data FROM app_entities WHERE entity_type=$1 AND entity_id=$2", [type, id2]);
        return rows[0]?.data || null;
      }
      async put(type, value, meta = {}) {
        const id2 = value.id || value.bookingId || (0, import_node_crypto.randomUUID)();
        const normalized = { ...value, ...type === "booking" ? { id: void 0 } : {} };
        if (type === "booking") normalized.bookingId = value.bookingId || id2;
        delete normalized.id;
        const stored = type === "booking" ? normalized : { ...value, id: id2 };
        if (!this.persistent) {
          this.memory.get(type).set(id2, stored);
          return stored;
        }
        await this.pool.query(`INSERT INTO app_entities(entity_type,entity_id,data,car_id,pickup_at,return_at,status,email,phone) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(entity_type,entity_id) DO UPDATE SET data=EXCLUDED.data,car_id=EXCLUDED.car_id,pickup_at=EXCLUDED.pickup_at,return_at=EXCLUDED.return_at,status=EXCLUDED.status,email=EXCLUDED.email,phone=EXCLUDED.phone,updated_at=now()`, [type, id2, stored, meta.car_id || null, meta.pickup_at || null, meta.return_at || null, meta.status || null, meta.email || null, meta.phone || null]);
        return stored;
      }
      async remove(type, id2) {
        if (!this.persistent) return this.memory.get(type).delete(id2);
        const r = await this.pool.query("DELETE FROM app_entities WHERE entity_type=$1 AND entity_id=$2", [type, id2]);
        return r.rowCount > 0;
      }
      async cars() {
        return this.list("car");
      }
      async branches() {
        return this.list("branch");
      }
      async categories() {
        return this.list("category");
      }
      async saveCategory(category) {
        return this.put("category", category);
      }
      async deleteCategory(id2) {
        return this.remove("category", id2);
      }
      async bookings() {
        return this.list("booking");
      }
      async users() {
        return this.list("user");
      }
      async blog() {
        return this.list("blog");
      }
      async roadside() {
        return this.list("roadside");
      }
      async inspections() {
        return this.list("inspection");
      }
      async corporate() {
        return this.list("corporate");
      }
      async audits() {
        return this.list("audit");
      }
      async contacts() {
        return this.list("contact");
      }
      async content(type) {
        return this.list(type);
      }
      async saveContent(type, value) {
        return this.put(type, value);
      }
      async deleteContent(type, id2) {
        return this.remove(type, id2);
      }
      async saveCar(car) {
        return this.put("car", car, { status: car.status });
      }
      async saveBranch(branch) {
        return this.put("branch", branch);
      }
      async saveBooking(booking) {
        return this.put("booking", booking, { car_id: booking.car.id, pickup_at: `${booking.searchCriteria.pickupDate}T${booking.searchCriteria.pickupTime}:00+03:00`, return_at: `${booking.searchCriteria.returnDate}T${booking.searchCriteria.returnTime}:00+03:00`, status: booking.status, email: booking.customer.email, phone: booking.customer.phone });
      }
      /** Atomically checks availability and inserts a booking. This is the production path used by the API. */
      async createBookingAtomic(booking) {
        const pickup = `${booking.searchCriteria.pickupDate}T${booking.searchCriteria.pickupTime}:00+03:00`;
        const ret = `${booking.searchCriteria.returnDate}T${booking.searchCriteria.returnTime}:00+03:00`;
        if (!this.persistent) {
          if (!await this.hasAvailability(booking.car.id, pickup, ret)) return null;
          return this.saveBooking(booking);
        }
        const client = await this.pool.connect();
        try {
          await client.query("BEGIN");
          await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [booking.car.id]);
          const conflict = await client.query(`SELECT 1 FROM app_entities WHERE entity_type='booking' AND car_id=$1 AND status NOT IN ('cancelled','completed') AND pickup_at < $3::timestamptz AND return_at > $2::timestamptz LIMIT 1`, [booking.car.id, pickup, ret]);
          if (conflict.rowCount) {
            await client.query("ROLLBACK");
            return null;
          }
          const bookingId = booking.bookingId || `RUF-${Math.floor(1e4 + Math.random() * 9e4)}`;
          const final = { ...booking, bookingId, createdAt: (/* @__PURE__ */ new Date()).toISOString(), status: booking.status || "confirmed" };
          const id2 = bookingId;
          const stored = { ...final };
          delete stored.id;
          await client.query(`INSERT INTO app_entities(entity_type,entity_id,data,car_id,pickup_at,return_at,status,email,phone) VALUES('booking',$1,$2,$3,$4,$5,$6,$7,$8)`, [id2, stored, booking.car.id, pickup, ret, stored.status, stored.customer?.email || null, stored.customer?.phone || null]);
          await client.query("COMMIT");
          return final;
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        } finally {
          client.release();
        }
      }
      async saveUser(user) {
        return this.put("user", user, { email: user.email, phone: user.phone });
      }
      async saveBlog(post) {
        return this.put("blog", post);
      }
      async saveRoadside(ticket) {
        return this.put("roadside", ticket, { status: ticket.status, phone: ticket.callerPhone });
      }
      async saveInspection(report) {
        return this.put("inspection", report);
      }
      async saveCorporate(inquiry) {
        return this.put("corporate", inquiry, { status: inquiry.status, email: inquiry.email, phone: inquiry.phone });
      }
      async saveAudit(log) {
        return this.put("audit", log);
      }
      async saveContact(msg) {
        return this.put("contact", msg, { status: msg.status, email: msg.email || null, phone: msg.phone });
      }
      async deleteCar(id2) {
        return this.remove("car", id2);
      }
      async deleteBranch(id2) {
        return this.remove("branch", id2);
      }
      async deleteUser(id2) {
        return this.remove("user", id2);
      }
      async deleteBlog(id2) {
        return this.remove("blog", id2);
      }
      async deleteContact(id2) {
        return this.remove("contact", id2);
      }
      async deleteBooking(id2) {
        return this.remove("booking", id2);
      }
      async findBooking(id2, secret) {
        if (!this.persistent) {
          const all = await this.bookings();
          const b = all.find((x) => x.bookingId.toUpperCase() === id2.toUpperCase());
          if (!b) return null;
          if (secret && ![b.customer.phone, b.customer.idNumber, b.customer.email].includes(secret)) return null;
          return b;
        }
        const params = [id2];
        let sql = "SELECT data FROM app_entities WHERE entity_type='booking' AND entity_id=$1";
        if (secret) {
          sql += " AND (phone=$2 OR email=$2 OR data->'customer'->>'idNumber'=$2)";
          params.push(secret);
        }
        const { rows } = await this.pool.query(sql, params);
        return rows[0]?.data || null;
      }
      async hasAvailability(carId, pickup, ret, excludeBookingId) {
        if (!this.persistent) {
          const all = await this.bookings();
          return !all.some((b) => b.car?.id === carId && b.status !== "cancelled" && b.bookingId !== excludeBookingId && `${b.searchCriteria.pickupDate}T${b.searchCriteria.pickupTime}` < ret && `${b.searchCriteria.returnDate}T${b.searchCriteria.returnTime}` > pickup);
        }
        const params = [carId, pickup, ret];
        let sql = `SELECT 1 FROM app_entities WHERE entity_type='booking' AND car_id=$1 AND status NOT IN ('cancelled','completed') AND pickup_at < $3::timestamptz AND return_at > $2::timestamptz`;
        if (excludeBookingId) {
          sql += " AND entity_id<>$4";
          params.push(excludeBookingId);
        }
        const { rowCount } = await this.pool.query(sql, params);
        return rowCount === 0;
      }
      async seedIfEmpty(seed) {
        const count = this.persistent ? Number((await this.pool.query("SELECT count(*)::int AS n FROM app_entities")).rows[0].n) : [...this.memory.values()].reduce((n, m) => n + m.size, 0);
        if (count > 0) return false;
        for (const x of seed.cars) await this.saveCar(x);
        for (const x of seed.branches) await this.saveBranch(x);
        for (const x of seed.blog) await this.saveBlog(x);
        for (const x of seed.users) await this.saveUser(x);
        for (const x of seed.bookings) await this.saveBooking(x);
        for (const x of seed.roadside) await this.saveRoadside(x);
        for (const x of seed.inspections) await this.saveInspection(x);
        for (const x of seed.corporate) await this.saveCorporate(x);
        for (const x of seed.audits) await this.saveAudit(x);
        return true;
      }
      async createSession(tokenHash, userId, role2, ttlMs) {
        const expires = Date.now() + ttlMs;
        if (!this.persistent) {
          this.sessions.set(tokenHash, { userId, role: role2, expiresAt: expires });
          return;
        }
        await this.pool.query("INSERT INTO auth_sessions(token_hash,user_id,role,expires_at) VALUES($1,$2,$3,to_timestamp($4/1000.0))", [tokenHash, userId, role2, expires]);
      }
      async getSession(tokenHash) {
        if (!this.persistent) {
          const s = this.sessions.get(tokenHash);
          if (!s || s.expiresAt < Date.now()) {
            this.sessions.delete(tokenHash);
            return null;
          }
          return s;
        }
        const { rows } = await this.pool.query('SELECT user_id AS "userId", role, expires_at AS "expiresAt" FROM auth_sessions WHERE token_hash=$1 AND revoked_at IS NULL AND expires_at>now()', [tokenHash]);
        if (!rows[0]) return null;
        return { userId: rows[0].userId, role: rows[0].role, expiresAt: new Date(rows[0].expiresAt).getTime() };
      }
      async revokeSession(tokenHash) {
        if (!this.persistent) {
          this.sessions.delete(tokenHash);
          return;
        }
        await this.pool.query("UPDATE auth_sessions SET revoked_at=now() WHERE token_hash=$1 AND revoked_at IS NULL", [tokenHash]);
      }
      async enqueueNotification(channel, recipient, template, payload) {
        if (!this.persistent) return null;
        const { rows } = await this.pool.query("INSERT INTO notification_outbox(channel,recipient,template,payload) VALUES($1,$2,$3,$4) RETURNING id", [channel, recipient, template, payload]);
        return rows[0]?.id || null;
      }
      async claimNotifications(limit = 20) {
        if (!this.persistent) return [];
        const client = await this.pool.connect();
        try {
          await client.query("BEGIN");
          const { rows } = await client.query(`SELECT id,channel,recipient,template,payload,attempts FROM notification_outbox WHERE status='pending' AND available_at<=now() ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT $1`, [limit]);
          if (rows.length) await client.query(`UPDATE notification_outbox SET status='processing',attempts=attempts+1 WHERE id=ANY($1::uuid[])`, [rows.map((r) => r.id)]);
          await client.query("COMMIT");
          return rows;
        } catch (e) {
          await client.query("ROLLBACK");
          throw e;
        } finally {
          client.release();
        }
      }
      async completeNotification(id2, ok, error) {
        if (!this.persistent) return;
        if (ok) await this.pool.query(`UPDATE notification_outbox SET status='sent',sent_at=now(),last_error=NULL WHERE id=$1`, [id2]);
        else await this.pool.query(`UPDATE notification_outbox SET status=CASE WHEN attempts>=5 THEN 'failed' ELSE 'pending' END,available_at=now()+make_interval(secs => LEAST(3600, power(2,attempts)::int*10)),last_error=$2 WHERE id=$1`, [id2, error || "Delivery failed"]);
      }
      async claimIdempotency(key, scope) {
        if (!this.persistent) return { claimed: true, response: null };
        const existing = await this.pool.query("SELECT response FROM idempotency_keys WHERE key=$1 AND scope=$2 AND expires_at>now()", [key, scope]);
        if (existing.rows[0]) return { claimed: false, response: existing.rows[0].response ?? null };
        try {
          const inserted = await this.pool.query("INSERT INTO idempotency_keys(key,scope) VALUES($1,$2) ON CONFLICT(key,scope) DO NOTHING", [key, scope]);
          if (inserted.rowCount !== 1) {
            const row = await this.pool.query("SELECT response FROM idempotency_keys WHERE key=$1 AND scope=$2 AND expires_at>now()", [key, scope]);
            return { claimed: false, response: row.rows[0]?.response ?? null };
          }
          return { claimed: true, response: null };
        } catch {
          return { claimed: false, response: null };
        }
      }
      async completeIdempotency(key, response) {
        if (!this.persistent) return;
        await this.pool.query("UPDATE idempotency_keys SET response=$3 WHERE key=$1 AND scope=$2", [key, "booking-create", response]);
      }
      async recordPaymentEvent(provider, providerEventId, bookingId, status, payload) {
        if (!this.persistent) return true;
        const result = await this.pool.query(
          "INSERT INTO payment_events(provider,provider_event_id,booking_id,status,payload) VALUES($1,$2,$3,$4,$5) ON CONFLICT(provider,provider_event_id) DO NOTHING",
          [provider, providerEventId, bookingId, status, payload]
        );
        return result.rowCount === 1;
      }
    };
  }
});

// api/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => handler
});
module.exports = __toCommonJS(index_exports);

// server.ts
var import_dotenv = require("dotenv");
var import_express = __toESM(require("express"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_crypto2 = __toESM(require("node:crypto"), 1);
init_production_db();

// src/data/cars.ts
var CARS_DATA = [
  {
    id: "car-s500",
    name: { ar: "\u0645\u0631\u0633\u064A\u062F\u0633-\u0628\u0646\u0632 S500 \u0644\u064A\u0645\u0648\u0632\u064A\u0646 2025", en: "Mercedes-Benz S500 Limousine 2025" },
    brand: "Mercedes-Benz",
    modelYear: 2025,
    category: "luxury",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 1850,
    weeklyPrice: 11800,
    monthlyPrice: 39e3,
    seats: 5,
    luggage: 4,
    doors: 4,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "3.0L Turbo Inline-6 EQ Boost 429 HP",
    features: {
      ar: ["\u0645\u0642\u0627\u0639\u062F \u062E\u0644\u0641\u064A\u0629 \u0645\u0646 \u0627\u0644\u062F\u0631\u062C\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 VIP \u0645\u0639 \u062A\u062F\u0644\u064A\u0643 \u0648\u062A\u062F\u0641\u0626\u0629 \u0648\u062A\u0628\u0631\u064A\u062F", "\u0646\u0638\u0627\u0645 \u0635\u0648\u062A\u064A Burmester High-End 4D", "\u0634\u0627\u0634\u0627\u062A \u062A\u0631\u0641\u064A\u0647 \u062E\u0644\u0641\u064A\u0629 \u0645\u0633\u062A\u0642\u0644\u0629 MBUX", "\u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u0645\u062D\u0648\u0631 \u0627\u0644\u062E\u0644\u0641\u064A \u0648\u0646\u0638\u0627\u0645 \u062A\u0639\u0644\u064A\u0642 \u0647\u0648\u0627\u0626\u064A AIRMATIC", "\u0634\u0627\u0634\u0629 \u0639\u0631\u0636 \u0639\u0644\u0649 \u0627\u0644\u0632\u062C\u0627\u062C HUD \u062B\u0644\u0627\u062B\u064A\u0629 \u0627\u0644\u0623\u0628\u0639\u0627\u062F"],
      en: ["First-Class Rear Executive Seats with Massage & Cooling", "Burmester High-End 4D Surround Sound", "Dual Rear MBUX Entertainment Tablets", "Rear-Axle Steering & AIRMATIC Air Suspension", "Augmented Reality 3D Head-Up Display"]
    },
    isPopular: true,
    isSpecialOffer: true,
    discountPercentage: 10,
    availableQuantity: 4,
    minDriverAge: 25,
    depositRequired: 5e3,
    includedMileagePerDay: 250
  },
  {
    id: "car-escalade",
    name: { ar: "\u0643\u0627\u062F\u064A\u0644\u0627\u0643 \u0625\u0633\u0643\u0627\u0644\u064A\u062F \u0628\u0644\u0627\u062A\u064A\u0646\u064A\u0648\u0645 2025 V8", en: "Cadillac Escalade Platinum 2025 V8" },
    brand: "Cadillac",
    modelYear: 2025,
    category: "luxury",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 1650,
    weeklyPrice: 10500,
    monthlyPrice: 36e3,
    seats: 7,
    luggage: 6,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "6.2L V8 EcoTec3 420 HP",
    features: {
      ar: ["\u0634\u0627\u0634\u0629 OLED \u0645\u0646\u062D\u0646\u064A\u0629 \u0645\u0642\u0627\u0633 38 \u0628\u0648\u0635\u0629 \u0628\u062F\u0642\u0629 4K", "\u0646\u0638\u0627\u0645 \u0635\u0648\u062A\u064A \u0627\u0633\u062A\u0648\u062F\u064A\u0648 AKG \u0628\u0640 36 \u0645\u0643\u0628\u0631 \u0635\u0648\u062A", "\u0623\u0628\u0648\u0627\u0628 \u0634\u0641\u0637 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0648\u062B\u0644\u0627\u062C\u0629 \u062A\u0628\u0631\u064A\u062F \u0645\u062F\u0645\u062C\u0629", "\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 \u0628\u0627\u0644\u0623\u0634\u0639\u0629 \u062A\u062D\u062A \u0627\u0644\u062D\u0645\u0631\u0627\u0621 \u0648\u0646\u0638\u0627\u0645 \u062A\u062B\u0628\u064A\u062A \u0633\u0631\u0639\u0629 \u0641\u0627\u0626\u0642", "\u062F\u0641\u0639 \u0631\u0628\u0627\u0639\u064A \u0645\u0633\u062A\u0645\u0631 \u0645\u0639 \u062A\u0639\u0644\u064A\u0642 \u0647\u0648\u0627\u0626\u064A \u0645\u062A\u0643\u064A\u0641"],
      en: ["Curved 38-inch 4K OLED Display", "AKG Studio 36-Speaker Reference Sound", "Soft-Close Doors & Center Console Cooler", "Night Vision Infrared & Super Cruise", "Full-Time 4WD with Adaptive Air Ride"]
    },
    isPopular: true,
    availableQuantity: 5,
    minDriverAge: 25,
    depositRequired: 4e3,
    includedMileagePerDay: 300
  },
  {
    id: "car-porsche-911",
    name: { ar: "\u0628\u0648\u0631\u0634 911 \u0643\u0627\u0631\u064A\u0631\u0627 GTS 2025", en: "Porsche 911 Carrera GTS 2025" },
    brand: "Porsche",
    modelYear: 2025,
    category: "luxury",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 2200,
    weeklyPrice: 14e3,
    monthlyPrice: 48e3,
    seats: 2,
    luggage: 2,
    doors: 2,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "3.0L Twin-Turbo Flat-6 473 HP",
    features: {
      ar: ["\u062A\u0633\u0627\u0631\u0639 \u0645\u0646 0 \u0625\u0644\u0649 100 \u0643\u0645/\u0633 \u062E\u0644\u0627\u0644 3.3 \u062B\u0627\u0646\u064A\u0629", "\u0628\u0627\u0642\u0629 Sport Chrono \u0645\u0639 \u0639\u0627\u062F\u0645 \u0631\u064A\u0627\u0636\u064A \u0646\u0634\u0637", "\u0645\u0643\u0627\u0628\u062D \u0643\u0631\u0628\u0648\u0646 \u0633\u064A\u0631\u0627\u0645\u064A\u0643 PCCB", "\u0646\u0638\u0627\u0645 \u0635\u0648\u062A\u064A \u0641\u0627\u062E\u0631 \u0645\u0646 BOSE", "\u0639\u062C\u0644\u0627\u062A GTS \u0631\u064A\u0627\u0636\u064A\u0629 \u0628\u0642\u0641\u0644 \u0645\u0631\u0643\u0632\u064A"],
      en: ["0-100 km/h in 3.3 seconds", "Sport Chrono Package with Active Sports Exhaust", "Porsche Ceramic Composite Brakes (PCCB)", "BOSE Surround Sound System", "Center-Locking Lightweight GTS Wheels"]
    },
    isSpecialOffer: true,
    discountPercentage: 15,
    availableQuantity: 2,
    minDriverAge: 25,
    depositRequired: 6e3,
    includedMileagePerDay: 200
  },
  {
    id: "car-bmw-7",
    name: { ar: "\u0628\u064A \u0625\u0645 \u062F\u0628\u0644\u064A\u0648 \u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0633\u0627\u0628\u0639\u0629 735i M-Sport 2025", en: "BMW 7-Series 735i M-Sport 2025" },
    brand: "BMW",
    modelYear: 2025,
    category: "luxury",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 1500,
    weeklyPrice: 9600,
    monthlyPrice: 32500,
    seats: 5,
    luggage: 4,
    doors: 4,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "3.0L TwinPower Turbo Mild Hybrid 286 HP",
    features: {
      ar: ["\u0634\u0627\u0634\u0629 \u0627\u0644\u0633\u064A\u0646\u0645\u0627 \u0627\u0644\u062E\u0644\u0641\u064A\u0629 BMW Theatre Screen \u0645\u0642\u0627\u0633 31.3 \u0628\u0648\u0635\u0629 8K", "\u0623\u0628\u0648\u0627\u0628 \u0623\u0648\u062A\u0648\u0645\u0627\u062A\u064A\u0643\u064A\u0629 \u062A\u0641\u062A\u062D \u0648\u062A\u063A\u0644\u0642 \u0628\u0627\u0644\u0644\u0645\u0633", "\u0646\u0638\u0627\u0645 Bowers & Wilkins Diamond \u0627\u0644\u0635\u0648\u062A\u064A \u0627\u0644\u0645\u062D\u064A\u0637\u064A", "\u0625\u0636\u0627\u0621\u0629 \u0645\u062D\u064A\u0637\u064A\u0629 \u062A\u0641\u0627\u0639\u0644\u064A\u0629 Interaction Bar", "\u0633\u0642\u0641 \u0628\u0627\u0646\u0648\u0631\u0627\u0645\u064A \u0628\u0625\u0636\u0627\u0621\u0629 LED Sky Lounge"],
      en: ['31.3" 8K BMW Rear Theatre Screen', "Automatic Touchless Power Doors", "Bowers & Wilkins Diamond Surround Sound", "Dynamic BMW Interaction Bar", "Sky Lounge Panoramic Glass Sunroof"]
    },
    isPopular: true,
    availableQuantity: 4,
    minDriverAge: 25,
    depositRequired: 4e3,
    includedMileagePerDay: 250
  },
  {
    id: "car-landcruiser",
    name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627 \u0644\u0627\u0646\u062F\u0643\u0631\u0648\u0632\u0631 VXR 2025 \u062A\u0648\u064A\u0646 \u062A\u064A\u0631\u0628\u0648", en: "Toyota Land Cruiser VXR 2025 Twin-Turbo" },
    brand: "Toyota",
    modelYear: 2025,
    category: "suv",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 790,
    weeklyPrice: 5100,
    monthlyPrice: 17500,
    seats: 7,
    luggage: 5,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "3.5L Twin-Turbo V6 409 HP",
    features: {
      ar: ["\u062F\u0641\u0639 \u0631\u0628\u0627\u0639\u064A \u0645\u0633\u062A\u0645\u0631 \u0645\u0639 \u0646\u0638\u0627\u0645 \u0627\u0644\u0632\u062D\u0641 \u0648\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u062A\u0636\u0627\u0631\u064A\u0633 MTS", "\u0645\u0642\u0627\u0639\u062F \u062C\u0644\u062F \u0641\u0627\u062E\u0631\u0629 \u0645\u0639 \u062A\u0628\u0631\u064A\u062F \u0648\u062A\u062F\u0641\u0626\u0629 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0635\u0641\u0648\u0641", "\u0646\u0638\u0627\u0645 \u0635\u0648\u062A\u064A JBL \u0628\u0640 14 \u0633\u0645\u0627\u0639\u0629", "\u0634\u0627\u0634\u0629 \u0645\u0644\u0627\u062D\u0629 12.3 \u0628\u0648\u0635\u0629 \u0648\u0634\u0627\u0634\u0627\u062A \u062E\u0644\u0641\u064A\u0629", "\u062B\u0644\u0627\u062C\u0629 \u0645\u062F\u0645\u062C\u0629 \u0648\u0641\u062A\u062D\u0629 \u0633\u0642\u0641"],
      en: ["Full-Time 4WD with Multi-Terrain Select & Crawl", "Premium Leather with Multi-Row Climate Seats", "JBL 14-Speaker Audio", '12.3" Nav Display & Dual Rear Entertainment', "Integrated Cool Box & Sunroof"]
    },
    isPopular: true,
    availableQuantity: 8,
    minDriverAge: 25,
    depositRequired: 2e3,
    includedMileagePerDay: 350
  },
  {
    id: "car-patrol",
    name: { ar: "\u0646\u064A\u0633\u0627\u0646 \u0628\u0627\u062A\u0631\u0648\u0644 \u062A\u064A\u062A\u0627\u0646\u064A\u0648\u0645 V8 2025 (\u0628\u0637\u0644 \u0627\u0644\u062F\u0631\u0648\u0628)", en: "Nissan Patrol Titanium V8 2025" },
    brand: "Nissan",
    modelYear: 2025,
    category: "suv",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 650,
    weeklyPrice: 4200,
    monthlyPrice: 14500,
    seats: 8,
    luggage: 5,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "5.6L V8 400 HP",
    features: {
      ar: ["\u0645\u062D\u0631\u0643 V8 \u062C\u0628\u0627\u0631 400 \u062D\u0635\u0627\u0646", "\u0646\u0638\u0627\u0645 \u0627\u0644\u062A\u062D\u0643\u0645 \u0627\u0644\u0647\u064A\u062F\u0631\u0648\u0644\u064A\u0643\u064A \u0628\u062D\u0631\u0643\u0629 \u0647\u064A\u0643\u0644 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 HBMC", "\u0646\u0638\u0627\u0645 Bose Premium \u0627\u0644\u0635\u0648\u062A\u064A \u0628\u0640 13 \u0645\u0643\u0628\u0631 \u0635\u0648\u062A", "8 \u0645\u0642\u0627\u0639\u062F \u0631\u062D\u0628\u0629 \u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u0633\u0641\u0631 \u0648\u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062A", "\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0645\u062D\u0631\u0643 \u0639\u0646 \u0628\u0639\u062F"],
      en: ["Potent 5.6L 400 HP V8 Powertrain", "Hydraulic Body Motion Control (HBMC)", "Bose 13-Speaker Acoustic System", "8 Generous Travel Seats", "Remote Engine Starter"]
    },
    isPopular: true,
    availableQuantity: 10,
    minDriverAge: 25,
    depositRequired: 1800,
    includedMileagePerDay: 350
  },
  {
    id: "car-yukon",
    name: { ar: "\u062C\u064A \u0625\u0645 \u0633\u064A \u064A\u0648\u0643\u0646 \u062F\u064A\u0646\u0627\u0644\u064A 2025 V8", en: "GMC Yukon Denali 2025 V8" },
    brand: "GMC",
    modelYear: 2025,
    category: "family",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 720,
    weeklyPrice: 4600,
    monthlyPrice: 15800,
    seats: 8,
    luggage: 6,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "6.2L EcoTec3 V8 420 HP",
    features: {
      ar: ["\u0641\u062E\u0627\u0645\u0629 \u062F\u064A\u0646\u0627\u0644\u064A \u0627\u0644\u062D\u0635\u0631\u064A\u0629 \u0645\u0639 \u0645\u0642\u0627\u0639\u062F \u062C\u0644\u062F \u0645\u0637\u0631\u0632\u0629", "\u0646\u0638\u0627\u0645 \u062A\u0639\u0644\u064A\u0642 \u0647\u0648\u0627\u0626\u064A Air Ride \u0627\u0644\u0645\u062A\u0643\u064A\u0641", "\u0646\u0638\u0627\u0645 \u0635\u0648\u062A\u064A Bose Performance \u0628\u0640 14 \u0633\u0645\u0627\u0639\u0629", "\u0643\u0648\u0646\u0633\u0648\u0644 \u0648\u0633\u0637\u064A \u0645\u0646\u0632\u0644\u0642 \u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0627\u064B", "\u0643\u0627\u0645\u064A\u0631\u0627\u062A \u0628\u0632\u0627\u0648\u064A\u0629 \u0631\u0624\u064A\u0629 360 \u062F\u0631\u062C\u0629 \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062F\u0642\u0629"],
      en: ["Exclusive Denali Luxury Trim", "Adaptive Air Ride Four-Corner Suspension", "Bose 14-Speaker Audio", "Power-Sliding Center Console", "High-Def 360 Surround Cameras"]
    },
    isPopular: true,
    availableQuantity: 7,
    minDriverAge: 25,
    depositRequired: 2e3,
    includedMileagePerDay: 350
  },
  {
    id: "car-tahoe",
    name: { ar: "\u0634\u0641\u0631\u0648\u0644\u064A\u0647 \u062A\u0627\u0647\u0648 LT 2025 V8", en: "Chevrolet Tahoe LT 2025 V8" },
    brand: "Chevrolet",
    modelYear: 2025,
    category: "family",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 580,
    weeklyPrice: 3800,
    monthlyPrice: 12500,
    seats: 8,
    luggage: 6,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "5.3L EcoTec3 V8 355 HP",
    features: {
      ar: ["8 \u0645\u0642\u0627\u0639\u062F \u0639\u0627\u0626\u0644\u064A\u0629 \u0641\u0627\u062E\u0631\u0629", "\u0645\u062D\u0631\u0643 V8 \u062C\u0628\u0627\u0631", "\u0646\u0638\u0627\u0645 \u062A\u0631\u0641\u064A\u0647 \u062E\u0644\u0641\u064A \u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0631\u0643\u0627\u0628", "\u062A\u0639\u0644\u064A\u0642 \u0645\u0631\u064A\u062D \u062C\u062F\u0627\u064B \u0648\u0639\u0632\u0644 \u0635\u0648\u062A\u064A \u0641\u0627\u0626\u0642", "\u0623\u0645\u0627\u0646 \u0639\u0627\u0644\u064A \u0645\u0639 \u0645\u0643\u0627\u0628\u062D \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629"],
      en: ["8 Luxury Family Seats", "Powerful V8 Engine", "Rear Entertainment System", "Smooth Suspension & Acoustic Soundproofing", "Advanced Automatic Emergency Braking"]
    },
    isPopular: true,
    availableQuantity: 10,
    minDriverAge: 25,
    depositRequired: 1500,
    includedMileagePerDay: 400
  },
  {
    id: "car-prado",
    name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627 \u0644\u0627\u0646\u062F\u0643\u0631\u0648\u0632\u0631 \u0628\u0631\u0627\u062F\u0648 TXL 2025 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0643\u0644\u064A\u0627\u064B", en: "All-New Toyota Prado TXL 2025" },
    brand: "Toyota",
    modelYear: 2025,
    category: "suv",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 490,
    weeklyPrice: 3200,
    monthlyPrice: 10800,
    seats: 7,
    luggage: 5,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "2.4L Turbo 4WD 281 HP",
    features: {
      ar: ["\u062A\u0635\u0645\u064A\u0645 \u0623\u064A\u0642\u0648\u0646\u064A \u0639\u0635\u0631\u064A \u062C\u062F\u064A\u062F \u0643\u0644\u064A\u0627\u064B", "7 \u0645\u0642\u0627\u0639\u062F \u0631\u062D\u0628\u0629", "\u062F\u0641\u0639 \u0631\u0628\u0627\u0639\u064A \u0630\u0643\u064A \u0648\u0642\u0641\u0644 \u062F\u0641\u0631\u0646\u0633 \u0645\u0631\u0643\u0632\u064A \u0648\u062E\u0644\u0641\u064A", "\u0634\u0627\u0634\u0629 \u0644\u0645\u0633 12.3 \u0628\u0648\u0635\u0629 \u0648\u0646\u0638\u0627\u0645 \u0635\u0648\u062A\u064A \u0645\u0645\u064A\u0632", "\u062B\u0644\u0627\u062C\u0629 \u0645\u062F\u0645\u062C\u0629 \u0648\u0634\u0627\u062D\u0646 \u0644\u0627\u0633\u0644\u0643\u064A"],
      en: ["All-New Iconic Design", "7 Spacious Seats", "Smart 4WD with Center & Rear Diff Lock", '12.3" Touchscreen & Premium Audio', "Cool Box & Qi Wireless Charger"]
    },
    isSpecialOffer: true,
    discountPercentage: 10,
    availableQuantity: 8,
    minDriverAge: 23,
    depositRequired: 1200,
    includedMileagePerDay: 350
  },
  {
    id: "car-lexus-es",
    name: { ar: "\u0644\u0643\u0632\u0633 ES 350 \u0641\u062E\u0627\u0645\u0629 2025 V6", en: "Lexus ES 350 Luxury 2025 V6" },
    brand: "Lexus",
    modelYear: 2025,
    category: "luxury",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 450,
    weeklyPrice: 2950,
    monthlyPrice: 9900,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "3.5L V6 302 HP",
    features: {
      ar: ["\u0641\u062E\u0627\u0645\u0629 \u064A\u0627\u0628\u0627\u0646\u064A\u0629 \u0623\u0635\u064A\u0644\u0629 \u0648\u0639\u0632\u0644 \u0635\u0648\u062A\u064A \u0644\u0627 \u064A\u0636\u0627\u0647\u0649", "\u0646\u0638\u0627\u0645 Mark Levinson \u0627\u0644\u0635\u0648\u062A\u064A \u0627\u0644\u0646\u0642\u064A \u0628\u0640 17 \u0645\u0643\u0628\u0631 \u0635\u0648\u062A", "\u062C\u0644\u062F \u0633\u064A\u0645\u064A \u0623\u0646\u064A\u0644\u064A\u0646 \u0641\u0627\u062E\u0631 \u0648\u062A\u0637\u0639\u064A\u0645\u0627\u062A \u062E\u0634\u0628 \u0634\u064A\u0645\u0627\u0645\u0648\u0643\u0648", "\u0633\u062A\u0627\u0626\u0631 \u062E\u0644\u0641\u064A\u0629 \u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0648\u062A\u0628\u0631\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0639\u062F", "\u0634\u0627\u0634\u0629 \u0645\u0644\u0627\u062D\u0629 \u0648\u0646\u0638\u0627\u0645 \u0623\u0645\u0627\u0646 \u0644\u0643\u0632\u0633 LSS+ 2.5"],
      en: ["Authentic Japanese Luxury & Whisper-Quiet Cabin", "Mark Levinson 17-Speaker Pure Audio", "Semi-Aniline Leather & Shimamoku Wood", "Power Sunshades & Multi-Level Ventilated Seats", "Lexus Safety System+ 2.5"]
    },
    isPopular: true,
    availableQuantity: 6,
    minDriverAge: 25,
    depositRequired: 1500,
    includedMileagePerDay: 350
  },
  {
    id: "car-camry",
    name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627 \u0643\u0627\u0645\u0631\u064A \u0642\u0631\u0627\u0646\u062F\u064A 2025 \u0647\u0627\u064A\u0628\u0631\u062F", en: "Toyota Camry Grande 2025 Hybrid" },
    brand: "Toyota",
    modelYear: 2025,
    category: "sedan",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 210,
    weeklyPrice: 1350,
    monthlyPrice: 4400,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: "auto",
    fuelType: "hybrid",
    engineCapacity: "2.5L 5th Gen HEV (26.0 \u0643\u0645/\u0644\u062A\u0631)",
    features: {
      ar: ["\u0645\u062D\u0631\u0643 \u0647\u0627\u064A\u0628\u0631\u062F \u0627\u0644\u062C\u064A\u0644 \u0627\u0644\u062E\u0627\u0645\u0633 \u0641\u0627\u0626\u0642 \u0627\u0644\u0627\u0642\u062A\u0635\u0627\u062F \u0648\u0627\u0644\u0642\u0648\u0629", "\u0631\u0627\u062F\u0627\u0631 \u0648\u0645\u062B\u0628\u062A \u0633\u0631\u0639\u0629 \u062A\u0643\u064A\u0641\u064A \u0648\u0646\u0638\u0627\u0645 \u062A\u062A\u0628\u0639 \u0627\u0644\u0645\u0633\u0627\u0631", "\u0645\u0642\u0627\u0639\u062F \u062C\u0644\u062F \u0641\u0627\u062E\u0631\u0629 \u0645\u0639 \u062A\u0628\u0631\u064A\u062F \u0643\u0647\u0631\u0628\u0627\u0626\u064A", "\u0646\u0638\u0627\u0645 \u0635\u0648\u062A\u064A \u0641\u0627\u062E\u0631 JBL \u0648\u0634\u0627\u062D\u0646 \u0644\u0627\u0633\u0644\u0643\u064A", "\u0634\u0627\u0634\u0629 \u0639\u0631\u0636 \u0639\u0644\u0649 \u0627\u0644\u0632\u062C\u0627\u062C \u0627\u0644\u0623\u0645\u0627\u0645\u064A HUD"],
      en: ["5th Gen Hybrid Powertrain (26.0 km/L)", "Full-Speed Radar & Lane Tracing Assist", "Ventilated Power Leather Seats", "Premium JBL Audio & Qi Charger", "Head-Up Display (HUD)"]
    },
    isPopular: true,
    availableQuantity: 20,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: "car-tucson",
    name: { ar: "\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u062A\u0648\u0633\u0627\u0646 \u0633\u0645\u0627\u0631\u062A 2025 AWD", en: "Hyundai Tucson Smart 2025 AWD" },
    brand: "Hyundai",
    modelYear: 2025,
    category: "suv",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 220,
    weeklyPrice: 1400,
    monthlyPrice: 4600,
    seats: 5,
    luggage: 4,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "2.0L SmartStream AWD",
    features: {
      ar: ["\u062F\u0641\u0639 \u0643\u0644\u064A \u0645\u0633\u062A\u0645\u0631 AWD", "\u0635\u0646\u062F\u0648\u0642 \u0623\u0645\u062A\u0639\u0629 \u0643\u0647\u0631\u0628\u0627\u0626\u064A \u0630\u0643\u064A", "\u062D\u0633\u0627\u0633\u0627\u062A \u0623\u0645\u0627\u0645\u064A\u0629 \u0648\u062E\u0644\u0641\u064A\u0629 \u0648\u0643\u0627\u0645\u064A\u0631\u0627 \u0631\u0624\u064A\u0629 \u0645\u062D\u064A\u0637\u064A\u0629", "\u0634\u0627\u0634\u062A\u064A\u0646 \u0631\u0642\u0645\u064A\u062A\u064A\u0646 \u0645\u062A\u0635\u0644\u062A\u064A\u0646 10.25 \u0628\u0648\u0635\u0629", "\u062F\u062E\u0648\u0644 \u0630\u0643\u064A \u0648\u062A\u0634\u063A\u064A\u0644 \u0639\u0646 \u0628\u0639\u062F"],
      en: ["Full-Time HTRAC AWD", "Smart Hands-Free Power Tailgate", "Front & Rear Ultrasonic Sensors", 'Dual 10.25" Digital Panoramic Screens', "Smart Keyless Entry & Remote Start"]
    },
    isPopular: true,
    availableQuantity: 14,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: "car-rav4",
    name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627 \u0631\u0627\u0641 \u0641\u0648\u0631 2025 \u0647\u0627\u064A\u0628\u0631\u062F 4WD", en: "Toyota RAV4 2025 Hybrid 4WD" },
    brand: "Toyota",
    modelYear: 2025,
    category: "suv",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 240,
    weeklyPrice: 1550,
    monthlyPrice: 4950,
    seats: 5,
    luggage: 4,
    doors: 5,
    transmission: "auto",
    fuelType: "hybrid",
    engineCapacity: "2.5L HEV E-Four AWD",
    features: {
      ar: ["\u0647\u0627\u064A\u0628\u0631\u062F \u062F\u0641\u0639 \u0631\u0628\u0627\u0639\u064A \u0641\u0627\u0626\u0642 \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F\u064A\u0629 \u0648\u0643\u0641\u0627\u0621\u0629 \u0648\u0642\u0648\u062F 22.2 \u0643\u0645/\u0644\u062A\u0631", "\u0646\u0638\u0627\u0645 Toyota Safety Sense \u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0627\u0644\u0633\u0627\u0626\u0642", "\u0634\u0627\u0634\u0629 \u0645\u0644\u0627\u062D\u0629 \u0639\u0631\u064A\u0636\u0629 \u062A\u062F\u0639\u0645 \u0623\u0628\u0644 \u0643\u0627\u0631\u0628\u0644\u0627\u064A", "\u0645\u0633\u0627\u062D\u0629 \u062A\u062E\u0632\u064A\u0646 \u0631\u062D\u0628\u0629 \u0648\u0635\u0646\u062F\u0648\u0642 \u062E\u0644\u0641\u064A \u0648\u0627\u0633\u0639", "\u0625\u0636\u0627\u0621\u0629 LED \u0643\u0627\u0645\u0644\u0629 \u0648\u062C\u0646\u0648\u0637 \u0623\u0644\u0645\u0646\u064A\u0648\u0645 18 \u0628\u0648\u0635\u0629"],
      en: ["Highly Reliable Hybrid E-Four AWD (22.2 km/L)", "Toyota Safety Sense Package", "Wide Screen with Wireless Apple CarPlay", "Generous Cargo Bay & Underfloor Storage", 'Full LED Matrix Headlamps & 18" Alloys']
    },
    availableQuantity: 16,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: "car-k5",
    name: { ar: "\u0643\u064A\u0627 K5 \u062C\u064A \u062A\u064A \u0644\u0627\u064A\u0646 2025", en: "Kia K5 GT-Line 2025" },
    brand: "Kia",
    modelYear: 2025,
    category: "sedan",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 195,
    weeklyPrice: 1250,
    monthlyPrice: 4100,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "2.5L GDI 194 HP",
    features: {
      ar: ["\u062A\u0635\u0645\u064A\u0645 \u0631\u064A\u0627\u0636\u064A \u0641\u062E\u0645 \u0645\u0639 \u0625\u0636\u0627\u0621\u0629 \u0645\u062D\u064A\u0637\u064A\u0629 \u062F\u064A\u0646\u0627\u0645\u064A\u0643\u064A\u0629", "\u0641\u062A\u062D\u0629 \u0633\u0642\u0641 \u0628\u0627\u0646\u0648\u0631\u0627\u0645\u0627 \u0645\u0632\u062F\u0648\u062C\u0629", "\u0631\u0624\u064A\u0629 \u0645\u062D\u064A\u0637\u064A\u0629 360 \u062F\u0631\u062C\u0629 \u0645\u0639 \u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0646\u0642\u0637\u0629 \u0627\u0644\u0639\u0645\u064A\u0627\u0621", "\u0634\u0627\u062D\u0646 \u0644\u0627\u0633\u0644\u0643\u064A \u0648\u062A\u0643\u064A\u064A\u0641 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0632\u062F\u0648\u062C", "\u062C\u0646\u0648\u0637 \u0631\u064A\u0627\u0636\u064A\u0629 \u0642\u064A\u0627\u0633 18 \u0628\u0648\u0635\u0629"],
      en: ["Striking Sporty GT Design with Dynamic Ambient Light", "Dual Panoramic Sunroof", "360 Surround Monitor & Blind Spot Cameras", "Dual-Zone Climate & Wireless Fast Charger", '18" Sport Cut Alloy Wheels']
    },
    availableQuantity: 12,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: "car-elantra",
    name: { ar: "\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0625\u0644\u0646\u062A\u0631\u0627 \u0633\u0645\u0627\u0631\u062A \u0628\u0644\u0633 2025", en: "Hyundai Elantra Smart Plus 2025" },
    brand: "Hyundai",
    modelYear: 2025,
    category: "sedan",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 155,
    weeklyPrice: 980,
    monthlyPrice: 3200,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "2.0L SmartStream MPI",
    features: {
      ar: ["\u0641\u062A\u062D\u0629 \u0633\u0642\u0641 \u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629", "\u0634\u0627\u0634\u0629 \u0644\u0645\u0633 \u062A\u062F\u0639\u0645 \u0623\u0628\u0644 \u0643\u0627\u0631\u0628\u0644\u0627\u064A \u0648\u0623\u0646\u062F\u0631\u0648\u064A\u062F \u0623\u0648\u062A\u0648", "\u0634\u0627\u062D\u0646 \u0644\u0627\u0633\u0644\u0643\u064A \u0644\u0644\u0647\u0648\u0627\u062A\u0641 \u0627\u0644\u0630\u0643\u064A\u0629", "\u0646\u0638\u0627\u0645 \u0645\u0627\u0646\u0639 \u0627\u0644\u062A\u0635\u0627\u062F\u0645 \u0648\u0645\u062B\u0628\u062A \u0627\u0644\u0633\u0631\u0639\u0629", "\u0645\u0642\u0627\u0639\u062F \u0645\u0631\u064A\u062D\u0629 \u0648\u0639\u0632\u0644 \u0647\u0648\u0627\u0626\u064A \u0645\u062A\u0637\u0648\u0631"],
      en: ["Power Sunroof", "Touchscreen with Apple CarPlay & Android Auto", "Qi Wireless Fast Charger", "Forward Collision Assist & Cruise Control", "Refined Cabin with Enhanced Noise Isolation"]
    },
    isPopular: true,
    availableQuantity: 15,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: "car-yaris",
    name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627 \u064A\u0627\u0631\u0633 YX 2025", en: "Toyota Yaris YX 2025" },
    brand: "Toyota",
    modelYear: 2025,
    category: "economy",
    image: "https://images.unsplash.com/photo-1590362891988-372561937ff7?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 125,
    weeklyPrice: 790,
    monthlyPrice: 2550,
    seats: 5,
    luggage: 2,
    doors: 4,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "1.3L 4-Cylinder CVT (22.4 \u0643\u0645/\u0644\u062A\u0631)",
    features: {
      ar: ["\u0643\u0641\u0627\u0621\u0629 \u0648\u0642\u0648\u062F \u062E\u0627\u0631\u0642\u0629 (22.4 \u0643\u0645/\u0644\u062A\u0631)", "\u0643\u0627\u0645\u064A\u0631\u0627 \u062E\u0644\u0641\u064A\u0629 \u0648\u062D\u0633\u0627\u0633\u0627\u062A \u0644\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0641\u064A \u0627\u0644\u0631\u0643\u0646", "\u0646\u0638\u0627\u0645 \u062A\u0646\u0628\u064A\u0647 \u0627\u0644\u0646\u0642\u0637\u0629 \u0627\u0644\u0639\u0645\u064A\u0627\u0621 BSM", "\u062F\u062E\u0648\u0644 \u0630\u0643\u064A \u0648\u062A\u0634\u063A\u064A\u0644 \u0628\u0635\u0645\u0629 \u0632\u0631", "\u0628\u0644\u0648\u062A\u0648\u062B \u0648\u0645\u0646\u0641\u0630 \u0634\u062D\u0646 \u0633\u0631\u064A\u0639 Type-C"],
      en: ["Top-Class Fuel Economy (22.4 km/L)", "Rear Camera & Ultrasonic Parking Sensors", "Blind Spot Monitor (BSM)", "Smart Keyless Entry & Push-Button Start", "Bluetooth & Fast USB-C Ports"]
    },
    isSpecialOffer: true,
    discountPercentage: 15,
    availableQuantity: 24,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 300
  },
  {
    id: "car-accent",
    name: { ar: "\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0623\u0643\u0633\u0646\u062A \u0633\u0645\u0627\u0631\u062A 2025", en: "Hyundai Accent Smart 2025" },
    brand: "Hyundai",
    modelYear: 2025,
    category: "economy",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 119,
    weeklyPrice: 750,
    monthlyPrice: 2450,
    seats: 5,
    luggage: 2,
    doors: 4,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "1.5L SmartStream (18.9 \u0643\u0645/\u0644\u062A\u0631)",
    features: {
      ar: ["\u0634\u0627\u0634\u0629 \u0644\u0645\u0633 8 \u0628\u0648\u0635\u0629 \u0645\u0639 \u0623\u0628\u0644 \u0643\u0627\u0631\u0628\u0644\u0627\u064A \u0648\u0623\u0646\u062F\u0631\u0648\u064A\u062F \u0623\u0648\u062A\u0648", "\u0643\u0627\u0645\u064A\u0631\u0627 \u062E\u0644\u0641\u064A\u0629 \u0645\u0639 \u062E\u0637\u0648\u0637 \u062A\u0648\u062C\u064A\u0647 \u062A\u0641\u0627\u0639\u0644\u064A\u0629", "\u062D\u0633\u0627\u0633\u0627\u062A \u0631\u0643\u0646 \u062E\u0644\u0641\u064A\u0629 \u0648\u0645\u062B\u0628\u062A \u0633\u0631\u0639\u0629", "\u0645\u0648\u0641\u0631 \u0648\u0642\u0648\u062F \u0645\u0645\u062A\u0627\u0632 \u062C\u062F\u0627\u064B \u0648\u0627\u0642\u062A\u0635\u0627\u062F\u064A", "\u062A\u0643\u064A\u064A\u0641 \u0628\u0627\u0631\u062F \u0641\u0627\u0626\u0642 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629"],
      en: ['8" Touchscreen with Apple CarPlay & Android Auto', "Rear Camera with Dynamic Guidelines", "Rear Parking Sensors & Cruise Control", "Outstanding Fuel Economy", "Powerful High-Output AC"]
    },
    isPopular: true,
    availableQuantity: 18,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 300
  },
  {
    id: "car-staria",
    name: { ar: "\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0633\u062A\u0627\u0631\u064A\u0627 VIP 2025 (9 \u0645\u0642\u0627\u0639\u062F)", en: "Hyundai Staria VIP 2025 (9 Seats)" },
    brand: "Hyundai",
    modelYear: 2025,
    category: "commercial",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80",
    dailyPrice: 320,
    weeklyPrice: 2100,
    monthlyPrice: 6900,
    seats: 9,
    luggage: 6,
    doors: 5,
    transmission: "auto",
    fuelType: "petrol",
    engineCapacity: "3.5L V6 272 HP",
    features: {
      ar: ["9 \u0645\u0642\u0627\u0639\u062F \u0648\u0627\u0633\u0639\u0629 \u0644\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0639\u0627\u0626\u0644\u064A\u0629 \u0648\u0646\u0642\u0644 \u0627\u0644\u0648\u0641\u0648\u062F \u0648\u0627\u0644\u0639\u0645\u0631\u0629", "\u0623\u0628\u0648\u0627\u0628 \u062C\u0627\u0646\u0628\u064A\u0629 \u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0627\u0646\u0632\u0644\u0627\u0642\u064A\u0629 \u062A\u0641\u062A\u062D \u0628\u0644\u0645\u0633\u0629", "\u062A\u0643\u064A\u064A\u0641 \u0645\u0631\u0643\u0632\u064A \u0645\u0646\u0641\u0635\u0644 \u0644\u0643\u0644 \u0635\u0641 \u0631\u0643\u0627\u0628", "\u0646\u0648\u0627\u0641\u0630 \u0628\u0627\u0646\u0648\u0631\u0627\u0645\u064A\u0629 \u0648\u0627\u0633\u0639\u0629 \u0648\u0631\u0624\u064A\u0629 \u0645\u062D\u064A\u0637\u064A\u0629", "\u0645\u062B\u0627\u0644\u064A\u0629 \u0644\u0631\u062D\u0644\u0627\u062A \u0645\u0637\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0648\u0627\u0644\u062D\u0631\u0645\u064A\u0646"],
      en: ["9 Generous Seats for Families, Umrah & Corporate VIPs", "Dual Power Sliding Doors", "Independent Multi-Zone Climate Controls", "Panoramic Vista Windows", "Ideal for Saudi Airport Transfers & Long Journeys"]
    },
    availableQuantity: 9,
    minDriverAge: 23,
    depositRequired: 1e3,
    includedMileagePerDay: 400
  }
];
var PROTECTION_PLANS = [
  {
    id: "basic",
    name: { ar: "\u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A (CDW)", en: "Basic Protection (CDW)" },
    description: {
      ar: "\u0645\u0634\u0645\u0648\u0644 \u0645\u062C\u0627\u0646\u0627\u064B \u0641\u064A \u0633\u0639\u0631 \u0627\u0644\u062D\u062C\u0632\u060C \u0645\u0639 \u062A\u062D\u0645\u0644 \u0646\u0633\u0628\u064A \u0641\u064A \u062D\u0627\u0644 \u0648\u062C\u0648\u062F \u062A\u0642\u0631\u064A\u0631 \u0646\u062C\u0645/\u0627\u0644\u0645\u0631\u0648\u0631.",
      en: "Included free with booking, standard deductible applies with official traffic report."
    },
    pricePerDay: 0,
    deductible: 2e3,
    features: {
      ar: ["\u062A\u063A\u0637\u064A\u0629 \u0636\u062F \u0627\u0644\u063A\u064A\u0631 \u0628\u0646\u0633\u0628\u0629 100%", "\u062A\u063A\u0637\u064A\u0629 \u0627\u0644\u0623\u0636\u0631\u0627\u0631 \u0645\u0639 \u0646\u0633\u0628\u0629 \u062A\u062D\u0645\u0644", "\u0645\u0633\u0627\u0639\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0637\u0631\u064A\u0642 \u0623\u0633\u0627\u0633\u064A\u0629"],
      en: ["100% Third-party liability", "Collision damage with deductible", "Basic roadside assistance"]
    }
  },
  {
    id: "comprehensive",
    name: { ar: "\u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0634\u0627\u0645\u0644 (SCDW)", en: "Comprehensive Protection (SCDW)" },
    description: {
      ar: "\u064A\u0642\u0644\u0644 \u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u062D\u0645\u0644 \u0625\u0644\u0649 500 \u0631\u064A\u0627\u0644 \u0641\u0642\u0637 \u0648\u064A\u0634\u0645\u0644 \u062A\u063A\u0637\u064A\u0629 \u0627\u0644\u0632\u062C\u0627\u062C \u0648\u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062A.",
      en: "Reduces deductible to just 500 SAR and covers windshield & tire damages."
    },
    pricePerDay: 35,
    deductible: 500,
    recommended: true,
    features: {
      ar: ["\u062A\u062D\u0645\u0644 \u0645\u062E\u0641\u0636 \u062C\u062F\u0627\u064B (500 \u0631\u064A\u0627\u0644)", "\u062A\u063A\u0637\u064A\u0629 \u062A\u0644\u0641\u064A\u0627\u062A \u0627\u0644\u0632\u062C\u0627\u062C \u0648\u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062A", "\u0633\u064A\u0627\u0631\u0629 \u0628\u062F\u064A\u0644\u0629 \u0645\u062C\u0627\u0646\u0627\u064B \u0641\u0648\u0631 \u0648\u0642\u0648\u0639 \u062D\u0627\u062F\u062B", "\u0633\u062D\u0628 \u0648\u0646\u0642\u0644 \u0627\u0644\u0645\u0631\u0643\u0628\u0629 \u0645\u062C\u0627\u0646\u0627\u064B"],
      en: ["Low deductible (500 SAR)", "Tire and windshield protection", "Free replacement vehicle", "Free towing and recovery"]
    }
  },
  {
    id: "super_zero",
    name: { ar: "\u0627\u0644\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0641\u0627\u0626\u0642\u0629 (\u0635\u0641\u0631 \u062A\u062D\u0645\u0644)", en: "Zero Liability Super Protection" },
    description: {
      ar: "\u0631\u0627\u062D\u0629 \u0628\u0627\u0644 \u062A\u0627\u0645\u0629 \u0628\u062F\u0648\u0646 \u0623\u064A \u0645\u0628\u0627\u0644\u063A \u062A\u062D\u0645\u0644 \u0645\u0647\u0645\u0627 \u0643\u0627\u0646 \u062D\u062C\u0645 \u0627\u0644\u0636\u0631\u0631 \u0628\u0648\u062C\u0648\u062F \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u062D\u0627\u062F\u062B.",
      en: "Complete peace of mind with 0 SAR deductible regardless of damages with report."
    },
    pricePerDay: 65,
    deductible: 0,
    features: {
      ar: ["\u0646\u0633\u0628\u0629 \u062A\u062D\u0645\u0644 0 \u0631\u064A\u0627\u0644 (\u0625\u0639\u0641\u0627\u0621 \u0643\u0627\u0645\u0644)", "\u062A\u063A\u0637\u064A\u0629 \u0634\u0627\u0645\u0644\u0629 \u0644\u0643\u0644 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0623\u0636\u0631\u0627\u0631", "\u0623\u0648\u0644\u0648\u064A\u0629 \u0642\u0635\u0648\u0649 \u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0637\u0631\u064A\u0642", "\u0625\u0639\u0641\u0627\u0621 \u0645\u0646 \u0631\u0633\u0648\u0645 \u0627\u0644\u062A\u0648\u0642\u0641 \u0648\u062A\u0623\u062E\u064A\u0631 \u0627\u0644\u0625\u0635\u0644\u0627\u062D"],
      en: ["0 SAR deductible (Zero excess)", "Full damage waiver coverage", "Priority VIP roadside assistance", "No loss-of-use administrative fees"]
    }
  }
];
var ADDON_OPTIONS = [
  {
    id: "child_seat",
    name: { ar: "\u0645\u0642\u0639\u062F \u0623\u0637\u0641\u0627\u0644 \u0622\u0645\u0646", en: "Child Safety Seat" },
    description: { ar: "\u0645\u0642\u0639\u062F \u0645\u0631\u064A\u062D \u0648\u0645\u0637\u0627\u0628\u0642 \u0644\u0623\u0639\u0644\u0649 \u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0623\u0648\u0631\u0648\u0628\u064A\u0629 \u0648\u0627\u0644\u0623\u0645\u0631\u064A\u0643\u064A\u0629 \u0644\u0644\u0623\u0637\u0641\u0627\u0644", en: "Comfortable, certified child safety seat meeting ISOFIX standards" },
    pricePerDay: 25,
    icon: "Baby",
    maxQuantity: 2
  },
  {
    id: "extra_driver",
    name: { ar: "\u0625\u0636\u0627\u0641\u0629 \u0633\u0627\u0626\u0642 \u0645\u0635\u0631\u062D \u0625\u0636\u0627\u0641\u064A", en: "Additional Authorized Driver" },
    description: { ar: "\u064A\u0633\u0645\u062D \u0644\u0634\u062E\u0635 \u062B\u0627\u0646\u064D \u0628\u0642\u064A\u0627\u062F\u0629 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0645\u0639 \u0634\u0645\u0648\u0644\u0647 \u0627\u0644\u0643\u0627\u0645\u0644 \u0628\u0627\u0644\u062A\u063A\u0637\u064A\u0629 \u0627\u0644\u062A\u0623\u0645\u064A\u0646\u064A\u0629", en: "Allows a second person to drive the vehicle with full insurance coverage" },
    pricePerDay: 30,
    icon: "UserPlus",
    maxQuantity: 2
  },
  {
    id: "open_mileage",
    name: { ar: "\u0628\u0627\u0642\u0629 \u0627\u0644\u0643\u064A\u0644\u0648\u0645\u062A\u0631\u0627\u062A \u0627\u0644\u0645\u0641\u062A\u0648\u062D\u0629 (\u063A\u064A\u0631 \u0645\u062D\u062F\u0648\u062F)", en: "Unlimited Mileage Package" },
    description: { ar: "\u062A\u0646\u0642\u0644 \u0628\u062D\u0631\u064A\u0629 \u0645\u0637\u0644\u0642\u0629 \u0641\u064A \u0643\u0627\u0641\u0629 \u0623\u0631\u062C\u0627\u0621 \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u062F\u0648\u0646 \u0623\u064A \u0642\u0644\u0642 \u0645\u0646 \u0627\u062D\u062A\u0633\u0627\u0628 \u0627\u0644\u0645\u0633\u0627\u0641\u0629", en: "Drive without limits anywhere across the Kingdom with zero mileage restrictions" },
    pricePerDay: 45,
    icon: "Gauge",
    maxQuantity: 1
  },
  {
    id: "wifi_hotspot",
    name: { ar: "\u062C\u0647\u0627\u0632 \u0625\u0646\u062A\u0631\u0646\u062A \u0648\u0627\u064A \u0641\u0627\u064A \u0645\u062D\u0645\u0648\u0644 5G", en: "5G Portable Pocket WiFi" },
    description: { ar: "\u0625\u0646\u062A\u0631\u0646\u062A 5G \u0641\u0627\u0626\u0642 \u0627\u0644\u0633\u0631\u0639\u0629 \u0645\u0641\u062A\u0648\u062D \u0644\u0631\u0628\u0637 \u062D\u062A\u0649 10 \u0623\u062C\u0647\u0632\u0629 \u0623\u062B\u0646\u0627\u0621 \u0631\u062D\u0644\u062A\u0643", en: "High-speed 5G portable internet router for up to 10 connected devices" },
    pricePerDay: 25,
    icon: "Wifi",
    maxQuantity: 1
  },
  {
    id: "cross_border",
    name: { ar: "\u062A\u0635\u0631\u064A\u062D \u0627\u0644\u0633\u0641\u0631 \u0644\u062F\u0648\u0644 \u0627\u0644\u062E\u0644\u064A\u062C (GCC)", en: "GCC Cross-Border Permit" },
    description: { ar: "\u062A\u0641\u0648\u064A\u0636 \u0648\u0633\u0641\u0631 \u062F\u0648\u0644\u064A \u0644\u0644\u0645\u0631\u0643\u0628\u0629 \u064A\u0634\u0645\u0644 \u062F\u0648\u0644 \u0645\u062C\u0644\u0633 \u0627\u0644\u062A\u0639\u0627\u0648\u0646 \u0627\u0644\u062E\u0644\u064A\u062C\u064A \u0645\u0639 \u0627\u0644\u062A\u0623\u0645\u064A\u0646", en: "Official authorization and cross-border insurance permit for GCC countries" },
    pricePerDay: 50,
    icon: "Globe",
    maxQuantity: 1
  }
];

// src/data/branches.ts
var BRANCHES_DATA = [
  // RIYADH
  {
    id: "ruh-t1-2",
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0627\u0644\u062F\u0648\u0644\u064A - \u0627\u0644\u0635\u0627\u0644\u0629 1 \u0648 2", en: "King Khalid Int Airport - Terminals 1 & 2" },
    type: "airport",
    terminal: "T1/T2",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645 \u0627\u0644\u062F\u0648\u0644\u064A\u0629\u060C \u0627\u0644\u0631\u064A\u0627\u0636", en: "King Khalid International Airport, International Arrivals" },
    phone: "011-220-4401",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 24.9576,
    longitude: 46.6988,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=King+Khalid+International+Airport"
  },
  {
    id: "ruh-t3-4",
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0627\u0644\u062F\u0648\u0644\u064A - \u0627\u0644\u0635\u0627\u0644\u0629 3 \u0648 4", en: "King Khalid Int Airport - Terminals 3 & 4" },
    type: "airport",
    terminal: "T3/T4",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645 \u0627\u0644\u062C\u062F\u064A\u062F\u0629\u060C \u0627\u0644\u0631\u064A\u0627\u0636", en: "King Khalid International Airport, New Terminal Arrivals" },
    phone: "011-220-4402",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 24.9602,
    longitude: 46.702,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=King+Khalid+International+Airport"
  },
  {
    id: "ruh-t5",
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0627\u0644\u062F\u0648\u0644\u064A - \u0627\u0644\u0635\u0627\u0644\u0629 5 (\u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u062F\u0627\u062E\u0644\u064A\u0629)", en: "King Khalid Int Airport - Terminal 5 (Domestic)" },
    type: "airport",
    terminal: "T5",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645 \u0627\u0644\u062F\u0627\u062E\u0644\u064A 5\u060C \u0627\u0644\u0631\u064A\u0627\u0636", en: "King Khalid International Airport, Terminal 5 Domestic Arrivals" },
    phone: "011-220-4405",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 24.945,
    longitude: 46.711,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=Terminal+5+KKIA"
  },
  {
    id: "ruh-olaya",
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u0639\u0644\u064A\u0627 - \u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F", en: "Al Olaya Branch - King Fahd Rd" },
    type: "downtown",
    address: { ar: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F\u060C \u062D\u064A \u0627\u0644\u0639\u0644\u064A\u0627\u060C \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0628\u0631\u062C \u0627\u0644\u0641\u064A\u0635\u0644\u064A\u0629\u060C \u0627\u0644\u0631\u064A\u0627\u0636", en: "King Fahd Road, Al Olaya District, Near Faisaliah Tower, Riyadh" },
    phone: "011-465-8890",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 12:00 \u0645\u0646\u062A\u0635\u0641 \u0627\u0644\u0644\u064A\u0644", en: "Daily: 8:00 AM - 12:00 Midnight" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 24.6905,
    longitude: 46.6853,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=Al+Olaya+Riyadh"
  },
  {
    id: "ruh-sulaimaniya",
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u0633\u0644\u064A\u0645\u0627\u0646\u064A\u0629 - \u0634\u0627\u0631\u0639 \u0627\u0644\u0639\u0631\u0648\u0628\u0629", en: "Al Sulaimaniya Branch - Al Orouba St" },
    type: "downtown",
    address: { ar: "\u062A\u0642\u0627\u0637\u0639 \u0637\u0631\u064A\u0642 \u0627\u0644\u0639\u0631\u0648\u0628\u0629 \u0645\u0639 \u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632\u060C \u0627\u0644\u0633\u0644\u064A\u0645\u0627\u0646\u064A\u0629\u060C \u0627\u0644\u0631\u064A\u0627\u0636", en: "Intersection of Orouba with King Abdulaziz, Sulaimaniya, Riyadh" },
    phone: "011-419-7720",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 11:30 \u0645", en: "Daily: 8:00 AM - 11:30 PM" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 24.7121,
    longitude: 46.6974,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Al+Sulaimaniya+Riyadh"
  },
  {
    id: "ruh-rawdah",
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u0631\u0648\u0636\u0629 - \u0637\u0631\u064A\u0642 \u062E\u0631\u064A\u0635", en: "Al Rawdah Branch - Khurais Rd" },
    type: "downtown",
    address: { ar: "\u0637\u0631\u064A\u0642 \u062E\u0631\u064A\u0635 \u0627\u0644\u0641\u0631\u0639\u064A\u060C \u062D\u064A \u0627\u0644\u0631\u0648\u0636\u0629\u060C \u0634\u0631\u0642 \u0627\u0644\u0631\u064A\u0627\u0636", en: "Khurais Sub-Road, Al Rawdah District, East Riyadh" },
    phone: "011-209-1144",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:30 \u0635 - 11:00 \u0645", en: "Daily: 8:30 AM - 11:00 PM" },
    is24Hours: false,
    hasSelfServiceKiosk: false,
    hasVipLounge: false,
    latitude: 24.739,
    longitude: 46.782,
    rating: 4.6,
    googleMapUrl: "https://maps.google.com/?q=Al+Rawdah+Riyadh"
  },
  {
    id: "ruh-suwaidi",
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u0633\u0648\u064A\u062F\u064A - \u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u062F\u0627\u0626\u0631\u064A \u0627\u0644\u062C\u0646\u0648\u0628\u064A", en: "Al Suwaidi Branch - Southern Ring" },
    type: "downtown",
    address: { ar: "\u0645\u062E\u0631\u062C 24\u060C \u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u062F\u0627\u0626\u0631\u064A \u0627\u0644\u062C\u0646\u0648\u0628\u064A\u060C \u062D\u064A \u0627\u0644\u0633\u0648\u064A\u062F\u064A\u060C \u0627\u0644\u0631\u064A\u0627\u0636", en: "Exit 24, Southern Ring Road, Al Suwaidi, Riyadh" },
    phone: "011-425-6677",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 11:00 \u0645", en: "Daily: 8:00 AM - 11:00 PM" },
    is24Hours: false,
    hasSelfServiceKiosk: false,
    hasVipLounge: false,
    latitude: 24.582,
    longitude: 46.671,
    rating: 4.5,
    googleMapUrl: "https://maps.google.com/?q=Al+Suwaidi+Riyadh"
  },
  // JEDDAH
  {
    id: "jed-airport-t1",
    city: { ar: "\u062C\u062F\u0629", en: "Jeddah" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0627\u0644\u062F\u0648\u0644\u064A - \u0627\u0644\u0635\u0627\u0644\u0629 1 \u0627\u0644\u062C\u062F\u064A\u062F\u0629", en: "King Abdulaziz Int Airport - Terminal 1" },
    type: "airport",
    terminal: "T1",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0627\u0644\u062C\u062F\u064A\u062F\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0631\u0642\u0645 1\u060C \u062C\u062F\u0629", en: "King Abdulaziz Int Airport, Terminal 1 Arrival Lounge, Jeddah" },
    phone: "012-685-1100",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 21.6796,
    longitude: 39.1565,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=KAIA+Terminal+1"
  },
  {
    id: "jed-tahlia",
    city: { ar: "\u062C\u062F\u0629", en: "Jeddah" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u062A\u062D\u0644\u064A\u0629 - \u0634\u0627\u0631\u0639 \u0627\u0644\u0623\u0645\u064A\u0631 \u0645\u062D\u0645\u062F \u0628\u0646 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632", en: "Al Tahlia Branch - Prince Mohammed St" },
    type: "downtown",
    address: { ar: "\u0634\u0627\u0631\u0639 \u0627\u0644\u062A\u062D\u0644\u064A\u0629\u060C \u062D\u064A \u0627\u0644\u0623\u0646\u062F\u0644\u0633\u060C \u0628\u062C\u0648\u0627\u0631 \u0645\u0631\u0643\u0632 \u0627\u0644\u062E\u064A\u0627\u0637\u060C \u062C\u062F\u0629", en: "Tahlia Street, Al Andalus District, Next to Al Khayyat, Jeddah" },
    phone: "012-668-9922",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 12:00 \u0645\u0646\u062A\u0635\u0641 \u0627\u0644\u0644\u064A\u0644", en: "Daily: 8:00 AM - Midnight" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 21.554,
    longitude: 39.162,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=Tahlia+Street+Jeddah"
  },
  {
    id: "jed-madinah-rd",
    city: { ar: "\u062C\u062F\u0629", en: "Jeddah" },
    name: { ar: "\u0641\u0631\u0639 \u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629 - \u062D\u064A \u0627\u0644\u0633\u0644\u0627\u0645\u0629", en: "Madinah Road Branch - Al Salamah" },
    type: "downtown",
    address: { ar: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629 \u0627\u0644\u0646\u0627\u0632\u0644\u060C \u062D\u064A \u0627\u0644\u0633\u0644\u0627\u0645\u0629\u060C \u062C\u062F\u0629", en: "Madinah Road, Al Salamah District, Jeddah" },
    phone: "012-698-3355",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 11:30 \u0645", en: "Daily: 8:00 AM - 11:30 PM" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 21.591,
    longitude: 39.167,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Madinah+Road+Jeddah"
  },
  {
    id: "jed-corniche",
    city: { ar: "\u062C\u062F\u0629", en: "Jeddah" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 - \u0637\u0631\u064A\u0642 \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0634\u0645\u0627\u0644\u064A", en: "Corniche Branch - North Corniche" },
    type: "downtown",
    address: { ar: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u0634\u0645\u0627\u0644\u064A\u060C \u062D\u064A \u0627\u0644\u0634\u0627\u0637\u0626\u060C \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0631\u062F \u0633\u064A \u0645\u0648\u0644\u060C \u062C\u062F\u0629", en: "North Corniche Rd, Al Shati District, Near Red Sea Mall, Jeddah" },
    phone: "012-612-4488",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 9:00 \u0635 - 1:00 \u0635", en: "Daily: 9:00 AM - 1:00 AM" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 21.624,
    longitude: 39.112,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=North+Corniche+Jeddah"
  },
  // DAMMAM & KHOBAR
  {
    id: "dmm-airport",
    city: { ar: "\u0627\u0644\u062F\u0645\u0627\u0645", en: "Dammam" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F \u0627\u0644\u062F\u0648\u0644\u064A - \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645", en: "King Fahd Int Airport - Arrivals Terminal" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0627\u0644\u0635\u0627\u0644\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629\u060C \u0627\u0644\u062F\u0645\u0627\u0645", en: "King Fahd International Airport, Main Terminal Arrivals, Dammam" },
    phone: "013-883-2211",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 26.4712,
    longitude: 49.7979,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=King+Fahd+Airport+Dammam"
  },
  {
    id: "dmm-faisaliyah",
    city: { ar: "\u0627\u0644\u062F\u0645\u0627\u0645", en: "Dammam" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u0641\u064A\u0635\u0644\u064A\u0629 - \u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F", en: "Al Faisaliyah Branch - King Fahd Rd" },
    type: "downtown",
    address: { ar: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F\u060C \u062D\u064A \u0627\u0644\u0641\u064A\u0635\u0644\u064A\u0629\u060C \u0627\u0644\u062F\u0645\u0627\u0645", en: "King Fahd Road, Al Faisaliyah, Dammam" },
    phone: "013-841-5500",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 11:30 \u0645", en: "Daily: 8:00 AM - 11:30 PM" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 26.412,
    longitude: 50.082,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Al+Faisaliyah+Dammam"
  },
  {
    id: "khb-corniche",
    city: { ar: "\u0627\u0644\u062E\u0628\u0631", en: "Al Khobar" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u062E\u0628\u0631 - \u0637\u0631\u064A\u0642 \u0627\u0644\u0643\u0648\u0631\u0646\u064A\u0634 / \u0627\u0644\u0623\u0645\u064A\u0631 \u062A\u0631\u0643\u064A", en: "Khobar Branch - Prince Turki / Corniche Rd" },
    type: "downtown",
    address: { ar: "\u0634\u0627\u0631\u0639 \u0627\u0644\u0623\u0645\u064A\u0631 \u062A\u0631\u0643\u064A\u060C \u062D\u064A \u0627\u0644\u064A\u0631\u0645\u0648\u0643\u060C \u0643\u0648\u0631\u0646\u064A\u0634 \u0627\u0644\u062E\u0628\u0631", en: "Prince Turki Street, Al Yarmouk, Khobar Corniche" },
    phone: "013-898-7744",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 12:00 \u0645\u0646\u062A\u0635\u0641 \u0627\u0644\u0644\u064A\u0644", en: "Daily: 8:00 AM - Midnight" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 26.295,
    longitude: 50.218,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=Prince+Turki+Khobar"
  },
  // MAKKAH & MADINAH
  {
    id: "mak-haram",
    city: { ar: "\u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629", en: "Makkah" },
    name: { ar: "\u0641\u0631\u0639 \u0645\u0643\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u064A - \u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0633\u062C\u062F \u0627\u0644\u062D\u0631\u0627\u0645", en: "Makkah Central Branch - Haram Road" },
    type: "downtown",
    address: { ar: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0633\u062C\u062F \u0627\u0644\u062D\u0631\u0627\u0645\u060C \u062D\u064A \u0627\u0644\u0639\u0632\u064A\u0632\u064A\u0629 \u0627\u0644\u0634\u0645\u0627\u0644\u064A\u0629\u060C \u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629", en: "Al Masjid Al Haram Road, North Aziziyah, Makkah" },
    phone: "012-556-9900",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u062E\u062F\u0645\u0629 \u0636\u064A\u0648\u0641 \u0627\u0644\u0631\u062D\u0645\u0646", en: "24/7 Pilgrims Service" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 21.4225,
    longitude: 39.8262,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=Makkah+Central"
  },
  {
    id: "mak-shuhada",
    city: { ar: "\u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629", en: "Makkah" },
    name: { ar: "\u0641\u0631\u0639 \u0627\u0644\u0634\u0647\u062F\u0627\u0621 - \u0627\u0644\u062F\u0627\u0626\u0631\u064A \u0627\u0644\u062B\u0627\u0644\u062B", en: "Al Shuhada Branch - 3rd Ring" },
    type: "downtown",
    address: { ar: "\u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u062F\u0627\u0626\u0631\u064A \u0627\u0644\u062B\u0627\u0644\u062B\u060C \u062D\u064A \u0627\u0644\u0634\u0647\u062F\u0627\u0621\u060C \u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629", en: "3rd Ring Road, Al Shuhada, Makkah" },
    phone: "012-544-3322",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 11:30 \u0645", en: "Daily: 8:00 AM - 11:30 PM" },
    is24Hours: false,
    hasSelfServiceKiosk: false,
    hasVipLounge: false,
    latitude: 21.442,
    longitude: 39.805,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Makkah+Ring+Road"
  },
  {
    id: "med-airport",
    city: { ar: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629", en: "Madinah" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u0645\u064A\u0631 \u0645\u062D\u0645\u062F \u0628\u0646 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0627\u0644\u062F\u0648\u0644\u064A", en: "Prince Mohammad Bin Abdulaziz Int Airport" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u0645\u064A\u0631 \u0645\u062D\u0645\u062F \u0628\u0646 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645\u060C \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629", en: "Prince Mohammad Airport, Arrival Terminal, Madinah" },
    phone: "014-813-5566",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: true,
    latitude: 24.5534,
    longitude: 39.7051,
    rating: 4.9,
    googleMapUrl: "https://maps.google.com/?q=Madinah+Airport"
  },
  {
    id: "med-sultana",
    city: { ar: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629", en: "Madinah" },
    name: { ar: "\u0641\u0631\u0639 \u0633\u0644\u0637\u0627\u0646\u0629 - \u0634\u0627\u0631\u0639 \u0623\u0628\u064A \u0628\u0643\u0631 \u0627\u0644\u0635\u062F\u064A\u0642", en: "Sultana Branch - Abu Bakr Al Siddiq St" },
    type: "downtown",
    address: { ar: "\u0634\u0627\u0631\u0639 \u0633\u0644\u0637\u0627\u0646\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u060C \u062D\u064A \u0627\u0644\u0642\u0628\u0644\u062A\u064A\u0646\u060C \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629", en: "Sultana Commercial St, Al Qiblatayn District, Madinah" },
    phone: "014-848-1122",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:00 \u0635 - 12:00 \u0645\u0646\u062A\u0635\u0641 \u0627\u0644\u0644\u064A\u0644", en: "Daily: 8:00 AM - Midnight" },
    is24Hours: false,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 24.482,
    longitude: 39.593,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=Sultana+Madinah"
  },
  // ABHA & SOUTHERN REGION
  {
    id: "abh-airport",
    city: { ar: "\u0623\u0628\u0647\u0627", en: "Abha" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0623\u0628\u0647\u0627 \u0627\u0644\u062F\u0648\u0644\u064A - \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645", en: "Abha International Airport - Arrivals" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0623\u0628\u0647\u0627 \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0627\u0644\u0635\u0627\u0644\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629\u060C \u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0637\u0627\u0631\u060C \u0623\u0628\u0647\u0627", en: "Abha International Airport, Main Terminal, Abha" },
    phone: "017-227-8899",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 18.2404,
    longitude: 42.6566,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=Abha+Airport"
  },
  {
    id: "abh-khamis",
    city: { ar: "\u062E\u0645\u064A\u0633 \u0645\u0634\u064A\u0637", en: "Khamis Mushait" },
    name: { ar: "\u0641\u0631\u0639 \u062E\u0645\u064A\u0633 \u0645\u0634\u064A\u0637 - \u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F", en: "Khamis Mushait Branch - King Fahd Rd" },
    type: "downtown",
    address: { ar: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F\u060C \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0645\u062C\u0645\u0639 \u0627\u0644\u063A\u0631\u0648\u064A\u060C \u062E\u0645\u064A\u0633 \u0645\u0634\u064A\u0637", en: "King Fahd Road, Near Al Gharawi Center, Khamis Mushait" },
    phone: "017-223-4411",
    workingHours: { ar: "\u064A\u0648\u0645\u064A\u0627\u064B: 8:30 \u0635 - 11:00 \u0645", en: "Daily: 8:30 AM - 11:00 PM" },
    is24Hours: false,
    hasSelfServiceKiosk: false,
    hasVipLounge: false,
    latitude: 18.302,
    longitude: 42.731,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Khamis+Mushait"
  },
  {
    id: "jaz-airport",
    city: { ar: "\u062C\u0627\u0632\u0627\u0646", en: "Jazan" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0627\u0644\u0625\u0642\u0644\u064A\u0645\u064A \u0628\u062C\u0627\u0632\u0627\u0646", en: "King Abdullah Regional Airport - Jazan" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0644\u0647\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645\u060C \u062C\u0627\u0632\u0627\u0646", en: "King Abdullah Airport, Arrival Hall, Jazan" },
    phone: "017-321-7788",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 16.9011,
    longitude: 42.5855,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Jazan+Airport"
  },
  // TABUK & NORTHERN REGION
  {
    id: "tuu-airport",
    city: { ar: "\u062A\u0628\u0648\u0643", en: "Tabuk" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u0645\u064A\u0631 \u0633\u0644\u0637\u0627\u0646 \u0628\u0646 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0628\u062A\u0628\u0648\u0643", en: "Prince Sultan Bin Abdulaziz Airport - Tabuk" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u0645\u064A\u0631 \u0633\u0644\u0637\u0627\u0646 \u0628\u0646 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645\u060C \u062A\u0628\u0648\u0643", en: "Prince Sultan Airport, Arrival Terminal, Tabuk" },
    phone: "014-422-9900",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629 / \u0637\u0648\u0627\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "24/7 All Week" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 28.3828,
    longitude: 36.6189,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=Tabuk+Airport"
  },
  // TAIF, YANBU, QASSIM, AL AHSA, HAIL
  {
    id: "tif-airport",
    city: { ar: "\u0627\u0644\u0637\u0627\u0626\u0641", en: "Taif" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0637\u0627\u0626\u0641 \u0627\u0644\u062F\u0648\u0644\u064A - \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645", en: "Taif International Airport - Arrivals" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0637\u0627\u0626\u0641 \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629\u060C \u0627\u0644\u0637\u0627\u0626\u0641", en: "Taif International Airport, Main Arrivals Hall, Taif" },
    phone: "012-726-1188",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629", en: "24 Hours" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 21.4831,
    longitude: 40.5434,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Taif+Airport"
  },
  {
    id: "ynb-airport",
    city: { ar: "\u064A\u0646\u0628\u0639", en: "Yanbu" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u0645\u064A\u0631 \u0639\u0628\u062F\u0627\u0644\u0645\u062D\u0633\u0646 \u0628\u0646 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0628\u064A\u0646\u0628\u0639", en: "Prince Abdul Mohsin Bin Abdulaziz Airport - Yanbu" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u064A\u0646\u0628\u0639\u060C \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645\u060C \u0637\u0631\u064A\u0642 \u064A\u0646\u0628\u0639 \u0627\u0644\u0646\u062E\u0644", en: "Yanbu Airport, Arrivals Lounge, Yanbu" },
    phone: "014-321-4477",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629", en: "24 Hours" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 24.1442,
    longitude: 38.0634,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=Yanbu+Airport"
  },
  {
    id: "elq-airport",
    city: { ar: "\u0627\u0644\u0642\u0635\u064A\u0645", en: "Qassim" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u0645\u064A\u0631 \u0646\u0627\u064A\u0641 \u0628\u0646 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0627\u0644\u062F\u0648\u0644\u064A \u0628\u0627\u0644\u0642\u0635\u064A\u0645", en: "Prince Naif Bin Abdulaziz Int Airport - Qassim" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0642\u0635\u064A\u0645 \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0628\u0631\u064A\u062F\u0629 / \u0639\u0646\u064A\u0632\u0629", en: "Prince Naif Airport, Buraidah / Unaizah, Qassim" },
    phone: "016-380-6622",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629", en: "24 Hours" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 26.3028,
    longitude: 43.7744,
    rating: 4.8,
    googleMapUrl: "https://maps.google.com/?q=Qassim+Airport"
  },
  {
    id: "hof-airport",
    city: { ar: "\u0627\u0644\u0623\u062D\u0633\u0627\u0621", en: "Al Ahsa" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u062D\u0633\u0627\u0621 \u0627\u0644\u062F\u0648\u0644\u064A - \u0627\u0644\u0647\u0641\u0648\u0641", en: "Al Ahsa International Airport - Hofuf" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u0627\u0644\u0623\u062D\u0633\u0627\u0621 \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0637\u0631\u064A\u0642 \u0627\u0644\u0647\u0641\u0648\u0641\u060C \u0627\u0644\u0623\u062D\u0633\u0627\u0621", en: "Al Ahsa International Airport, Hofuf" },
    phone: "013-585-3344",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629", en: "24 Hours" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 25.2853,
    longitude: 49.4878,
    rating: 4.7,
    googleMapUrl: "https://maps.google.com/?q=Al+Ahsa+Airport"
  },
  {
    id: "has-airport",
    city: { ar: "\u062D\u0627\u0626\u0644", en: "Hail" },
    name: { ar: "\u0645\u0637\u0627\u0631 \u062D\u0627\u0626\u0644 \u0627\u0644\u0625\u0642\u0644\u064A\u0645\u064A - \u0635\u0627\u0644\u0629 \u0627\u0644\u0642\u062F\u0648\u0645", en: "Hail Regional Airport - Arrivals" },
    type: "airport",
    address: { ar: "\u0645\u0637\u0627\u0631 \u062D\u0627\u0626\u0644 \u0627\u0644\u0625\u0642\u0644\u064A\u0645\u064A\u060C \u0637\u0631\u064A\u0642 \u062D\u0627\u0626\u0644 \u0627\u0644\u0642\u0635\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0639\u060C \u062D\u0627\u0626\u0644", en: "Hail Regional Airport, Hail-Qassim Expressway, Hail" },
    phone: "016-532-1100",
    workingHours: { ar: "\u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24 \u0633\u0627\u0639\u0629", en: "24 Hours" },
    is24Hours: true,
    hasSelfServiceKiosk: true,
    hasVipLounge: false,
    latitude: 27.438,
    longitude: 41.686,
    rating: 4.6,
    googleMapUrl: "https://maps.google.com/?q=Hail+Airport"
  }
];

// src/data/blog.ts
var BLOG_POSTS_DATA = [
  {
    id: "post-1",
    slug: "saudi-road-trip-guide-riyadh-to-alula",
    title: {
      ar: "\u062F\u0644\u064A\u0644 \u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0637\u0631\u0642: \u0645\u0646 \u0642\u0644\u0628 \u0627\u0644\u0631\u064A\u0627\u0636 \u0625\u0644\u0649 \u0633\u062D\u0631 \u0627\u0644\u0639\u0644\u0627 \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A\u0629",
      en: "Saudi Road Trip Guide: Journey from Riyadh to Historic AlUla"
    },
    excerpt: {
      ar: "\u0627\u0643\u062A\u0634\u0641 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u0629\u060C \u0645\u062D\u0637\u0627\u062A \u0627\u0644\u062A\u0648\u0642\u0641 \u0627\u0644\u062D\u064A\u0648\u064A\u0629\u060C \u0648\u0623\u0646\u0633\u0628 \u0641\u0626\u0627\u062A \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0644\u0631\u062D\u0644\u0629 \u0627\u0633\u062A\u0643\u0634\u0627\u0641\u064A\u0629 \u0644\u0627 \u062A\u064F\u0646\u0633\u0649 \u0639\u0628\u0631 \u062C\u0628\u0627\u0644 \u0648\u0635\u062D\u0631\u0627\u0621 \u0627\u0644\u0645\u0645\u0644\u0643\u0629.",
      en: "Discover optimal driving routes, essential rest stops, and ideal SUV vehicle classes for an unforgettable expedition across Saudi terrains."
    },
    content: {
      ar: `\u062A\u0639\u062A\u0628\u0631 \u0627\u0644\u0631\u062D\u0644\u0629 \u0627\u0644\u0628\u0631\u064A\u0629 \u0645\u0646 \u0627\u0644\u0631\u064A\u0627\u0636 \u0625\u0644\u0649 \u0627\u0644\u0639\u0644\u0627 \u0648\u0627\u062D\u062F\u0629 \u0645\u0646 \u0623\u0631\u0648\u0639 \u0627\u0644\u0645\u063A\u0627\u0645\u0631\u0627\u062A \u0627\u0644\u0633\u064A\u0627\u062D\u064A\u0629 \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629. \u064A\u0645\u062A\u062F \u0627\u0644\u0645\u0633\u0627\u0631 \u0644\u0645\u0633\u0627\u0641\u0629 \u062A\u0642\u0627\u0631\u0628 1,050 \u0643\u064A\u0644\u0648\u0645\u062A\u0631 \u0639\u0628\u0631 \u0637\u0631\u0642 \u0633\u0631\u064A\u0639\u0629 \u062D\u062F\u064A\u062B\u0629 \u0648\u0645\u062C\u0647\u0632\u0629 \u0628\u0623\u0639\u0644\u0649 \u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0633\u0644\u0627\u0645\u0629.

### \u0623\u0641\u0636\u0644 \u0641\u0626\u0627\u062A \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629 \u0644\u0647\u0630\u0647 \u0627\u0644\u0631\u062D\u0644\u0629:
1. **\u0641\u0626\u0629 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0631\u0628\u0627\u0639\u064A (SUV & 4x4)**: \u0645\u062B\u0644 \u062A\u0648\u064A\u0648\u062A\u0627 \u0644\u0627\u0646\u062F\u0643\u0631\u0648\u0632\u0631 \u0623\u0648 \u0646\u064A\u0633\u0627\u0646 \u0628\u0627\u062A\u0631\u0648\u0644\u060C \u0644\u0636\u0645\u0627\u0646 \u0623\u0639\u0644\u0649 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0631\u0627\u062D\u0629 \u0648\u0627\u0644\u0623\u0645\u0627\u0646 \u0639\u0646\u062F \u0639\u0628\u0648\u0631 \u0627\u0644\u0637\u0631\u0642 \u0627\u0644\u062C\u0628\u0644\u064A\u0629 \u0648\u0627\u0644\u062A\u0636\u0627\u0631\u064A\u0633 \u0627\u0644\u0631\u0645\u0644\u064A\u0629 \u0641\u064A \u0627\u0644\u0639\u0644\u0627.
2. **\u0641\u0626\u0629 \u0627\u0644\u0633\u064A\u062F\u0627\u0646 \u0627\u0644\u0641\u0627\u062E\u0631\u0629**: \u0645\u062B\u0644 \u0644\u0643\u0632\u0633 ES300h \u0644\u0644\u0645\u0633\u0627\u0641\u0631\u064A\u0646 \u0627\u0644\u0628\u0627\u062D\u062B\u064A\u0646 \u0639\u0646 \u0643\u0641\u0627\u0621\u0629 \u0627\u0633\u062A\u0647\u0644\u0627\u0643 \u0627\u0644\u0648\u0642\u0648\u062F \u0648\u0639\u0632\u0644 \u0635\u0648\u062A\u064A \u0641\u0627\u0626\u0642 \u062E\u0644\u0627\u0644 \u0627\u0644\u0633\u0641\u0631 \u0627\u0644\u0637\u0648\u064A\u0644.

### \u0646\u0635\u0627\u0626\u062D \u0630\u0647\u0628\u064A\u0629 \u0642\u0628\u0644 \u0627\u0644\u0627\u0646\u0637\u0644\u0627\u0642:
- \u062A\u0623\u0643\u062F \u0645\u0646 \u0628\u0627\u0642\u0629 \u0627\u0644\u0643\u064A\u0644\u0648\u0645\u062A\u0631\u0627\u062A \u0627\u0644\u0645\u0641\u062A\u0648\u062D\u0629 \u0639\u0628\u0631 \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062D\u062C\u0632 \u0641\u064A \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629.
- \u062A\u0641\u0642\u062F \u0636\u063A\u0637 \u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062A \u0648\u0645\u0633\u062A\u0648\u0649 \u0645\u064A\u0627\u0647 \u0627\u0644\u062A\u0628\u0631\u064A\u062F \u0641\u064A \u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0643\u0634\u0641 \u0627\u0644\u0631\u0642\u0645\u064A.
- \u062D\u0645\u0644 \u0646\u0633\u062E\u0629 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0645\u0646 \u062A\u0641\u0648\u064A\u0636 "\u062A\u0645" \u0627\u0644\u0645\u062A\u0627\u062D \u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0628\u0631 \u062D\u0633\u0627\u0628\u0643 \u0641\u064A \u0645\u0646\u0635\u0629 \u0627\u0644\u0631\u0641\u0642\u0629.`,
      en: `The overland journey from Riyadh to AlUla spans approximately 1,050 km over world-class dual carriageways and scenic desert passes.

### Recommended Vehicle Tiers:
1. **Full-size 4WD SUVs**: Toyota Land Cruiser or Nissan Patrol for effortless cruising and exploring rugged desert attractions.
2. **Executive Hybrid Sedans**: Lexus ES300h for exceptional fuel autonomy and serene cabin isolation.

### Essential Pre-Departure Checklist:
- Opt for Al-Rufqah's Unlimited Mileage package.
- Verify your contract reference in the customer portal.
- Keep emergency SOS 24/7 hotline 9200 78372 saved on speed dial.`
    },
    category: "tourism",
    coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: { ar: "\u0645. \u0641\u0647\u062F \u0627\u0644\u0633\u0628\u064A\u0639\u064A", en: "Eng. Fahad Al-Subaie" },
      role: { ar: "\u0645\u0633\u062A\u0634\u0627\u0631 \u0627\u0644\u062A\u0646\u0642\u0644 \u0648\u0627\u0644\u0631\u062D\u0644\u0627\u062A", en: "Mobility & Tourism Advisor" },
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    publishedAt: "2025-02-15",
    readTimeMinutes: 5,
    likes: 184,
    views: 3420,
    isFeatured: true,
    isPublished: true,
    tags: ["\u0631\u062D\u0644\u0627\u062A_\u0628\u0631\u064A\u0629", "\u0627\u0644\u0639\u0644\u0627", "\u0646\u0635\u0627\u0626\u062D_\u0627\u0644\u0642\u064A\u0627\u062F\u0629", "\u062A\u0623\u062C\u064A\u0631_\u0633\u064A\u0627\u0631\u0627\u062A"]
  },
  {
    id: "post-2",
    slug: "vision-2030-smart-mobility-and-evs",
    title: {
      ar: "\u0645\u0633\u062A\u0642\u0628\u0644 \u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0623\u062E\u0636\u0631 \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629: \u062A\u0648\u0633\u0639 \u0623\u0633\u0637\u0648\u0644 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0648\u0627\u0644\u0647\u062C\u064A\u0646\u0629",
      en: "Green Mobility in KSA: The Rapid Expansion of Electric & Hybrid Fleets"
    },
    excerpt: {
      ar: "\u0643\u064A\u0641 \u062A\u0642\u0648\u062F \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0627\u0644\u062A\u062D\u0648\u0644 \u0646\u062D\u0648 \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0646\u0638\u064A\u0641\u0629 \u0648\u0627\u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0645\u0633\u062A\u062F\u0627\u0645 \u0628\u0627\u0644\u062A\u0639\u0627\u0648\u0646 \u0645\u0639 \u0645\u062D\u0637\u0627\u062A \u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0633\u0631\u064A\u0639 \u0641\u064A \u0643\u0627\u0641\u0629 \u0627\u0644\u0645\u062F\u0646.",
      en: "How Al-Rufqah Group is pioneering sustainable car rental alongside national EV supercharging networks."
    },
    content: {
      ar: `\u0641\u064A \u0625\u0637\u0627\u0631 \u0645\u0628\u0627\u062F\u0631\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 \u0627\u0644\u062E\u0636\u0631\u0627\u0621 \u0648\u0645\u0633\u062A\u0647\u062F\u0641\u0627\u062A \u0631\u0624\u064A\u0629 2030\u060C \u062A\u0634\u0647\u062F \u0627\u0644\u0628\u0646\u064A\u0629 \u0627\u0644\u062A\u062D\u062A\u064A\u0629 \u0644\u0644\u0646\u0642\u0644 \u0627\u0644\u0630\u0643\u064A \u0637\u0641\u0631\u0629 \u0647\u0627\u0626\u0644\u0629 \u0641\u064A \u0627\u0646\u062A\u0634\u0627\u0631 \u0645\u062D\u0637\u0627\u062A \u0627\u0644\u0634\u062D\u0646 \u0641\u0627\u0626\u0642 \u0627\u0644\u0633\u0631\u0639\u0629 \u0639\u0644\u0649 \u0627\u0644\u0637\u0631\u0642 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 \u0648\u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0648\u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A.

\u0648\u062A\u0641\u062E\u0631 \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0628\u062F\u0645\u062C \u0623\u0643\u062B\u0631 \u0645\u0646 1,500 \u0633\u064A\u0627\u0631\u0629 \u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0648\u0647\u062C\u064A\u0646\u0629 \u062D\u062F\u064A\u062B\u0629 (\u0645\u0648\u062F\u064A\u0644\u0627\u062A 2025) \u0636\u0645\u0646 \u0623\u0633\u0637\u0648\u0644\u0647\u0627 \u0627\u0644\u0645\u062A\u0627\u062D \u0644\u0644\u062D\u062C\u0632 \u0627\u0644\u0641\u0648\u0631\u064A \u0645\u0639 \u062A\u0648\u0641\u064A\u0631 \u0634\u0648\u0627\u062D\u0646 \u0645\u0646\u0632\u0644\u064A\u0629 \u0648\u0645\u0646\u0627\u0641\u0630 \u0634\u062D\u0646 \u0645\u0639\u062A\u0645\u062F\u0629.`,
      en: `Under the Saudi Green Initiative and Vision 2030 roadmap, ultra-fast EV charging infrastructure is transforming daily commuting and intercity travel across the Kingdom.

Al-Rufqah Group proudly integrates over 1,500 state-of-the-art 2025 EV & Hybrid models into its instantly bookable fleet.`
    },
    category: "vision2030",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: { ar: "\u0633\u0627\u0631\u0629 \u0627\u0644\u062F\u0648\u0633\u0631\u064A", en: "Sarah Al-Dossary" },
      role: { ar: "\u0631\u0626\u064A\u0633\u0629 \u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0648\u0627\u0644\u0627\u0633\u062A\u062F\u0627\u0645\u0629", en: "Head of Innovation & ESG" },
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    publishedAt: "2025-02-10",
    readTimeMinutes: 4,
    likes: 142,
    views: 2890,
    isFeatured: false,
    isPublished: true,
    tags: ["\u0631\u0624\u064A\u0629_2030", "\u0633\u064A\u0627\u0631\u0627\u062A_\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629", "\u0627\u0633\u062A\u062F\u0627\u0645\u0629", "\u062A\u0642\u0646\u064A\u0629_\u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A"]
  },
  {
    id: "post-3",
    slug: "car-maintenance-summer-driving-tips",
    title: {
      ar: "\u0646\u0635\u0627\u0626\u062D \u062D\u064A\u0648\u064A\u0629 \u0644\u0642\u064A\u0627\u062F\u0629 \u0622\u0645\u0646\u0629 \u0648\u0643\u0641\u0627\u0621\u0629 \u0642\u0635\u0648\u0649 \u0644\u062A\u0643\u064A\u064A\u0641 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u062E\u0644\u0627\u0644 \u0641\u0635\u0644 \u0627\u0644\u0635\u064A\u0641",
      en: "Summer Driving in KSA: A/C Efficiency & Critical Tyre Safety Tips"
    },
    excerpt: {
      ar: "\u0625\u0631\u0634\u0627\u062F\u0627\u062A \u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0629 \u0645\u062A\u062E\u0635\u0635\u0629 \u0644\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0628\u0631\u0648\u062F\u0629 \u0627\u0644\u0645\u0642\u0635\u0648\u0631\u0629 \u0648\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062A \u0639\u0646\u062F \u0627\u0631\u062A\u0641\u0627\u0639 \u062F\u0631\u062C\u0627\u062A \u0627\u0644\u062D\u0631\u0627\u0631\u0629 \u0641\u064A \u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0637\u0648\u064A\u0644\u0629.",
      en: "Expert maintenance advice to ensure optimal cabin climate and tire integrity in high ambient desert temperatures."
    },
    content: {
      ar: `\u062A\u062A\u0637\u0644\u0628 \u0627\u0644\u0642\u064A\u0627\u062F\u0629 \u0641\u064A \u0627\u0644\u0623\u062C\u0648\u0627\u0621 \u0627\u0644\u062D\u0627\u0631\u0629 \u0639\u0646\u0627\u064A\u0629 \u062E\u0627\u0635\u0629 \u0628\u0645\u0639\u062F\u0644\u0627\u062A \u0636\u063A\u0637 \u0627\u0644\u0647\u0648\u0627\u0621 \u0641\u064A \u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062A \u0645\u0639 \u0627\u0644\u0623\u062E\u0630 \u0628\u0627\u0644\u0627\u0639\u062A\u0628\u0627\u0631 \u062A\u0645\u062F\u062F \u0627\u0644\u0647\u0648\u0627\u0621 \u0628\u0627\u0644\u062D\u0631\u0627\u0631\u0629.

\u062A\u0639\u062A\u0645\u062F \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0641\u062D\u0635 \u062F\u0648\u0631\u064A \u062F\u0642\u064A\u0642 \u064A\u0634\u0645\u0644:
- \u0641\u062D\u0635 \u0643\u0641\u0627\u0621\u0629 \u063A\u0627\u0632 \u0627\u0644\u0641\u0631\u064A\u0648\u0646 \u0648\u062A\u0646\u0638\u064A\u0641 \u0641\u0644\u062A\u0631 \u0627\u0644\u0645\u0643\u064A\u0641 \u0642\u0628\u0644 \u0643\u0644 \u062A\u0633\u0644\u064A\u0645.
- \u0641\u062D\u0635 \u0639\u0645\u0642 \u0645\u062F\u0627\u0633 \u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062A \u0648\u062A\u0627\u0631\u064A\u062E \u0625\u0646\u062A\u0627\u062C\u0647\u0627 (\u0623\u0642\u0644 \u0645\u0646 \u0639\u0627\u0645\u064A\u0646).
- \u062A\u0632\u0648\u064A\u062F \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062A \u0628\u0639\u0648\u0627\u0632\u0644 \u062D\u0631\u0627\u0631\u064A\u0629 \u0632\u062C\u0627\u062C\u064A\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 \u0648\u0641\u0642 \u0627\u0634\u062A\u0631\u0627\u0637\u0627\u062A \u0627\u0644\u0645\u0631\u0648\u0631.`,
      en: `High ambient temperatures demand strict attention to tire cold inflation pressure, engine coolant boiling points, and AC compressor performance.

Every Al-Rufqah vehicle undergoes rigorous multi-point inspection prior to customer handover.`
    },
    category: "maintenance",
    coverImage: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: { ar: "\u0645. \u0637\u0627\u0631\u0642 \u0627\u0644\u062E\u0627\u0644\u062F\u064A", en: "Eng. Tariq Al-Khaldi" },
      role: { ar: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u0641\u0646\u064A\u0629 \u0644\u0644\u0623\u0633\u0637\u0648\u0644", en: "Fleet Technical Director" },
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    publishedAt: "2025-01-28",
    readTimeMinutes: 6,
    likes: 98,
    views: 1950,
    isFeatured: false,
    isPublished: true,
    tags: ["\u0635\u064A\u0627\u0646\u0629_\u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A", "\u0646\u0635\u0627\u0626\u062D_\u0627\u0644\u0635\u064A\u0641", "\u0633\u0644\u0627\u0645\u0629_\u0627\u0644\u0645\u0631\u0648\u0631"]
  },
  {
    id: "post-4",
    slug: "riyadh-season-events-car-rental-guide",
    title: {
      ar: "\u062F\u0644\u064A\u0644 \u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0648\u0645\u0648\u0627\u0633\u0645 \u0627\u0644\u0631\u064A\u0627\u0636: \u0643\u064A\u0641 \u062A\u062E\u062A\u0627\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u062A\u0646\u0642\u0644\u0627\u062A\u0643",
      en: "Riyadh Season Mobility Guide: Choosing the Ideal Ride for Events"
    },
    excerpt: {
      ar: "\u0645\u0646 \u0628\u0648\u0644\u064A\u0641\u0627\u0631\u062F \u0648\u0648\u0631\u0644\u062F \u0625\u0644\u0649 \u0627\u0644\u0645\u0631\u0628\u0639 \u0648\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0623\u0631\u064A\u0646\u0627\u060C \u0625\u0644\u064A\u0643 \u062E\u0637\u0629 \u062A\u0646\u0642\u0644 \u0630\u0643\u064A\u0629 \u0644\u062A\u0641\u0627\u062F\u064A \u0627\u0644\u0627\u0632\u062F\u062D\u0627\u0645 \u0645\u0639 \u062E\u062F\u0645\u0629 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0633\u0631\u064A\u0639 \u0645\u0646 \u0627\u0644\u0641\u0631\u0648\u0639.",
      en: "From Boulevard World to Kingdom Arena, streamline your event mobility with express pickup and VIP parking access."
    },
    content: {
      ar: `\u062A\u0634\u0647\u062F \u0627\u0644\u0639\u0627\u0635\u0645\u0629 \u0627\u0644\u0631\u064A\u0627\u0636 \u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0639\u0627\u0644\u0645\u064A\u0629 \u0645\u062A\u0648\u0627\u0635\u0644\u0629 \u0636\u0645\u0646 \u0645\u0648\u0633\u0645 \u0627\u0644\u0631\u064A\u0627\u0636 \u0648\u0627\u0644\u0645\u0624\u062A\u0645\u0631\u0627\u062A \u0627\u0644\u062F\u0648\u0644\u064A\u0629. \u0644\u062A\u062C\u0631\u0628\u0629 \u062A\u0646\u0642\u0644 \u0633\u0644\u0633\u0629\u060C \u0646\u0646\u0635\u062D \u0628\u0645\u0627 \u064A\u0644\u064A:

1. **\u062D\u062C\u0632 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0645\u0633\u0628\u0642\u0627\u064B \u0645\u0646 \u0641\u0631\u0648\u0639 \u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0627\u0644\u062F\u0648\u0644\u064A**: \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0633\u0631\u064A\u0639 \u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642 \u0628\u0639\u062F \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0648\u062B\u0627\u0626\u0642.
2. **\u0627\u062E\u062A\u064A\u0627\u0631 \u0628\u0627\u0642\u0629 \u0627\u0644\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0634\u0627\u0645\u0644\u0629 \u0633\u0648\u0628\u0631**: \u0644\u0631\u0627\u062D\u0629 \u0628\u0627\u0644 \u0645\u0637\u0644\u0642\u0629 \u0628\u062F\u0648\u0646 \u062A\u062D\u0645\u0644 \u0623\u064A \u0645\u0628\u0627\u0644\u063A \u062A\u0623\u0645\u064A\u0646 \u0641\u064A \u062D\u0627\u0644 \u062D\u062F\u0648\u062B \u062E\u062F\u0648\u0634 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639\u0629 \u0641\u064A \u0627\u0644\u0645\u0648\u0627\u0642\u0641 \u0627\u0644\u0645\u0632\u062F\u062D\u0645\u0629.`,
      en: `With millions of visitors attending world-class Riyadh Season zones, smart transit planning is paramount.

Opt for express branch pickup and zero-excess comprehensive protection for stress-free parking.`
    },
    category: "guides",
    coverImage: "https://images.unsplash.com/photo-1512958789358-4dac4483a992?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: { ar: "\u0631\u064A\u0645 \u0627\u0644\u0639\u062A\u064A\u0628\u064A", en: "Reem Al-Otaibi" },
      role: { ar: "\u0623\u062E\u0635\u0627\u0626\u064A\u0629 \u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0639\u0645\u064A\u0644", en: "Customer Experience Lead" },
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    publishedAt: "2025-01-14",
    readTimeMinutes: 4,
    likes: 210,
    views: 4120,
    isFeatured: false,
    isPublished: true,
    tags: ["\u0645\u0648\u0633\u0645_\u0627\u0644\u0631\u064A\u0627\u0636", "\u0633\u064A\u0627\u062D\u0629_\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", "\u062D\u062C\u0632_\u0627\u0644\u0645\u0637\u0627\u0631"]
  }
];

// backend/db.ts
var AlRufqahDataStore = class {
  constructor() {
    this.cars = [...CARS_DATA];
    this.branches = [...BRANCHES_DATA];
    this.blogPosts = [...BLOG_POSTS_DATA];
    this.users = [];
    this.bookings = [];
    this.roadsideTickets = [];
    this.corporateInquiries = [];
    this.inspectionReports = [];
    this.auditLogs = [];
  }
};
var db = new AlRufqahDataStore();

// src/data/offers.ts
var OFFERS_DATA = [
  {
    id: "offer-weekend",
    title: { ar: "\u0639\u0631\u0636 \u0627\u0644\u0648\u064A\u0643\u0646\u062F \u0627\u0644\u0645\u0645\u064A\u0632 - \u062E\u0635\u0645 20%", en: "Special Weekend Escape - 20% OFF" },
    description: {
      ar: "\u0627\u0633\u062A\u0645\u062A\u0639 \u0628\u0625\u062C\u0627\u0632\u0629 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0645\u0639 \u062E\u0635\u0645 \u0641\u0648\u0631\u064A 20% \u0639\u0644\u0649 \u062C\u0645\u064A\u0639 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0633\u064A\u062F\u0627\u0646 \u0648\u0627\u0644\u0639\u0627\u0626\u0644\u064A\u0629 \u0639\u0646\u062F \u0627\u0644\u062D\u062C\u0632 \u0645\u0646 \u0627\u0644\u062E\u0645\u064A\u0633 \u0625\u0644\u0649 \u0627\u0644\u0633\u0628\u062A.",
      en: "Enjoy your weekend getaways with an instant 20% discount on all Sedans and SUVs from Thursday to Saturday."
    },
    discount: "20% OFF",
    code: "WEEKEND20",
    badge: { ar: "\u0639\u0631\u0636 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", en: "Weekly Deal" },
    validUntil: "2026-12-31",
    category: "weekend",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    applicableCategories: ["sedan", "suv", "family"]
  },
  {
    id: "offer-alfursan",
    title: { ar: "\u0646\u0642\u0627\u0637 \u0627\u0644\u0641\u0631\u0633\u0627\u0646 \u0627\u0644\u0645\u0636\u0627\u0639\u0641\u0629 (5x \u0623\u0645\u064A\u0627\u0644)", en: "5x AlFursan Reward Miles" },
    description: {
      ar: "\u0627\u0643\u0633\u0628 5 \u0623\u0645\u064A\u0627\u0644 \u0645\u0643\u0627\u0641\u0623\u0629 \u0645\u0639 \u0627\u0644\u0641\u0631\u0633\u0627\u0646 \u0644\u0643\u0644 10 \u0631\u064A\u0627\u0644\u0627\u062A \u062A\u0646\u0641\u0642\u0647\u0627 \u0641\u064A \u0627\u0633\u062A\u0626\u062C\u0627\u0631 \u0623\u064A \u0633\u064A\u0627\u0631\u0629 \u0645\u0646 \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0639\u0628\u0631 \u0643\u0627\u0641\u0629 \u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A.",
      en: "Earn 5 bonus AlFursan miles for every 10 SAR spent on your car rentals across all airport branches."
    },
    discount: "5X MILES",
    code: "",
    badge: { ar: "\u0634\u0631\u064A\u0643 \u0627\u0644\u0637\u064A\u0631\u0627\u0646", en: "Airline Partner" },
    validUntil: "2026-11-30",
    category: "partner",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-monthly",
    title: { ar: "\u0628\u0627\u0642\u0629 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0627\u0644\u0634\u0647\u0631\u064A \u0627\u0644\u0645\u062E\u0641\u0636\u0629 - \u0648\u0641\u0631 \u062D\u062A\u0649 35%", en: "Monthly Subscription Plan - Save 35%" },
    description: {
      ar: "\u0627\u0633\u062A\u0623\u062C\u0631 \u0634\u0647\u0631\u064A\u0627\u064B \u0628\u0623\u0642\u0644 \u062A\u0643\u0644\u0641\u0629 \u0645\u0639 \u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644\u060C \u0635\u064A\u0627\u0646\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u062F\u0648\u0631\u064A\u0629\u060C \u0643\u064A\u0644\u0648\u0645\u062A\u0631\u0627\u062A \u0645\u0641\u062A\u0648\u062D\u0629\u060C \u0648\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u062D\u062A\u0649 \u0628\u0627\u0628 \u0645\u0646\u0632\u0644\u0643 \u0623\u0648 \u0639\u0645\u0644\u0643.",
      en: "Rent monthly at unbeatable rates with full insurance, routine maintenance, open mileage, and doorstep delivery."
    },
    discount: "35% OFF",
    code: "MONTHLY35",
    badge: { ar: "\u0627\u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0634\u0647\u0631\u064A", en: "Monthly Lease" },
    validUntil: "2026-12-31",
    category: "monthly",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-airport-fast",
    title: { ar: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0633\u0627\u0641\u0631 \u0627\u0644\u0633\u0631\u064A\u0639 - \u062E\u0635\u0645 15% \u0628\u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A", en: "Express Airport Deal - 15% OFF" },
    description: {
      ar: "\u0627\u0633\u062A\u0644\u0645 \u0633\u064A\u0627\u0631\u062A\u0643 \u0630\u0627\u062A\u064A\u0627\u064B \u0648\u0628\u062F\u0648\u0646 \u0627\u0646\u062A\u0638\u0627\u0631 \u0641\u064A \u0635\u0627\u0644\u0627\u062A \u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0648\u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0648\u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F \u0645\u0639 \u062E\u0635\u0645 15% \u0628\u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0627\u0644\u0645\u0633\u0628\u0642.",
      en: "Fast self-service keyless pickup at KKIA, KAIA, and KFIA with 15% off when paying online."
    },
    discount: "15% OFF",
    code: "AIRPORT15",
    badge: { ar: "\u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u0637\u0627\u0631", en: "Airport Express" },
    validUntil: "2026-10-31",
    category: "airport",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-qitaf",
    title: { ar: "\u0639\u0631\u0636 \u0642\u0637\u0627\u0641 stc - \u0627\u0633\u062A\u0628\u062F\u0644 \u0646\u0642\u0627\u0637\u0643 \u0628\u0631\u062D\u0644\u0627\u062A \u0645\u062C\u0627\u0646\u064A\u0629", en: "stc Qitaf Rewards - Redeem Points" },
    description: {
      ar: "\u0627\u0633\u062A\u0628\u062F\u0644 \u0646\u0642\u0627\u0637 \u0642\u0637\u0627\u0641 \u0628\u0642\u0633\u0627\u0626\u0645 \u062E\u0635\u0645 \u0641\u0648\u0631\u064A\u0629 \u0623\u0648 \u0627\u0643\u0633\u0628 \u0646\u0642\u0627\u0637 \u0642\u0637\u0627\u0641 \u0639\u0646\u062F \u0643\u0644 \u0639\u0645\u0644\u064A\u0629 \u062A\u0623\u062C\u064A\u0631 \u0628\u062C\u0645\u064A\u0639 \u0641\u0631\u0648\u0639 \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629.",
      en: "Redeem stc Qitaf points for instant rental vouchers or earn Qitaf points on every ride."
    },
    discount: "QITAF VIP",
    code: "QITAF2025",
    badge: { ar: "\u0634\u0631\u064A\u0643 \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u0627\u062A", en: "Telecom Partner" },
    validUntil: "2026-12-31",
    category: "partner",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-early-booking",
    title: { ar: "\u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u0628\u0643\u0631 - \u0648\u0641\u0631 10% \u0625\u0636\u0627\u0641\u064A\u0629", en: "Early Bird Booking - Extra 10% OFF" },
    description: {
      ar: "\u0627\u062D\u062C\u0632 \u0642\u0628\u0644 \u0645\u0648\u0639\u062F \u0631\u062D\u0644\u062A\u0643 \u0628\u0640 5 \u0623\u064A\u0627\u0645 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0648\u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u062E\u0635\u0645 10% \u0625\u0636\u0627\u0641\u064A \u0641\u0648\u0642 \u0623\u064A \u0639\u0631\u0636 \u062D\u0627\u0644\u064A.",
      en: "Book at least 5 days in advance and get an additional 10% discount on top of active deals."
    },
    discount: "10% OFF",
    code: "EARLYBIRD",
    badge: { ar: "\u062D\u062C\u0632 \u0645\u0633\u0628\u0642", en: "Early Bird" },
    validUntil: "2026-12-31",
    category: "daily",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  }
];

// src/data/extra.ts
var USED_CARS_DATA = [
  {
    id: "uc-camry-2023",
    name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627 \u0643\u0627\u0645\u0631\u064A GLX 2023", en: "Toyota Camry GLX 2023" },
    brand: "Toyota",
    year: 2023,
    modelYear: 2023,
    mileage: 48500,
    price: 74e3,
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    monthlyInstallment: 1280,
    inspectionPassed: true,
    warrantyMonths: 12,
    warranty: { ar: "\u0636\u0645\u0627\u0646 \u0633\u0646\u0629 \u0643\u0627\u0645\u0644\u0629", en: "1-Year Full Warranty" },
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
    specs: {
      ar: ["\u0641\u062D\u0635 \u062F\u0648\u0631\u064A \u0645\u0639\u062A\u0645\u062F 150 \u0646\u0642\u0637\u0629", "\u0635\u064A\u0627\u0646\u0629 \u0643\u0627\u0645\u0644\u0629 \u0644\u062F\u0649 \u0627\u0644\u0648\u0643\u064A\u0644", "\u0628\u062F\u0648\u0646 \u0623\u064A \u062D\u0648\u0627\u062F\u062B \u0633\u0627\u0628\u0642\u0629", "\u062A\u0638\u0644\u064A\u0644 \u0648\u062D\u0645\u0627\u064A\u0629 \u0639\u0627\u0632\u0644\u0629", "\u0636\u0645\u0627\u0646 \u0645\u0645\u062A\u062F \u0633\u0646\u0629 \u0643\u0627\u0645\u0644\u0629"],
      en: ["150-Point Certified Inspection", "Full Agency Service History", "Accident Free", "Thermal Tinting", "1-Year Full Warranty"]
    },
    category: "Sedan"
  },
  {
    id: "uc-tucson-2023",
    name: { ar: "\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u062A\u0648\u0633\u0627\u0646 \u0633\u0645\u0627\u0631\u062A 2023", en: "Hyundai Tucson Smart 2023" },
    brand: "Hyundai",
    year: 2023,
    modelYear: 2023,
    mileage: 52e3,
    price: 78500,
    city: { ar: "\u062C\u062F\u0629", en: "Jeddah" },
    monthlyInstallment: 1350,
    inspectionPassed: true,
    warrantyMonths: 12,
    warranty: { ar: "\u0636\u0645\u0627\u0646 \u0633\u0646\u0629 \u0643\u0627\u0645\u0644\u0629", en: "1-Year Full Warranty" },
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    specs: {
      ar: ["\u0641\u062A\u062D\u0629 \u0633\u0642\u0641 \u0628\u0627\u0646\u0648\u0631\u0627\u0645\u0627", "\u062F\u0641\u0639 \u0643\u0644\u064A AWD", "\u0634\u0627\u0634\u0629 \u0630\u0643\u064A\u0629 \u0648\u0643\u0627\u0645\u064A\u0631\u0627 \u062E\u0644\u0641\u064A\u0629", "\u062D\u0627\u0644\u0629 \u0627\u0644\u0648\u0643\u0627\u0644\u0629 \u0634\u0628\u0647 \u062C\u062F\u064A\u062F\u0629", "\u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u062A\u0642\u0633\u064A\u0637 \u0627\u0644\u0645\u064A\u0633\u0631"],
      en: ["Panoramic Sunroof", "AWD System", "Smart Touchscreen & Camera", "Near New Condition", "Flexible Financing Options"]
    },
    category: "SUV"
  },
  {
    id: "uc-accent-2023",
    name: { ar: "\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0623\u0643\u0633\u0646\u062A \u0633\u0645\u0627\u0631\u062A 2023", en: "Hyundai Accent Smart 2023" },
    brand: "Hyundai",
    year: 2023,
    modelYear: 2023,
    mileage: 61e3,
    price: 43e3,
    city: { ar: "\u0627\u0644\u062F\u0645\u0627\u0645", en: "Dammam" },
    monthlyInstallment: 740,
    inspectionPassed: true,
    warrantyMonths: 6,
    warranty: { ar: "\u0636\u0645\u0627\u0646 6 \u0623\u0634\u0647\u0631", en: "6-Month Warranty" },
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    specs: {
      ar: ["\u0627\u0642\u062A\u0635\u0627\u062F \u0648\u0642\u0648\u062F \u0645\u0645\u062A\u0627\u0632", "\u0646\u0627\u0642\u0644 \u062D\u0631\u0643\u0629 \u0623\u0648\u062A\u0648\u0645\u0627\u062A\u064A\u0643\u064A \u0633\u0644\u0633", "\u0646\u0638\u064A\u0641\u0629 \u062C\u062F\u0627\u064B \u0645\u0646 \u0627\u0644\u062F\u0627\u062E\u0644 \u0648\u0627\u0644\u062E\u0627\u0631\u062C", "\u0628\u0637\u0627\u0631\u064A\u0629 \u0648\u0625\u0637\u0627\u0631\u0627\u062A \u062C\u062F\u064A\u062F\u0629", "\u0646\u0642\u0644 \u0645\u0644\u0643\u064A\u0629 \u0641\u0648\u0631\u064A"],
      en: ["Superior Fuel Economy", "Smooth Automatic Gearbox", "Immaculate Interior/Exterior", "Brand New Battery & Tires", "Instant Title Transfer"]
    },
    category: "Economy"
  },
  {
    id: "uc-prado-2022",
    name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627 \u0628\u0631\u0627\u062F\u0648 TXL 2022 V6", en: "Toyota Prado TXL 2022 V6" },
    brand: "Toyota",
    year: 2022,
    modelYear: 2022,
    mileage: 69e3,
    price: 148e3,
    city: { ar: "\u0627\u0644\u0631\u064A\u0627\u0636", en: "Riyadh" },
    monthlyInstallment: 2550,
    inspectionPassed: true,
    warrantyMonths: 12,
    warranty: { ar: "\u0636\u0645\u0627\u0646 \u0645\u0645\u062A\u062F \u0633\u0646\u0629", en: "1-Year Full Warranty" },
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    specs: {
      ar: ["\u0645\u062D\u0631\u0643 6 \u0633\u0644\u0646\u062F\u0631 4.0 \u0644\u062A\u0631", "\u062F\u0641\u0639 \u0631\u0628\u0627\u0639\u064A \u0645\u0633\u062A\u0645\u0631 \u0648\u062F\u0628\u0644 \u062E\u0641\u064A\u0641 \u0648\u062B\u0642\u064A\u0644", "\u0645\u0642\u0627\u0639\u062F \u062C\u0644\u062F \u0648\u062A\u0628\u0631\u064A\u062F", "\u062B\u0644\u0627\u062C\u0629 \u0648\u0641\u062A\u062D\u0629 \u0633\u0642\u0641", "\u0633\u062C\u0644 \u0635\u064A\u0627\u0646\u0629 \u0648\u0643\u064A\u0644 \u0639\u0628\u062F \u0627\u0644\u0644\u0637\u064A\u0641 \u062C\u0645\u064A\u0644"],
      en: ["4.0L V6 Powertrain", "Full-Time 4WD with Diff Lock", "Leather Ventilated Seats", "Cool Box & Sunroof", "Full ALJ Agency History"]
    },
    category: "SUV"
  }
];
var LOYALTY_TIERS = [
  {
    id: "silver",
    name: { ar: "\u0639\u0636\u0648\u064A\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0627\u0644\u0641\u0636\u064A\u0629 (Silver)", en: "Al-Rufqah Silver Member" },
    minRentals: 0,
    qualifyingRentals: { ar: "\u0645\u0646 \u0623\u0648\u0644 \u062D\u062C\u0632", en: "From 1st Rental" },
    discountPercentage: 5,
    color: "#94A3B8",
    multiplier: 1,
    benefits: {
      ar: [
        "\u0646\u0642\u0637\u0629 \u0648\u0627\u062D\u062F\u0629 \u0644\u0643\u0644 1 \u0631\u064A\u0627\u0644 \u0645\u0633\u062A\u0623\u062C\u0631 \u0628\u0647",
        "\u062E\u0635\u0645 5% \u0645\u0628\u0627\u0634\u0631 \u0639\u0644\u0649 \u0627\u0644\u0625\u064A\u062C\u0627\u0631\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629",
        "\u062A\u0631\u0642\u064A\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u0644\u0641\u0626\u0629 \u0623\u0639\u0644\u0649 \u0628\u0639\u062F 3 \u062D\u062C\u0648\u0632\u0627\u062A",
        "\u0623\u0648\u0644\u0648\u064A\u0629 \u062D\u062C\u0632 \u0641\u064A \u0645\u0648\u0627\u0633\u0645 \u0627\u0644\u0623\u0639\u064A\u0627\u062F \u0648\u0627\u0644\u0639\u0637\u0644\u0627\u062A"
      ],
      en: [
        "1 Point for every 1 SAR spent",
        "Direct 5% discount on daily rentals",
        "Complimentary category upgrade after 3 rentals",
        "Priority booking during holiday seasons"
      ]
    },
    perks: {
      ar: [
        "\u0646\u0642\u0637\u0629 \u0644\u0643\u0644 1 \u0631\u064A\u0627\u0644 \u0645\u0633\u062A\u0623\u062C\u0631 \u0628\u0647",
        "\u062E\u0635\u0645 5% \u0645\u0628\u0627\u0634\u0631 \u0639\u0644\u0649 \u0627\u0644\u0625\u064A\u062C\u0627\u0631\u0627\u062A",
        "\u062E\u062F\u0645\u0629 \u062F\u0639\u0645 \u0639\u0645\u0644\u0627\u0621 \u0645\u062E\u0635\u0635\u0629",
        "\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0646\u0642\u0627\u0637 \u0645\u0639 \u0637\u064A\u0631\u0627\u0646 \u0627\u0644\u0641\u0631\u0633\u0627\u0646 \u0648\u0642\u0637\u0627\u0641"
      ],
      en: [
        "1 Point per 1 SAR spent",
        "Direct 5% instant discount",
        "Dedicated customer support line",
        "Redeemable with AlFursan & Qitaf"
      ]
    }
  },
  {
    id: "gold",
    name: { ar: "\u0639\u0636\u0648\u064A\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 (Gold)", en: "Al-Rufqah Gold Member" },
    minRentals: 5,
    qualifyingRentals: { ar: "\u0628\u0639\u062F 5 \u062D\u062C\u0648\u0632\u0627\u062A", en: "After 5 Rentals" },
    discountPercentage: 12,
    color: "#EAB308",
    multiplier: 1.5,
    benefits: {
      ar: [
        "1.5 \u0646\u0642\u0637\u0629 \u0644\u0643\u0644 1 \u0631\u064A\u0627\u0644 \u0645\u0633\u062A\u0623\u062C\u0631 \u0628\u0647 (50% \u0646\u0642\u0627\u0637 \u0625\u0636\u0627\u0641\u064A\u0629)",
        "\u062E\u0635\u0645 12% \u0645\u0628\u0627\u0634\u0631 \u0639\u0644\u0649 \u0643\u0627\u0641\u0629 \u0627\u0644\u0641\u0626\u0627\u062A",
        "\u0633\u0627\u0626\u0642 \u0625\u0636\u0627\u0641\u064A \u0645\u062C\u0627\u0646\u0627\u064B \u0641\u064A \u0643\u0644 \u062D\u062C\u0632",
        "\u0625\u0639\u0641\u0627\u0621 \u0643\u0627\u0645\u0644 \u0645\u0646 \u0631\u0633\u0648\u0645 \u0627\u0633\u062A\u0644\u0627\u0645/\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0637\u0627\u0631",
        "\u062E\u062F\u0645\u0629 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0633\u0631\u064A\u0639 \u0628\u062F\u0648\u0646 \u0627\u0646\u062A\u0638\u0627\u0631 (VIP Express)"
      ],
      en: [
        "1.5 Points per 1 SAR (50% bonus points)",
        "Direct 12% discount across all categories",
        "Free additional driver on every booking",
        "Zero airport pickup/dropoff surcharges",
        "VIP Express Counter fast-track service"
      ]
    },
    perks: {
      ar: [
        "\u062E\u0635\u0645 12% \u062F\u0627\u0626\u0645 \u0639\u0644\u0649 \u0643\u0627\u0641\u0629 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A",
        "\u0633\u0627\u0626\u0642 \u0625\u0636\u0627\u0641\u064A \u062B\u0627\u0646\u064D \u0645\u062C\u0627\u0646\u0627\u064B",
        "\u0625\u0639\u0641\u0627\u0621 \u0643\u0627\u0645\u0644 \u0645\u0646 \u0631\u0633\u0648\u0645 \u0635\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A",
        "\u0623\u0648\u0644\u0648\u064A\u0629 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0641\u064A \u0623\u0642\u0644 \u0645\u0646 45 \u062B\u0627\u0646\u064A\u0629"
      ],
      en: [
        "12% instant discount on all models",
        "Free second authorized driver",
        "Zero airport terminal surcharge",
        "VIP express keyless delivery under 45s"
      ]
    }
  },
  {
    id: "platinum",
    name: { ar: "\u0639\u0636\u0648\u064A\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u0627\u0644\u0628\u0644\u0627\u062A\u064A\u0646\u064A\u0629 (Platinum VIP)", en: "Al-Rufqah Platinum VIP" },
    minRentals: 15,
    qualifyingRentals: { ar: "\u0628\u0639\u062F 15 \u062D\u062C\u0632\u0627\u064B \u0623\u0648 45 \u064A\u0648\u0645\u0627\u064B", en: "15 Rentals or 45+ Days" },
    discountPercentage: 20,
    color: "#0284C7",
    multiplier: 2,
    benefits: {
      ar: [
        "\u0646\u0642\u0637\u062A\u0627\u0646 \u0645\u0636\u0627\u0639\u0641\u062A\u0627\u0646 \u0644\u0643\u0644 1 \u0631\u064A\u0627\u0644 \u062A\u0646\u0641\u0642\u0647 (100% \u0646\u0642\u0627\u0637 \u0645\u0643\u0627\u0641\u0623\u0629)",
        "\u062E\u0635\u0645 20% \u062F\u0627\u0626\u0645 \u0639\u0644\u0649 \u062C\u0645\u064A\u0639 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0623\u0633\u0637\u0648\u0644 \u0628\u0645\u0627 \u0641\u064A\u0647\u0627 \u0627\u0644\u0641\u0627\u062E\u0631\u0629",
        "\u062A\u0631\u0642\u064A\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u0645\u0624\u0643\u062F\u0629 \u0644\u0641\u0626\u0629 \u0641\u0627\u062E\u0631\u0629 \u0639\u0646\u062F \u0627\u0644\u062A\u0648\u0641\u0631",
        "\u062A\u0648\u0635\u064A\u0644 \u0648\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u062C\u0627\u0646\u064A \u0644\u0644\u0645\u0631\u0643\u0628\u0629 \u0639\u0646\u062F \u0628\u0627\u0628 \u0628\u064A\u062A\u0643 \u0623\u0648 \u0645\u0643\u062A\u0628\u0643",
        "\u0645\u062F\u064A\u0631 \u062D\u0633\u0627\u0628 \u0634\u062E\u0635\u064A \u0645\u062E\u0635\u0635 \u0639\u0644\u0649 \u0645\u062F\u0627\u0631 24/7",
        "\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644 \u0628\u062F\u0648\u0646 \u0623\u064A \u0646\u0633\u0628\u0629 \u062A\u062D\u0645\u0644 \u0645\u062C\u0627\u0646\u0627\u064B"
      ],
      en: [
        "Double points (2 pts per 1 SAR spent)",
        "Permanent 20% discount on entire fleet including luxury",
        "Guaranteed complimentary category upgrade on availability",
        "Free door-to-door vehicle delivery & collection",
        "Dedicated 24/7 Personal VIP Account Concierge",
        "Free Zero-Liability Comprehensive Insurance"
      ]
    },
    perks: {
      ar: [
        "\u062E\u0635\u0645 20% \u062F\u0627\u0626\u0645 \u0639\u0644\u0649 \u0627\u0644\u0623\u0633\u0637\u0648\u0644 \u0628\u0627\u0644\u0643\u0627\u0645\u0644",
        "\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644 \u0648\u062D\u0645\u0627\u064A\u0629 \u0641\u0627\u0626\u0642\u0629 (0 \u0631\u064A\u0627\u0644 \u062A\u062D\u0645\u0644) \u0645\u062C\u0627\u0646\u0627\u064B",
        "\u062A\u0648\u0635\u064A\u0644 \u0648\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u062C\u0627\u0646\u064A \u0644\u0644\u0645\u0646\u0632\u0644 \u0623\u0648 \u0627\u0644\u0641\u0646\u062F\u0642",
        "\u0645\u062F\u064A\u0631 \u062D\u0633\u0627\u0628 VIP \u0645\u062A\u0627\u062D \u0639\u0644\u0649 \u0645\u062F\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629"
      ],
      en: [
        "Permanent 20% discount across entire fleet",
        "Complimentary Zero-Deductible Super Protection",
        "Free door-to-door vehicle handover",
        "Dedicated 24/7 VIP Concierge Manager"
      ]
    }
  }
];
var SUBSCRIPTIONS_DATA = [
  {
    id: "sub-economy",
    tier: { ar: "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0627\u0642\u062A\u0635\u0627\u062F\u064A\u0629 (Economy Pass)", en: "Economy Pass" },
    monthlyPrice: 2450,
    includedKmPerMonth: 3500,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    sampleCars: {
      ar: ["\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0623\u0643\u0633\u0646\u062A 2025", "\u062A\u0648\u064A\u0648\u062A\u0627 \u064A\u0627\u0631\u0633 2025", "\u0643\u064A\u0627 \u0628\u064A\u062C\u0627\u0633 2025"],
      en: ["Hyundai Accent 2025", "Toyota Yaris 2025", "Kia Pegas 2025"]
    },
    features: {
      ar: ["\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644 \u0648\u0635\u064A\u0627\u0646\u0629 \u062F\u0648\u0631\u064A\u0629 \u0645\u062C\u0627\u0646\u064A\u0629", "\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0643\u0644 6 \u0623\u0634\u0647\u0631", "\u062A\u0648\u0635\u064A\u0644 \u0645\u062C\u0627\u0646\u064A \u0644\u0644\u0645\u0646\u0632\u0644"],
      en: ["Full insurance & scheduled maintenance", "Swap car every 6 months", "Free home delivery"]
    }
  },
  {
    id: "sub-sedan",
    tier: { ar: "\u0628\u0627\u0642\u0629 \u0627\u0644\u0633\u064A\u062F\u0627\u0646 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A\u0629 (Executive Sedan)", en: "Executive Sedan" },
    monthlyPrice: 3850,
    includedKmPerMonth: 4e3,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
    sampleCars: {
      ar: ["\u062A\u0648\u064A\u0648\u062A\u0627 \u0643\u0627\u0645\u0631\u064A 2025", "\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0633\u0648\u0646\u0627\u062A\u0627 2025", "\u0646\u064A\u0633\u0627\u0646 \u0623\u0644\u062A\u064A\u0645\u0627 2025"],
      en: ["Toyota Camry 2025", "Hyundai Sonata 2025", "Nissan Altima 2025"]
    },
    features: {
      ar: ["\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644 \u0628\u062F\u0648\u0646 \u0646\u0633\u0628\u0629 \u062A\u062D\u0645\u0644", "\u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0625\u0636\u0627\u0641\u0629 \u0633\u0627\u0626\u0642 \u062B\u0627\u0646\u064D \u0645\u062C\u0627\u0646\u0627\u064B", "\u062E\u062F\u0645\u0629 \u0645\u0633\u0627\u0639\u062F\u0629 \u0637\u0631\u064A\u0642 VIP"],
      en: ["Zero-deductible insurance", "Free second authorized driver", "VIP Roadside rescue"]
    }
  },
  {
    id: "sub-suv",
    tier: { ar: "\u0628\u0627\u0642\u0629 \u0627\u0644\u0639\u0627\u0626\u0644\u0629 \u0648\u0627\u0644\u0640 SUV (Family & Crossover)", en: "Family SUV Pass" },
    monthlyPrice: 4950,
    includedKmPerMonth: 4500,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    sampleCars: {
      ar: ["\u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0633\u0646\u062A\u0627\u0641\u064A 2025", "\u062A\u0648\u064A\u0648\u062A\u0627 \u0631\u0627\u0641 \u0641\u0648\u0631 2025", "\u0643\u064A\u0627 \u0633\u0628\u0648\u0631\u062A\u0627\u062C 2025"],
      en: ["Hyundai Santa Fe 2025", "Toyota RAV4 2025", "Kia Sportage 2025"]
    },
    features: {
      ar: ["\u0633\u0639\u0629 7 \u0631\u0643\u0627\u0628 \u0648\u062F\u0641\u0639 \u0631\u0628\u0627\u0639\u064A", "\u0643\u064A\u0644\u0648\u0645\u062A\u0631\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 \u0645\u0631\u0646\u0629", "\u0633\u064A\u0627\u0631\u0629 \u0628\u062F\u064A\u0644\u0629 \u0641\u0648\u0631\u064A\u0629 \u0628\u0646\u0641\u0633 \u0627\u0644\u0641\u0626\u0629"],
      en: ["7-Seater AWD capability", "Flexible rollover mileage", "Immediate same-tier replacement"]
    }
  },
  {
    id: "sub-luxury",
    tier: { ar: "\u0628\u0627\u0642\u0629 \u0627\u0644\u0646\u062E\u0628\u0629 \u0648\u0627\u0644\u0641\u0627\u062E\u0631\u0629 (Prestige Luxury)", en: "Prestige Luxury" },
    monthlyPrice: 8900,
    includedKmPerMonth: 5e3,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    sampleCars: {
      ar: ["\u0645\u0631\u0633\u064A\u062F\u0633 E-Class 2025", "\u0628\u064A \u0625\u0645 \u062F\u0628\u0644\u064A\u0648 \u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u062E\u0627\u0645\u0633\u0629 2025", "\u062C\u064A\u0646\u064A\u0633\u064A\u0633 G80 2025"],
      en: ["Mercedes E-Class 2025", "BMW 5-Series 2025", "Genesis G80 2025"]
    },
    features: {
      ar: ["\u062A\u0623\u0645\u064A\u0646 VIP \u0641\u0627\u0626\u0642 \u0634\u0627\u0645\u0644 \u0627\u0644\u062D\u0648\u0627\u062F\u062B \u0648\u0627\u0644\u062E\u062F\u0648\u0634", "\u062E\u062F\u0645\u0629 \u0643\u0648\u0646\u0633\u064A\u0631\u062C \u0648\u063A\u0633\u064A\u0644 \u062F\u0648\u0631\u064A \u0645\u062C\u0627\u0646\u064A", "\u0623\u0648\u0644\u0648\u064A\u0629 \u0641\u064A \u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0648\u062F\u064A\u0644\u0627\u062A"],
      en: ["Super VIP Zero-Liability Insurance", "Free periodic detailing & wash", "Priority for newest arrivals"]
    }
  }
];
var FAQ_DATA = [
  {
    id: "faq-1",
    category: "requirements",
    question: {
      ar: "\u0645\u0627 \u0647\u064A \u0627\u0644\u0648\u062B\u0627\u0626\u0642 \u0648\u0627\u0644\u0634\u0631\u0648\u0637 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0627\u0633\u062A\u0626\u062C\u0627\u0631 \u0633\u064A\u0627\u0631\u0629 \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629\u061F",
      en: "What documents and requirements are needed to rent a car in Saudi Arabia?"
    },
    answer: {
      ar: "\u0644\u0644\u0645\u0648\u0627\u0637\u0646\u064A\u0646 \u0648\u0627\u0644\u0645\u0642\u064A\u0645\u064A\u0646: \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0648\u0637\u0646\u064A\u0629 \u0623\u0648 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0633\u0627\u0631\u064A\u0629 \u0627\u0644\u0645\u0641\u0639\u0648\u0644\u060C \u0648\u0631\u062E\u0635\u0629 \u0642\u064A\u0627\u062F\u0629 \u0633\u0639\u0648\u062F\u064A\u0629 \u0633\u0627\u0631\u064A\u0629\u060C \u0648\u0623\u0644\u0627 \u064A\u0642\u0644 \u0639\u0645\u0631 \u0627\u0644\u0645\u0633\u062A\u0623\u062C\u0631 \u0639\u0646 21 \u0639\u0627\u0645\u0627\u064B (25 \u0639\u0627\u0645\u0627\u064B \u0644\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0648\u0627\u0644\u0643\u0628\u064A\u0631\u0629)\u060C \u0648\u0628\u0637\u0627\u0642\u0629 \u062F\u0641\u0639 (\u0645\u062F\u0649 \u0623\u0648 \u0641\u064A\u0632\u0627/\u0645\u0627\u0633\u062A\u0631\u0643\u0627\u0631\u062F).\n\n\u0644\u0632\u0648\u0627\u0631 \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0648\u0627\u0644\u062E\u0644\u064A\u062C\u064A\u064A\u0646: \u062C\u0648\u0627\u0632 \u0627\u0644\u0633\u0641\u0631 \u0645\u0639 \u062A\u0623\u0634\u064A\u0631\u0629 \u0627\u0644\u062F\u062E\u0648\u0644\u060C \u0648\u0631\u062E\u0635\u0629 \u0627\u0644\u0642\u064A\u0627\u062F\u0629 \u0627\u0644\u0648\u0637\u0646\u064A\u0629 \u0623\u0648 \u0627\u0644\u062F\u0648\u0644\u064A\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629\u060C \u0648\u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062A\u0645\u0627\u0646\u064A\u0629.",
      en: "For Citizens & Residents: Valid National ID or Iqama, valid Saudi Driving License, minimum age of 21 (25 for luxury/large SUVs), and valid payment card (Mada/Visa/MasterCard).\n\nFor GCC Citizens & Tourists: Valid Passport with entry stamp/visa, valid National or International Driving Permit, and valid credit card."
    }
  },
  {
    id: "faq-2",
    category: "booking",
    question: {
      ar: "\u0643\u0645 \u064A\u0633\u062A\u063A\u0631\u0642 \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0645\u0646 \u0627\u0644\u0641\u0631\u0639 \u0623\u0648 \u0627\u0644\u0645\u0637\u0627\u0631\u061F",
      en: "How long does vehicle pickup take at the branch or airport?"
    },
    answer: {
      ar: "\u0628\u0639\u062F \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u062C\u0632\u060C \u064A\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0645\u0633\u0628\u0642\u0627\u064B. \u0639\u0646\u062F \u0648\u0635\u0648\u0644\u0643 \u0625\u0644\u0649 \u0627\u0644\u0641\u0631\u0639 \u0623\u0648 \u0635\u0627\u0644\u0629 \u0627\u0644\u0645\u0637\u0627\u0631\u060C \u064A\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642 \u0628\u0639\u062F \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0648\u062B\u0627\u0626\u0642.",
      en: "After confirming your booking, the vehicle is prepared in advance. Upon arrival at the branch or airport terminal, handover is completed within minutes after document verification."
    }
  },
  {
    id: "faq-3",
    category: "insurance",
    question: {
      ar: "\u0645\u0627 \u0627\u0644\u0641\u0631\u0642 \u0628\u064A\u0646 \u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u060C \u0627\u0644\u0634\u0627\u0645\u0644\u060C \u0648\u0627\u0644\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0641\u0627\u0626\u0642\u0629 (\u0635\u0641\u0631 \u062A\u062D\u0645\u0644)\u061F",
      en: "What is the difference between Basic, Comprehensive, and Zero Liability protection?"
    },
    answer: {
      ar: "\u2022 \u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A: \u0645\u0634\u0645\u0648\u0644 \u0645\u062C\u0627\u0646\u0627\u064B \u0648\u064A\u063A\u0637\u064A \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u0636\u062F \u0627\u0644\u063A\u064A\u0631 \u0645\u0639 \u0646\u0633\u0628\u0629 \u062A\u062D\u0645\u0644 \u0645\u062D\u062F\u062F\u0629 \u0639\u0646\u062F \u062D\u062F\u0648\u062B \u0636\u0631\u0631.\n\u2022 \u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0634\u0627\u0645\u0644: \u064A\u062E\u0641\u0636 \u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u062D\u0645\u0644 \u0625\u0644\u0649 500 \u0631\u064A\u0627\u0644 \u0641\u0642\u0637 \u0648\u064A\u063A\u0637\u064A \u0627\u0644\u0632\u062C\u0627\u062C \u0648\u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062A.\n\u2022 \u0627\u0644\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0641\u0627\u0626\u0642\u0629: \u0625\u0639\u0641\u0627\u0621 \u0643\u0627\u0645\u0644 (0 \u0631\u064A\u0627\u0644 \u062A\u062D\u0645\u0644) \u0648\u0631\u0627\u062D\u0629 \u0628\u0627\u0644 \u062A\u0627\u0645\u0629 \u0639\u0646\u062F \u0625\u062D\u0636\u0627\u0631 \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u062D\u0627\u062F\u062B \u0627\u0644\u0631\u0633\u0645\u064A (\u0646\u062C\u0645/\u0627\u0644\u0645\u0631\u0648\u0631).",
      en: "\u2022 Basic: Included free, covers third-party liability with standard deductible on collision.\n\u2022 Comprehensive: Reduces deductible to 500 SAR and covers windshield & tire wear.\n\u2022 Zero Liability: 0 SAR deductible with complete coverage upon submitting official Najm/Police traffic report."
    }
  },
  {
    id: "faq-4",
    category: "traffic",
    question: {
      ar: "\u0643\u064A\u0641 \u064A\u062A\u0645 \u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0627\u0644\u0645\u0631\u0648\u0631\u064A\u0629 (\u0633\u0627\u0647\u0631) \u0648\u0627\u0644\u0631\u0633\u0648\u0645\u061F",
      en: "How are traffic fines (Saher) and road tolls handled?"
    },
    answer: {
      ar: "\u064A\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0639\u0642\u062F \u0627\u0644\u0625\u064A\u062C\u0627\u0631 \u0648\u062A\u0648\u062B\u064A\u0642\u0647 \u062F\u0627\u062E\u0644\u064A\u0627\u064B \u0644\u062F\u0649 \u0627\u0644\u0634\u0631\u0643\u0629 \u0628\u0627\u0644\u062A\u0632\u0627\u0645\u0646 \u0645\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0623\u062C\u0631 \u0648\u0647\u0648\u064A\u0629 \u0627\u0644\u0645\u0631\u0643\u0628\u0629. \u062A\u0633\u062C\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0627\u0644\u0645\u0631\u0648\u0631\u064A\u0629 \u0639\u0644\u0649 \u0633\u062C\u0644 \u0627\u0644\u0645\u0633\u062A\u0623\u062C\u0631 \u0643\u0645\u0627 \u062A\u0635\u062F\u0631 \u0644\u0647 \u0648\u0644\u0627 \u062A\u0636\u0627\u0641 \u0639\u0644\u064A\u0647\u0627 \u0623\u064A \u0631\u0633\u0648\u0645 \u0625\u062F\u0627\u0631\u064A\u0629.",
      en: "Rental contracts are verified and recorded internally by the company against the renter details and vehicle identity. Traffic violations are settled by the renter as issued, without any hidden administrative surcharges."
    }
  },
  {
    id: "faq-5",
    category: "booking",
    question: {
      ar: "\u0647\u0644 \u064A\u0645\u0643\u0646 \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0641\u064A \u0645\u062F\u064A\u0646\u0629 \u0648\u062A\u0633\u0644\u064A\u0645\u0647\u0627 \u0641\u064A \u0645\u062F\u064A\u0646\u0629 \u0623\u062E\u0631\u0649\u061F",
      en: "Can I pick up the vehicle in one city and drop it off in another?"
    },
    answer: {
      ar: "\u0646\u0639\u0645 \u0628\u0643\u0644 \u062A\u0623\u0643\u064A\u062F! \u062A\u062A\u064A\u062D \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629 \u062E\u062F\u0645\u0629 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u064A\u0646 \u0627\u0644\u0645\u062F\u0646 \u0648\u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A (\u0645\u062B\u0644 \u0627\u0633\u062A\u0644\u0627\u0645 \u0641\u064A \u0627\u0644\u0631\u064A\u0627\u0636 \u0648\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0641\u064A \u062C\u062F\u0629 \u0623\u0648 \u0627\u0644\u062F\u0645\u0627\u0645)\u060C \u0645\u0639 \u0627\u062D\u062A\u0633\u0627\u0628 \u0631\u0633\u0645 \u062A\u0646\u0642\u0644 \u0631\u0645\u0632\u064A \u064A\u0638\u0647\u0631 \u0628\u0648\u0636\u0648\u062D \u0641\u064A \u0645\u0644\u062E\u0635 \u0627\u0644\u062D\u062C\u0632.",
      en: "Yes absolutely! Al-Rufqah offers flexible one-way intercity rentals (e.g. pick up in Riyadh and return in Jeddah or Dammam) with transparent nominal transit fees calculated instantly at checkout."
    }
  },
  {
    id: "faq-6",
    category: "payments",
    question: {
      ar: "\u0645\u0627 \u0647\u064A \u062E\u064A\u0627\u0631\u0627\u062A \u0648\u0637\u0631\u0642 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0644\u062F\u0649 \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0642\u0629\u061F",
      en: "What payment methods are supported at Al-Rufqah Car Rental?"
    },
    answer: {
      ar: "\u0646\u0642\u0628\u0644 \u0628\u0637\u0627\u0642\u0627\u062A \u0645\u062F\u0649 (Mada) \u0648\u0641\u064A\u0632\u0627 \u0648\u0645\u0627\u0633\u062A\u0631\u0643\u0627\u0631\u062F (Visa/MasterCard) \u0639\u0628\u0631 \u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0622\u0645\u0646\u0629 (Stripe)\u060C \u0623\u0648 \u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0641\u064A \u0627\u0644\u0641\u0631\u0639\u060C \u0628\u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0644\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0646\u0642\u0627\u0637 \u0627\u0644\u0648\u0644\u0627\u0621 (\u0627\u0644\u0641\u0631\u0633\u0627\u0646 \u0648\u0642\u0637\u0627\u0641).",
      en: "We accept Mada, Visa and MasterCard through our secure payment gateway (Stripe), or pay on arrival at the branch, plus reward redemption via AlFursan & Qitaf."
    }
  }
];

// src/data/seoData.ts
var INITIAL_GLOBAL_SEO = {
  siteName: {
    ar: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0627\u0647\u0629 \u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0648\u0627\u0644\u062D\u062F\u064A\u062B\u0629",
    en: "Al-Rifaha Luxury Car Rental Saudi Arabia"
  },
  defaultTitle: {
    ar: "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0641\u062E\u0645\u0629 \u0648\u0627\u0642\u062A\u0635\u0627\u062F\u064A\u0629 \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 | \u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A \u0648\u062D\u062C\u0632 \u0641\u0648\u0631\u064A",
    en: "Luxury & Economy Car Rental in Saudi Arabia | Airport Branches"
  },
  titleSeparator: "|",
  metaDescription: {
    ar: "\u0623\u0641\u0636\u0644 \u0634\u0631\u0643\u0629 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0641\u064A \u0627\u0644\u0631\u064A\u0627\u0636\u060C \u062C\u062F\u0629\u060C \u0648\u0627\u0644\u062F\u0645\u0627\u0645. \u0623\u0633\u0637\u0648\u0644 \u0645\u0646 \u0623\u062D\u062F\u062B \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0631\u0633\u064A\u062F\u0633\u060C \u0628\u064A \u0625\u0645 \u062F\u0628\u0644\u064A\u0648\u060C \u0631\u064A\u0646\u062C \u0631\u0648\u0641\u0631 \u0648\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0642\u062A\u0635\u0627\u062F\u064A\u0629 \u0645\u0639 \u062A\u0648\u062B\u064A\u0642 \u0639\u0642\u0648\u062F \u0641\u0648\u0631\u064A\u060C \u062E\u062F\u0645\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644\u060C \u0648\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644 \u0628\u062F\u0648\u0646 \u062F\u0641\u0639\u0629 \u0623\u0648\u0644\u0649.",
    en: "Top rated car rental in Riyadh, Jeddah, Dammam & KSA airports. Book Mercedes, BMW, Range Rover & economy cars with instant internal contract verification, roadside SOS & full insurance."
  },
  canonicalBaseUrl: "",
  defaultKeywords: {
    ar: [
      "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636",
      "\u0627\u064A\u062C\u0627\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0641\u062E\u0645\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
      "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F",
      "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632",
      "\u062A\u0623\u062C\u064A\u0631 \u0645\u0631\u0633\u064A\u062F\u0633 \u0627\u0644\u0631\u064A\u0627\u0636",
      "\u062A\u0641\u0648\u064A\u0636 \u062A\u0645 \u0641\u0648\u0631\u064A",
      "\u0639\u0631\u0648\u0636 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0634\u0647\u0631\u064A\u0629",
      "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0628\u062F\u0648\u0646 \u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062A\u0645\u0627\u0646\u064A\u0629",
      "\u0627\u0631\u062E\u0635 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0628\u0627\u0644\u0631\u064A\u0627\u0636",
      "\u0627\u0634\u062A\u0631\u0627\u0643 \u0633\u064A\u0627\u0631\u0627\u062A \u0634\u0647\u0631\u064A"
    ],
    en: [
      "car rental riyadh",
      "luxury car rental saudi arabia",
      "riyadh airport car hire",
      "jeddah car rental",
      "rent mercedes riyadh",
      "digital rental contract verification",
      "monthly car subscription ksa",
      "best car rental saudi"
    ]
  },
  ogImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&h=630&q=90",
  twitterCard: "summary_large_image",
  twitterSite: "@AlRifahaRental",
  robotsIndexing: "index, follow",
  googleSiteVerification: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  geoRegion: "SA-01",
  geoPlacename: "Riyadh, Kingdom of Saudi Arabia",
  geoPosition: "24.7136;46.6753",
  icbm: "24.7136, 46.6753"
};
var INITIAL_PAGE_SEO_CONFIGS = [
  {
    id: "home",
    name: { ar: "\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", en: "Homepage" },
    title: {
      ar: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0627\u0647\u0629 \u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A | \u062D\u062C\u0632 \u0633\u064A\u0627\u0631\u0627\u062A \u0641\u062E\u0645\u0629 \u0648\u0627\u0642\u062A\u0635\u0627\u062F\u064A\u0629 \u0628\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
      en: "Al-Rifaha Car Rental | Premium & Fleet Rentals in Saudi Arabia"
    },
    description: {
      ar: "\u0627\u062D\u062C\u0632 \u0633\u064A\u0627\u0631\u062A\u0643 \u0627\u0644\u0622\u0646 \u0645\u0639 \u0627\u0644\u0631\u0641\u0642\u0629 \u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A. \u0623\u0641\u0636\u0644 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u064A\u0648\u0645\u064A \u0648\u0627\u0644\u0634\u0647\u0631\u064A \u0628\u0627\u0644\u0631\u064A\u0627\u0636 \u0648\u062C\u062F\u0629 \u0648\u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A. \u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u0639\u0642\u0648\u062F \u0627\u0644\u0641\u0648\u0631\u064A \u0648\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644.",
      en: "Book your luxury or economy rental in Saudi Arabia. Best daily & monthly rates in Riyadh, Jeddah airports with instant contract verification."
    },
    keywords: {
      ar: ["\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636", "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0637\u0627\u0631", "\u062D\u062C\u0632 \u0633\u064A\u0627\u0631\u0629 \u0627\u0648\u0646\u0644\u0627\u064A\u0646", "\u0627\u064A\u062C\u0627\u0631 \u064A\u0648\u0645\u064A \u0648\u0634\u0647\u0631\u064A"],
      en: ["car rental saudi", "riyadh airport rental", "luxury cars hire"]
    },
    canonicalSlug: "/",
    priority: 1,
    changeFreq: "daily",
    schemaType: "AutoRental",
    isIndexed: true
  },
  {
    id: "fleet",
    name: { ar: "\u0623\u0633\u0637\u0648\u0644 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A", en: "Fleet Catalog" },
    title: {
      ar: "\u0623\u0633\u0637\u0648\u0644 \u0633\u064A\u0627\u0631\u0627\u062A \u0644\u0644\u0625\u064A\u062C\u0627\u0631 | \u0633\u064A\u0627\u0631\u0627\u062A \u0641\u0627\u0631\u0647\u0629\u060C \u0633\u064A\u062F\u0627\u0646\u060C \u062F\u0641\u0639 \u0631\u0628\u0627\u0639\u064A SUV \u0628\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
      en: "Fleet of Luxury, SUV & Economy Rental Cars | Al-Rifaha"
    },
    description: {
      ar: "\u0627\u0633\u062A\u0643\u0634\u0641 \u0623\u0633\u0637\u0648\u0644 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u0641\u0627\u0647\u0629: \u0645\u0631\u0633\u064A\u062F\u0633 S-Class\u060C \u0645\u0627\u064A\u0628\u0627\u062E\u060C \u0631\u064A\u0646\u062C \u0631\u0648\u0641\u0631\u060C \u0644\u0627\u0646\u062F \u0643\u0631\u0648\u0632\u0631\u060C \u062A\u0648\u0633\u0627\u0646 \u0648\u0643\u0627\u0645\u0631\u064A \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u0639 \u0639\u062F\u0627\u062F \u0643\u064A\u0644\u0648\u0645\u062A\u0631\u0627\u062A \u0645\u062C\u0627\u0646\u064A.",
      en: "Explore our vehicle fleet: Mercedes S-Class, Maybach, Range Rover, Land Cruiser, Camry & more. Guaranteed availability & transparent pricing."
    },
    keywords: {
      ar: ["\u0627\u0633\u0637\u0648\u0644 \u0633\u064A\u0627\u0631\u0627\u062A", "\u0627\u064A\u062C\u0627\u0631 \u0645\u0631\u0633\u064A\u062F\u0633 \u0627\u0633 \u0643\u0644\u0627\u0633", "\u062A\u0627\u062C\u064A\u0631 \u062C\u064A\u0628 \u0631\u064A\u0646\u062C \u0631\u0648\u0641\u0631", "\u0627\u064A\u062C\u0627\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0639\u0627\u0626\u0644\u064A\u0629"],
      en: ["fleet car rental", "rent mercedes s class", "suv rental riyadh"]
    },
    canonicalSlug: "/fleet",
    priority: 0.9,
    changeFreq: "daily",
    schemaType: "Product",
    isIndexed: true
  },
  {
    id: "branches",
    name: { ar: "\u0627\u0644\u0641\u0631\u0648\u0639 \u0648\u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A", en: "Branches & Airports" },
    title: {
      ar: "\u0641\u0631\u0648\u0639 \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0641\u064A \u0645\u0637\u0627\u0631\u0627\u062A \u0648\u0645\u062F\u0646 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 | \u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u0637\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u0645\u062F\u0646",
      en: "Car Rental Branches across Saudi Airports & Major Cities | Al-Rifaha"
    },
    description: {
      ar: "\u0641\u0631\u0648\u0639\u0646\u0627 \u0641\u064A \u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F \u0628\u0627\u0644\u0631\u064A\u0627\u0636\u060C \u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0639\u0628\u062F\u0627\u0644\u0639\u0632\u064A\u0632 \u0628\u062C\u062F\u0629\u060C \u0648\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F \u0628\u0627\u0644\u062F\u0645\u0627\u0645. \u062E\u062F\u0645\u0629 24 \u0633\u0627\u0639\u0629 \u0648\u0635\u0627\u0644\u0627\u062A \u0627\u0646\u062A\u0638\u0627\u0631 \u0645\u0631\u064A\u062D\u0629.",
      en: "Find our branches at King Khalid Airport Riyadh, King Abdulaziz Airport Jeddah, King Fahd Dammam. 24/7 service with comfortable lounges."
    },
    keywords: {
      ar: ["\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0637\u0627\u0631 \u0627\u0644\u0631\u064A\u0627\u0636", "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0637\u0627\u0631 \u062C\u062F\u0629 \u0635\u0627\u0644\u0629 1", "\u0641\u0631\u0648\u0639 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A 24 \u0633\u0627\u0639\u0629"],
      en: ["riyadh airport rental terminal 5", "jeddah airport car rental"]
    },
    canonicalSlug: "/branches",
    priority: 0.9,
    changeFreq: "weekly",
    schemaType: "LocalBusiness",
    isIndexed: true
  },
  {
    id: "offers",
    name: { ar: "\u0627\u0644\u0639\u0631\u0648\u0636 \u0648\u0627\u0644\u062A\u062E\u0641\u064A\u0636\u0627\u062A", en: "Promotions & Offers" },
    title: {
      ar: "\u0639\u0631\u0648\u0636 \u0648\u0643\u0648\u0628\u0648\u0646\u0627\u062A \u062E\u0635\u0645 \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A | \u062E\u0635\u0648\u0645\u0627\u062A \u062A\u0635\u0644 30% \u0645\u0639 \u0627\u0644\u0631\u0641\u0627\u0647\u0629",
      en: "Exclusive Car Rental Offers & Promo Codes | Al-Rifaha"
    },
    description: {
      ar: "\u0623\u0642\u0648\u0649 \u0639\u0631\u0648\u0636 \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629. \u062E\u0635\u0648\u0645\u0627\u062A \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u060C \u0639\u0631\u0648\u0636 \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0648\u0637\u0646\u064A\u060C \u0648\u0643\u0648\u0628\u0648\u0646\u0627\u062A \u062D\u0635\u0631\u064A\u0629 \u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u0628\u0643\u0631 \u0648\u0627\u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0634\u0647\u0631\u064A.",
      en: "Discover special weekend deals, monthly discounts and promo codes for luxury and economy rentals across Saudi Arabia."
    },
    keywords: {
      ar: ["\u0639\u0631\u0648\u0636 \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A", "\u0643\u0648\u0628\u0648\u0646 \u062E\u0635\u0645 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A", "\u0643\u0648\u062F \u062E\u0635\u0645 \u0627\u0644\u0631\u0641\u0627\u0647\u0629", "\u062A\u062E\u0641\u064A\u0636\u0627\u062A \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0648\u0637\u0646\u064A"],
      en: ["car rental discounts", "promo codes car rental saudi"]
    },
    canonicalSlug: "/offers",
    priority: 0.8,
    changeFreq: "daily",
    schemaType: "Product",
    isIndexed: true
  },
  {
    id: "corporate",
    name: { ar: "\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0634\u0631\u0643\u0627\u062A B2B", en: "Corporate Fleet" },
    title: {
      ar: "\u062D\u0644\u0648\u0644 \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0644\u0644\u0634\u0631\u0643\u0627\u062A \u0648\u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062A | \u0639\u0642\u0648\u062F \u0637\u0648\u064A\u0644\u0629 \u0627\u0644\u0623\u062C\u0644 \u0648\u0623\u0633\u0637\u0648\u0644 \u0645\u062E\u0635\u0635",
      en: "Corporate Fleet Leasing & Business Rentals in Saudi Arabia"
    },
    description: {
      ar: "\u062D\u0644\u0648\u0644 \u0630\u0643\u064A\u0629 \u0644\u0623\u0633\u0637\u0648\u0644 \u0627\u0644\u0634\u0631\u0643\u0627\u062A \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629. \u0639\u0642\u0648\u062F \u062A\u0634\u063A\u064A\u0644\u064A\u0629 \u0637\u0648\u064A\u0644\u0629 \u0627\u0644\u0623\u062C\u0644\u060C \u0635\u064A\u0627\u0646\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u0634\u0627\u0645\u0644\u0629\u060C \u0633\u064A\u0627\u0631\u0627\u062A \u0628\u062F\u064A\u0644\u0629 \u0641\u0648\u0631\u064A\u0629 \u0648\u0641\u0648\u0627\u062A\u064A\u0631 \u0625\u064A\u062C\u0627\u0631 \u0645\u0639\u062A\u0645\u062F\u0629.",
      en: "Tailored B2B corporate leasing solutions, operational fleet management, dedicated account managers & verified rental invoicing."
    },
    keywords: {
      ar: ["\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0644\u0644\u0634\u0631\u0643\u0627\u062A", "\u0639\u0642\u0648\u062F \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0637\u0648\u064A\u0644\u0629 \u0627\u0644\u0623\u062C\u0644", "\u0623\u0633\u0637\u0648\u0644 \u0634\u0631\u0643\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636", "\u062A\u0627\u062C\u064A\u0631 \u062A\u0634\u063A\u064A\u0644\u064A"],
      en: ["corporate car leasing", "b2b fleet rental riyadh"]
    },
    canonicalSlug: "/corporate",
    priority: 0.8,
    changeFreq: "weekly",
    schemaType: "LocalBusiness",
    isIndexed: true
  },
  {
    id: "subscription",
    name: { ar: "\u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A\u0629", en: "Monthly Subscription" },
    title: {
      ar: "\u0627\u0634\u062A\u0631\u0627\u0643 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 | \u0628\u062F\u064A\u0644 \u0634\u0631\u0627\u0621 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0628\u062F\u0648\u0646 \u0627\u0644\u062A\u0632\u0627\u0645\u0627\u062A",
      en: "Monthly Car Subscription in KSA | Drive Without Ownership Hassles"
    },
    description: {
      ar: "\u0627\u0634\u062A\u0631\u0643 \u0634\u0647\u0631\u064A\u0627\u064B \u0641\u064A \u0633\u064A\u0627\u0631\u062A\u0643 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u0628\u062F\u0648\u0646 \u062F\u0641\u0639\u0629 \u0623\u0648\u0644\u0649 \u0623\u0648 \u0627\u0644\u062A\u0632\u0627\u0645\u0627\u062A \u0628\u0646\u0643\u064A\u0629. \u064A\u0634\u0645\u0644 \u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0634\u0627\u0645\u0644\u060C \u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u062F\u0648\u0631\u064A\u0629 \u0648\u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0643\u0644 \u0634\u0647\u0631.",
      en: "Flexible monthly all-inclusive car subscriptions. Insurance, maintenance & roadside assistance included with easy swap options."
    },
    keywords: {
      ar: ["\u0627\u0634\u062A\u0631\u0627\u0643 \u0633\u064A\u0627\u0631\u0629 \u0634\u0647\u0631\u064A", "\u062A\u0627\u062C\u064A\u0631 \u0634\u0647\u0631\u064A \u0628\u062F\u0648\u0646 \u062F\u0641\u0639\u0629 \u0627\u0648\u0644\u0649", "\u0628\u062F\u064A\u0644 \u0634\u0631\u0627\u0621 \u0633\u064A\u0627\u0631\u0629"],
      en: ["monthly car subscription", "car lease by month saudi"]
    },
    canonicalSlug: "/subscription",
    priority: 0.8,
    changeFreq: "weekly",
    schemaType: "Product",
    isIndexed: true
  },
  {
    id: "used-cars",
    name: { ar: "\u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0644\u0644\u0628\u064A\u0639", en: "Certified Pre-Owned" },
    title: {
      ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0633\u062A\u0639\u0645\u0644\u0629 \u0645\u0636\u0645\u0648\u0646\u0629 \u0648\u0645\u0641\u062D\u0648\u0635\u0629 \u0644\u0644\u0628\u064A\u0639 | \u0623\u0633\u0637\u0648\u0644 \u0627\u0644\u0631\u0641\u0627\u0647\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u0628\u0627\u0644\u0636\u0645\u0627\u0646",
      en: "Certified Pre-Owned Luxury Cars for Sale with Warranty | Al-Rifaha"
    },
    description: {
      ar: "\u0634\u0631\u0627\u0621 \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0633\u062A\u0639\u0645\u0644\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 \u0645\u0641\u062D\u0648\u0635\u0629 \u0628\u0640 150 \u0646\u0642\u0637\u0629 \u0641\u062D\u0635 \u0641\u0646\u064A \u0645\u0639 \u0636\u0645\u0627\u0646 \u0633\u0627\u0631\u064A \u0648\u062A\u0642\u0627\u0631\u064A\u0631 \u0635\u064A\u0627\u0646\u0629 \u062F\u0648\u0631\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0648\u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u062A\u0642\u0633\u064A\u0637 \u0627\u0644\u0645\u064A\u0633\u0631.",
      en: "Buy inspected pre-owned certified vehicles with warranty, full maintenance records and easy installment financing."
    },
    keywords: {
      ar: ["\u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0633\u062A\u0639\u0645\u0644\u0629 \u0645\u0636\u0645\u0648\u0646\u0629", "\u0634\u0631\u0627\u0621 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0633\u0637\u0648\u0644 \u0627\u0644\u062A\u0627\u062C\u064A\u0631", "\u0633\u064A\u0627\u0631\u0627\u062A \u0641\u062D\u0635 \u0634\u0627\u0645\u0644 \u0627\u0644\u0631\u064A\u0627\u0636"],
      en: ["used cars certified riyadh", "pre owned luxury cars ksa"]
    },
    canonicalSlug: "/used-cars",
    priority: 0.7,
    changeFreq: "weekly",
    schemaType: "Product",
    isIndexed: true
  },
  {
    id: "loyalty",
    name: { ar: "\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u0648\u0644\u0627\u0621 \u0648\u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A", en: "Loyalty Rewards" },
    title: {
      ar: "\u0628\u0631\u0646\u0627\u0645\u062C \u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u0631\u0641\u0627\u0647\u0629 | \u062A\u0631\u0642\u064A\u0627\u062A \u0645\u062C\u0627\u0646\u064A\u0629 \u0648\u0623\u064A\u0627\u0645 \u062A\u0623\u062C\u064A\u0631 \u0647\u062F\u064A\u0629 \u0648\u0646\u0642\u0627\u0637 \u0645\u0636\u0627\u0639\u0641\u0629",
      en: "Al-Rifaha Rewards & Loyalty Club | VIP Upgrades & Free Rental Days"
    },
    description: {
      ar: "\u0627\u0646\u0636\u0645 \u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u0631\u0641\u0627\u0647\u0629 \u0648\u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u0646\u0642\u0627\u0637 \u0645\u0639 \u0643\u0644 \u0631\u064A\u0627\u0644 \u062A\u0646\u0641\u0642\u0647. \u0627\u0633\u062A\u0628\u062F\u0644 \u0627\u0644\u0646\u0642\u0627\u0637 \u0628\u0623\u064A\u0627\u0645 \u0645\u062C\u0627\u0646\u064A\u0629\u060C \u062A\u0631\u0642\u064A\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u0644\u0641\u0626\u0629 \u0623\u0639\u0644\u0649 \u0648\u062E\u062F\u0645\u0629 \u0627\u0633\u062A\u0644\u0627\u0645 VIP \u0628\u0627\u0644\u0645\u0637\u0627\u0631.",
      en: "Earn points on every rental. Redeem points for free rental days, complimentary vehicle upgrades and priority VIP airport service."
    },
    keywords: {
      ar: ["\u0628\u0631\u0646\u0627\u0645\u062C \u0648\u0644\u0627\u0621 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A", "\u0646\u0642\u0627\u0637 \u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u0631\u0641\u0627\u0647\u0629", "\u062A\u0631\u0642\u064A\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u0644\u0644\u0633\u064A\u0627\u0631\u0629"],
      en: ["car rental loyalty rewards", "vip rental upgrades ksa"]
    },
    canonicalSlug: "/loyalty",
    priority: 0.7,
    changeFreq: "monthly",
    schemaType: "LocalBusiness",
    isIndexed: true
  },
  {
    id: "blog",
    name: { ar: "\u0627\u0644\u0645\u062F\u0648\u0646\u0629 \u0648\u062F\u0644\u064A\u0644 \u0627\u0644\u0637\u0631\u0642", en: "Blog & Travel Guides" },
    title: {
      ar: "\u062F\u0644\u064A\u0644 \u0627\u0644\u0642\u064A\u0627\u062F\u0629 \u0648\u0627\u0644\u0633\u064A\u0627\u062D\u0629 \u0628\u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 | \u0646\u0635\u0627\u0626\u062D \u0627\u0644\u0637\u0631\u0642 \u0648\u0623\u062D\u062F\u062B \u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A",
      en: "Saudi Driving & Road Trip Guides | Automotive News & Tips"
    },
    description: {
      ar: "\u0645\u0642\u0627\u0644\u0627\u062A \u0648\u0623\u062F\u0644\u0629 \u0633\u064A\u0627\u062D\u064A\u0629 \u0634\u0627\u0645\u0644\u0629 \u0644\u0644\u0642\u064A\u0627\u062F\u0629 \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629: \u0623\u0641\u0636\u0644 \u0645\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u0629 \u0628\u0627\u0644\u0639\u0644\u0627 \u0648\u0623\u0628\u0647\u0627\u060C \u0644\u0648\u0627\u0626\u062D \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0633\u0627\u0647\u0631\u060C \u0648\u0645\u0642\u0627\u0631\u0646\u0627\u062A \u0623\u062D\u062F\u062B \u0633\u064A\u0627\u0631\u0627\u062A.",
      en: "Comprehensive Saudi road trip guides, scenic highway routes, driving regulations, traffic safety tips and automotive reviews."
    },
    keywords: {
      ar: ["\u062F\u0644\u064A\u0644 \u0627\u0644\u0642\u064A\u0627\u062F\u0629 \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", "\u0631\u062D\u0644\u0627\u062A \u0628\u0631\u064A\u0629 \u0627\u0644\u0639\u0644\u0627 \u0648\u0627\u0628\u0647\u0627", "\u0644\u0648\u0627\u0626\u062D \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0633\u0627\u0647\u0631", "\u0646\u0635\u0627\u0626\u062D \u0627\u0633\u062A\u0626\u062C\u0627\u0631 \u0633\u064A\u0627\u0631\u0629"],
      en: ["saudi road trip guides", "driving in saudi arabia tips"]
    },
    canonicalSlug: "/blog",
    priority: 0.8,
    changeFreq: "weekly",
    schemaType: "Article",
    isIndexed: true
  },
  {
    id: "faq",
    name: { ar: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629", en: "FAQ & Help" },
    title: {
      ar: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629 \u062D\u0648\u0644 \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0628\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 | \u0634\u0631\u0648\u0637 \u0627\u0644\u062A\u0623\u062C\u064A\u0631 \u0648\u062A\u0641\u0648\u064A\u0636 \u062A\u0645 \u0648\u0627\u0644\u062A\u0623\u0645\u064A\u0646",
      en: "Frequently Asked Questions about Car Rental in Saudi Arabia"
    },
    description: {
      ar: "\u0625\u062C\u0627\u0628\u0627\u062A \u0634\u0627\u0645\u0644\u0629 \u0639\u0646 \u0643\u0627\u0641\u0629 \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A: \u0634\u0631\u0648\u0637 \u0627\u0633\u062A\u0626\u062C\u0627\u0631 \u0633\u064A\u0627\u0631\u0629 \u0644\u0644\u0645\u0648\u0627\u0637\u0646 \u0648\u0627\u0644\u0645\u0642\u064A\u0645 \u0648\u0627\u0644\u0632\u0627\u0626\u0631\u060C \u062A\u0648\u062B\u064A\u0642 \u0639\u0642\u0648\u062F \u0627\u0644\u0625\u064A\u062C\u0627\u0631\u060C \u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0648\u0627\u0644\u0648\u062F\u0627\u0626\u0639 \u0648\u0637\u0631\u0642 \u0627\u0644\u062F\u0641\u0639.",
      en: "Clear answers on rental requirements, rental contract verification, zero-deductible insurance policies, driver license validity and payments."
    },
    keywords: {
      ar: ["\u0634\u0631\u0648\u0637 \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0628\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", "\u062A\u0648\u062B\u064A\u0642 \u0639\u0642\u0648\u062F \u0627\u0644\u0625\u064A\u062C\u0627\u0631 \u0644\u0644\u0645\u0642\u064A\u0645\u064A\u0646", "\u062A\u0627\u0645\u064A\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0623\u062C\u0631\u0629"],
      en: ["car rental requirements ksa", "rental contract permit questions"]
    },
    canonicalSlug: "/faq",
    priority: 0.8,
    changeFreq: "monthly",
    schemaType: "FAQPage",
    isIndexed: true
  },
  {
    id: "contact",
    name: { ar: "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627 \u0648\u0627\u0644\u062F\u0639\u0645", en: "Contact & Support" },
    title: {
      ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0627\u0647\u0629 | \u062E\u062F\u0645\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 24/7 \u0648\u0637\u0648\u0627\u0631\u0626 \u0627\u0644\u0637\u0631\u064A\u0642 SOS",
      en: "Contact Al-Rifaha Car Rental | 24/7 Customer Support & Roadside SOS"
    },
    description: {
      ar: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0645\u0648\u062D\u062F \u0648\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0637\u0631\u064A\u0642 24/7. \u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628\u060C \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u062C\u0627\u0646\u064A\u060C \u0623\u0648 \u062A\u0641\u0636\u0644 \u0628\u0632\u064A\u0627\u0631\u0629 \u0623\u0642\u0631\u0628 \u0641\u0631\u0639 \u0641\u064A \u0645\u062F\u064A\u0646\u062A\u0643.",
      en: "24/7 unified support center & roadside assistance. Reach our support team via WhatsApp, toll-free number or visit our nearest branch."
    },
    keywords: {
      ar: ["\u0631\u0642\u0645 \u0634\u0631\u0643\u0629 \u0627\u0644\u0631\u0641\u0627\u0647\u0629 \u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A", "\u0637\u0648\u0627\u0631\u0626 \u0627\u0644\u0637\u0631\u064A\u0642 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A", "\u062E\u062F\u0645\u0629 \u0639\u0645\u0644\u0627\u0621 \u062A\u0627\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A"],
      en: ["car rental customer service riyadh", "roadside support ksa"]
    },
    canonicalSlug: "/contact",
    priority: 0.7,
    changeFreq: "monthly",
    schemaType: "LocalBusiness",
    isIndexed: true
  }
];
var INITIAL_SCHEMA_CONFIG = {
  enableAutoRentalSchema: true,
  enableFaqSchema: true,
  enableBreadcrumbSchema: true,
  enableCarProductsSchema: true,
  companyLegalName: {
    ar: "\u0634\u0631\u0643\u0629 \u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0631\u0641\u0627\u0647\u0629 \u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u062D\u062F\u0648\u062F\u0629",
    en: "Al-Rifaha Car Rental Company Ltd."
  },
  telephone: "+9668001248899",
  email: "",
  priceRange: "$$$ (120 SAR - 2,500 SAR)",
  currenciesAccepted: "SAR",
  paymentAccepted: "Cash, Credit Card, Mada (Stripe)",
  ratingValue: 4.9,
  reviewCount: 4850,
  streetAddress: {
    ar: "\u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F\u060C \u062D\u064A \u0627\u0644\u0635\u062D\u0627\u0641\u0629",
    en: "King Fahd Road, Al Sahafah District"
  },
  addressLocality: {
    ar: "\u0627\u0644\u0631\u064A\u0627\u0636",
    en: "Riyadh"
  },
  postalCode: "13315",
  addressCountry: "SA"
};
var INITIAL_ROBOTS_CONFIG = {
  customRobotsTxt: `# robots.txt for Al-Rifaha Car Rental KSA
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /manage-booking/

# Googlebot specific directives
User-agent: Googlebot
Allow: /
Allow: /fleet/
Allow: /branches/
Allow: /offers/
Allow: /blog/
Crawl-delay: 1

# Bingbot
User-agent: Bingbot
Allow: /
Crawl-delay: 2

Sitemap: /sitemap.xml
`,
  disallowAdmin: true,
  disallowApi: true,
  crawlDelay: 1,
  sitemapUrl: "/sitemap.xml"
};
var INITIAL_KEYWORD_RANKINGS = [
  {
    id: "kw-1",
    keyword: "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636",
    city: "\u0627\u0644\u0631\u064A\u0627\u0636",
    monthlyVolume: 74e3,
    currentRank: 1,
    previousRank: 2,
    serpFeatures: ["rich_snippet", "maps_pack", "sitelinks", "star_ratings"],
    difficulty: "hard",
    targetUrl: "/"
  },
  {
    id: "kw-2",
    keyword: "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0641\u062E\u0645\u0629 \u0627\u0644\u0631\u064A\u0627\u0636",
    city: "\u0627\u0644\u0631\u064A\u0627\u0636",
    monthlyVolume: 28500,
    currentRank: 1,
    previousRank: 1,
    serpFeatures: ["rich_snippet", "star_ratings", "images_pack"],
    difficulty: "medium",
    targetUrl: "/fleet"
  },
  {
    id: "kw-3",
    keyword: "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u062E\u0627\u0644\u062F",
    city: "\u0627\u0644\u0631\u064A\u0627\u0636 (\u0627\u0644\u0645\u0637\u0627\u0631)",
    monthlyVolume: 49e3,
    currentRank: 2,
    previousRank: 3,
    serpFeatures: ["maps_pack", "rich_snippet", "sitelinks"],
    difficulty: "hard",
    targetUrl: "/branches"
  },
  {
    id: "kw-4",
    keyword: "\u0627\u064A\u062C\u0627\u0631 \u0645\u0631\u0633\u064A\u062F\u0633 \u0628\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    city: "\u0643\u0627\u0641\u0629 \u0627\u0644\u0645\u062F\u0646",
    monthlyVolume: 19800,
    currentRank: 1,
    previousRank: 2,
    serpFeatures: ["rich_snippet", "images_pack"],
    difficulty: "medium",
    targetUrl: "/fleet"
  },
  {
    id: "kw-5",
    keyword: "\u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0637\u0627\u0631 \u062C\u062F\u0629 \u0635\u0627\u0644\u0629 1",
    city: "\u062C\u062F\u0629",
    monthlyVolume: 33e3,
    currentRank: 2,
    previousRank: 2,
    serpFeatures: ["maps_pack", "rich_snippet"],
    difficulty: "hard",
    targetUrl: "/branches"
  },
  {
    id: "kw-6",
    keyword: "\u062A\u0641\u0648\u064A\u0636 \u062A\u0645 \u0641\u0648\u0631\u064A \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A",
    city: "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    monthlyVolume: 14500,
    currentRank: 1,
    previousRank: 1,
    serpFeatures: ["rich_snippet", "faq_dropdown"],
    difficulty: "easy",
    targetUrl: "/faq"
  },
  {
    id: "kw-7",
    keyword: "\u0627\u0634\u062A\u0631\u0627\u0643 \u0633\u064A\u0627\u0631\u0629 \u0634\u0647\u0631\u064A \u0627\u0644\u0631\u064A\u0627\u0636",
    city: "\u0627\u0644\u0631\u064A\u0627\u0636",
    monthlyVolume: 12200,
    currentRank: 3,
    previousRank: 4,
    serpFeatures: ["rich_snippet", "sitelinks"],
    difficulty: "medium",
    targetUrl: "/subscription"
  },
  {
    id: "kw-8",
    keyword: "\u0639\u0631\u0648\u0636 \u062A\u0623\u062C\u064A\u0631 \u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0648\u0637\u0646\u064A",
    city: "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    monthlyVolume: 56e3,
    currentRank: 1,
    previousRank: 1,
    serpFeatures: ["rich_snippet", "star_ratings"],
    difficulty: "hard",
    targetUrl: "/offers"
  }
];

// server.ts
(0, import_dotenv.config)();
var PORT = Number(process.env.PORT || 3e3);
var isProd = process.env.NODE_ENV === "production";
var JWT_SECRET = process.env.AUTH_SECRET || (isProd ? "" : "dev-only-change-me");
if (isProd && JWT_SECRET.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters in production");
var STRIPE_API = "https://api.stripe.com/v1";
async function createStripeCheckoutSession(booking) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return { ok: false, status: 501, error: "Stripe is not configured" };
  const amount = Math.round(Number(booking?.payment?.totalAmount || 0) * 100);
  if (amount <= 0) return { ok: false, status: 400, error: "No amount to charge" };
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("locale", "auto");
  body.set("client_reference_id", String(booking.bookingId || ""));
  body.set("customer_email", String(booking.customer?.email || ""));
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "sar");
  body.set("line_items[0][price_data][unit_amount]", String(amount));
  body.set("line_items[0][price_data][product_data][name]", `Al-Rufqah Rental | ${booking.bookingId}`);
  body.set("success_url", `${appUrl}/manage-booking?booking=${encodeURIComponent(booking.bookingId)}`);
  body.set("cancel_url", `${appUrl}/`);
  try {
    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, status: res.status, error: data?.error?.message || `Stripe error (${res.status})` };
    return { ok: true, reference: String(data.id), data: { checkoutUrl: data.url, sessionId: data.id } };
  } catch {
    return { ok: false, status: 502, error: "Stripe is unreachable" };
  }
}
function verifyStripeWebhookSignature(raw, signature) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const parts = {};
  for (const piece of String(signature).split(",")) {
    const idx = piece.indexOf("=");
    if (idx > 0) parts[piece.slice(0, idx)] = piece.slice(idx + 1);
  }
  if (!parts.t || !parts.v1) return false;
  const expected = import_node_crypto2.default.createHmac("sha256", secret).update(`${parts.t}.${raw}`).digest();
  const given = Buffer.from(parts.v1, "hex");
  const matches = given.length === expected.length && import_node_crypto2.default.timingSafeEqual(given, expected);
  const ageSec = Math.abs(Math.floor(Date.now() / 1e3) - Number(parts.t));
  return matches && ageSec <= 300;
}
var app = (0, import_express.default)();
var runtimeDb = null;
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((req, res, next) => {
  const requestId = String(req.headers["x-request-id"] || import_node_crypto2.default.randomUUID()).slice(0, 100);
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
});
app.use(import_express.default.json({ limit: "1mb", verify: (req, _res, buf) => {
  req.rawBody = buf.toString("utf8");
} }));
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
  const origin = process.env.APP_URL;
  if (origin && req.headers.origin === origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  if (isProd) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Content-Security-Policy", "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline'; connect-src 'self' https:;");
  }
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.sendStatus(204);
  }
  next();
});
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.headers.cookie?.includes("alrufqah_session=") && process.env.APP_URL) {
    const origin = req.headers.origin;
    if (origin && origin !== process.env.APP_URL) return res.status(403).json({ error: "Cross-site request blocked" });
  }
  next();
});
function rateLimit(limit, windowMs) {
  return async (req, res, next) => {
    try {
      const key = `${req.ip}:${req.method}:${req.path}`;
      if (!runtimeDb) return next();
      const result = await runtimeDb.consumeRateLimit(key, limit, windowMs);
      if (!result.allowed) {
        res.setHeader("Retry-After", Math.max(1, Math.ceil(result.retryAfterMs / 1e3)));
        return res.status(429).json({ error: "Too many requests. Please try again later." });
      }
      next();
    } catch {
      return res.status(503).json({ error: "Rate limiting service unavailable" });
    }
  };
}
function hashSessionToken(token) {
  return import_node_crypto2.default.createHash("sha256").update(token).digest("hex");
}
function createSessionToken() {
  return import_node_crypto2.default.randomBytes(32).toString("base64url");
}
function getBearer(req) {
  const h = req.headers.authorization;
  return h?.startsWith("Bearer ") ? h.slice(7) : void 0;
}
function auth(required = true) {
  return async (req, res, next) => {
    try {
      const token = getBearer(req) || req.headers.cookie?.match(/(?:^|; )alrufqah_session=([^;]+)/)?.[1];
      if (!token || !runtimeDb) {
        if (required) return res.status(401).json({ error: "Authentication required" });
        req.user = null;
        return next();
      }
      const session = await runtimeDb.getSession(hashSessionToken(token));
      if (!session) {
        if (required) return res.status(401).json({ error: "Authentication required" });
        req.user = null;
        return next();
      }
      const fresh = (await runtimeDb.users()).find((u) => u.id === session.userId && u.isActive);
      if (!fresh) {
        await runtimeDb.revokeSession(hashSessionToken(token));
        if (required) return res.status(401).json({ error: "Authentication required" });
        req.user = null;
        return next();
      }
      req.user = { sub: fresh.id, role: fresh.role, email: fresh.email, branchId: fresh.branchId };
      next();
    } catch (e) {
      if (required) return res.status(401).json({ error: "Authentication required" });
      req.user = null;
      next();
    }
  };
}
function role(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) return res.status(403).json({ error: "Insufficient permissions" });
    next();
  };
}
function cleanString(v, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function id() {
  return import_node_crypto2.default.randomUUID();
}
function bookingRef() {
  return `RUF-${import_node_crypto2.default.randomInt(1e4, 99999)}`;
}
function safeUser(u) {
  const { passwordHash, googleId, ...safe } = u;
  return safe;
}
function parseCookies(req) {
  const raw = String(req.headers.cookie || "");
  return Object.fromEntries(raw.split(";").map((x) => x.trim()).filter(Boolean).map((x) => {
    const i = x.indexOf("=");
    return [i < 0 ? x : x.slice(0, i), i < 0 ? "" : decodeURIComponent(x.slice(i + 1))];
  }));
}
function setCookie(res, name, value, maxAge, options = { httpOnly: true, sameSite: "Lax", path: "/" }) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Max-Age=${Math.floor(maxAge / 1e3)}`, `Path=${options.path || "/"}`, `SameSite=${options.sameSite || "Lax"}`];
  if (options.httpOnly) parts.push("HttpOnly");
  if (isProd) parts.push("Secure");
  res.append("Set-Cookie", parts.join("; "));
}
function clearCookie(res, name) {
  res.append("Set-Cookie", `${name}=; Max-Age=0; Path=/; SameSite=Lax${isProd ? "; Secure" : ""}${name === "alrufqah_session" ? "; HttpOnly" : ""}`);
}
function googleConfig() {
  return { clientId: String(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || ""), clientSecret: String(process.env.GOOGLE_CLIENT_SECRET || ""), redirectUri: String(process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL || `http://localhost:${PORT}`}/api/auth/google/callback`) };
}
function secretKey() {
  return import_node_crypto2.default.createHash("sha256").update(JWT_SECRET || "dev-only-change-me").digest();
}
function encryptSecret(value) {
  const iv = import_node_crypto2.default.randomBytes(12);
  const cipher = import_node_crypto2.default.createCipheriv("aes-256-gcm", secretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `enc:${iv.toString("base64url")}:${cipher.getAuthTag().toString("base64url")}:${encrypted.toString("base64url")}`;
}
function decryptSecret(value) {
  if (!value) return "";
  if (!value.startsWith("enc:")) return value;
  try {
    const [, iv, tag, data] = value.split(":");
    const decipher = import_node_crypto2.default.createDecipheriv("aes-256-gcm", secretKey(), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = import_node_crypto2.default.randomBytes(16);
    import_node_crypto2.default.scrypt(password, salt, 64, (err, key) => err ? reject(err) : resolve(`scrypt$${salt.toString("hex")}$${Buffer.from(key).toString("hex")}`));
  });
}
function verifyPassword(password, encoded) {
  return new Promise((resolve, reject) => {
    const [kind, saltHex, keyHex] = String(encoded || "").split("$");
    if (kind !== "scrypt" || !saltHex || !keyHex) return resolve(false);
    import_node_crypto2.default.scrypt(password, Buffer.from(saltHex, "hex"), 64, (err, key) => {
      if (err) return reject(err);
      const a = Buffer.from(keyHex, "hex"), b = Buffer.from(key);
      resolve(a.length === b.length && import_node_crypto2.default.timingSafeEqual(a, b));
    });
  });
}
function sanitizeCar(body, existing) {
  const allowed = ["name", "brand", "category", "image", "dailyPrice", "weeklyPrice", "monthlyPrice", "seats", "luggage", "doors", "transmission", "fuelType", "engineCapacity", "features", "isPopular", "isSpecialOffer", "discountPercentage", "availableQuantity", "minDriverAge", "depositRequired", "includedMileagePerDay", "status", "plateNumber", "modelYear", "currentBranchId", "currentOdometer"];
  const out = { ...existing || {} };
  for (const k of allowed) if (body?.[k] !== void 0) out[k] = body[k];
  return out;
}
function sanitizeBranch(body, existing) {
  const allowed = ["name", "city", "type", "terminal", "address", "phone", "workingHours", "is24Hours", "hasSelfServiceKiosk", "hasVipLounge", "coordinates", "latitude", "longitude", "rating", "googleMapUrl", "image", "status"];
  const out = { ...existing || {} };
  for (const k of allowed) if (body?.[k] !== void 0) out[k] = body[k];
  if (body?.latitude !== void 0 || body?.longitude !== void 0) {
    out.latitude = Number(body.latitude ?? out.latitude ?? 24.7136);
    out.longitude = Number(body.longitude ?? out.longitude ?? 46.6753);
    out.coordinates = { lat: out.latitude, lng: out.longitude };
  }
  if (body?.coordinates) out.coordinates = body.coordinates;
  return out;
}
function sanitizeBlog(body, existing) {
  const allowed = ["slug", "title", "excerpt", "content", "category", "coverImage", "author", "readTimeMinutes", "isFeatured", "isPublished", "tags"];
  const out = { ...existing || {} };
  for (const k of allowed) if (body?.[k] !== void 0) out[k] = body[k];
  return out;
}
function sanitizeCategory(body, existing) {
  const out = { ...existing || {} };
  if (body?.slug !== void 0) out.slug = cleanString(body.slug, 60).toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  if (body?.name !== void 0) out.name = body.name;
  if (body?.description !== void 0) out.description = body.description;
  if (body?.icon !== void 0) out.icon = cleanString(body.icon, 40);
  if (body?.color !== void 0) out.color = cleanString(body.color, 20);
  if (body?.sortOrder !== void 0) out.sortOrder = Number(body.sortOrder) || 0;
  if (body?.isActive !== void 0) out.isActive = Boolean(body.isActive);
  return out;
}
var DEFAULT_CATEGORIES = [
  { id: "brand-toyota", slug: "toyota", name: { ar: "\u062A\u0648\u064A\u0648\u062A\u0627", en: "Toyota" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u062A\u0648\u064A\u0648\u062A\u0627 \u0627\u0644\u064A\u0627\u0628\u0627\u0646\u064A\u0629", en: "Toyota vehicles" }, icon: "Car", color: "#EB0A1E", sortOrder: 1, isActive: true },
  { id: "brand-hyundai", slug: "hyundai", name: { ar: "\u0647\u064A\u0648\u0646\u062F\u0627\u064A", en: "Hyundai" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0647\u064A\u0648\u0646\u062F\u0627\u064A \u0627\u0644\u0643\u0648\u0631\u064A\u0629", en: "Hyundai vehicles" }, icon: "Car", color: "#002C5F", sortOrder: 2, isActive: true },
  { id: "brand-kia", slug: "kia", name: { ar: "\u0643\u064A\u0627", en: "Kia" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0643\u064A\u0627", en: "Kia vehicles" }, icon: "Car", color: "#05141F", sortOrder: 3, isActive: true },
  { id: "brand-nissan", slug: "nissan", name: { ar: "\u0646\u064A\u0633\u0627\u0646", en: "Nissan" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0646\u064A\u0633\u0627\u0646", en: "Nissan vehicles" }, icon: "Truck", color: "#C3002F", sortOrder: 4, isActive: true },
  { id: "brand-mercedes", slug: "mercedes-benz", name: { ar: "\u0645\u0631\u0633\u064A\u062F\u0633-\u0628\u0646\u0632", en: "Mercedes-Benz" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0645\u0631\u0633\u064A\u062F\u0633 \u0627\u0644\u0641\u0627\u062E\u0631\u0629", en: "Mercedes luxury" }, icon: "Crown", color: "#1A1A1A", sortOrder: 5, isActive: true },
  { id: "brand-bmw", slug: "bmw", name: { ar: "\u0628\u064A \u0625\u0645 \u062F\u0628\u0644\u064A\u0648", en: "BMW" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0628\u064A \u0625\u0645 \u062F\u0628\u0644\u064A\u0648", en: "BMW vehicles" }, icon: "Crown", color: "#0066B1", sortOrder: 6, isActive: true },
  { id: "brand-lexus", slug: "lexus", name: { ar: "\u0644\u0643\u0632\u0633", en: "Lexus" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0644\u0643\u0632\u0633 \u0627\u0644\u0641\u0627\u062E\u0631\u0629", en: "Lexus luxury" }, icon: "Crown", color: "#1A1A1A", sortOrder: 7, isActive: true },
  { id: "brand-cadillac", slug: "cadillac", name: { ar: "\u0643\u0627\u062F\u064A\u0644\u0627\u0643", en: "Cadillac" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0643\u0627\u062F\u064A\u0644\u0627\u0643 \u0627\u0644\u0623\u0645\u0631\u064A\u0643\u064A\u0629", en: "Cadillac vehicles" }, icon: "Crown", color: "#0F0F0F", sortOrder: 8, isActive: true },
  { id: "brand-porsche", slug: "porsche", name: { ar: "\u0628\u0648\u0631\u0634", en: "Porsche" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0628\u0648\u0631\u0634 \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629", en: "Porsche sports" }, icon: "Zap", color: "#B12B28", sortOrder: 9, isActive: true },
  { id: "brand-gmc", slug: "gmc", name: { ar: "\u062C\u064A \u0625\u0645 \u0633\u064A", en: "GMC" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u062C\u064A \u0625\u0645 \u0633\u064A", en: "GMC vehicles" }, icon: "Truck", color: "#CC0000", sortOrder: 10, isActive: true },
  { id: "brand-chevrolet", slug: "chevrolet", name: { ar: "\u0634\u0641\u0631\u0648\u0644\u064A\u0647", en: "Chevrolet" }, description: { ar: "\u0633\u064A\u0627\u0631\u0627\u062A \u0634\u0641\u0631\u0648\u0644\u064A\u0647", en: "Chevrolet vehicles" }, icon: "Truck", color: "#FCC200", sortOrder: 11, isActive: true }
];
async function createApp(opts = {}) {
  const db2 = await ProductionDB.create();
  runtimeDb = db2;
  if (isProd && process.env.APP_URL && !/^https:\/\//i.test(process.env.APP_URL)) throw new Error("APP_URL must use HTTPS in production");
  const seed = new AlRufqahDataStore();
  if (process.env.SEED_CATALOG !== "false") {
    const existingCars = await db2.cars();
    const existingBranches = await db2.branches();
    const existingBlog = await db2.blog();
    if (!existingCars.length) for (const x of seed.cars) await db2.saveCar({ ...x, status: x.status || "available" });
    if (!existingBranches.length) for (const x of seed.branches) await db2.saveBranch(x);
    if (!existingBlog.length) for (const x of seed.blogPosts) await db2.saveBlog(x);
    const contentSeeds = { offer: OFFERS_DATA, usedCar: USED_CARS_DATA, loyaltyTier: LOYALTY_TIERS, subscription: SUBSCRIPTIONS_DATA, faq: FAQ_DATA, protectionPlan: PROTECTION_PLANS, addon: ADDON_OPTIONS };
    for (const [type, items] of Object.entries(contentSeeds)) {
      if (!(await db2.content(type)).length) for (const x of items) await db2.saveContent(type, x);
    }
    if (!(await db2.content("seo")).length) {
      const configuredBase = String(process.env.APP_URL || "").replace(/\/$/, "");
      if (!configuredBase && isProd) throw new Error("APP_URL is required in production before SEO configuration can be seeded");
      const seoBase = configuredBase || "http://localhost:3000";
      const globalSeo = { ...INITIAL_GLOBAL_SEO, canonicalBaseUrl: seoBase };
      const pageSeo = INITIAL_PAGE_SEO_CONFIGS.map((page) => ({ ...page, canonicalSlug: page.canonicalSlug }));
      const robots = { ...INITIAL_ROBOTS_CONFIG, sitemapUrl: `${seoBase}/sitemap.xml`, customRobotsTxt: String(INITIAL_ROBOTS_CONFIG.customRobotsTxt || "").replace(/https?:\/\/[^\s/]+/g, seoBase) };
      const keywords = INITIAL_KEYWORD_RANKINGS.map((item) => ({ ...item, targetUrl: String(item.targetUrl || "").replace(/https?:\/\/[^\s/]+/g, seoBase) }));
      await db2.saveContent("seo", { id: "global", key: "global", value: globalSeo });
      await db2.saveContent("seo", { id: "pages", key: "pages", value: pageSeo });
      await db2.saveContent("seo", { id: "schema", key: "schema", value: INITIAL_SCHEMA_CONFIG });
      await db2.saveContent("seo", { id: "robots", key: "robots", value: robots });
      await db2.saveContent("seo", { id: "keywords", key: "keywords", value: keywords });
    }
    if (!(await db2.categories()).length) {
      for (const cat of DEFAULT_CATEGORIES) await db2.saveCategory({ ...cat, createdAt: (/* @__PURE__ */ new Date()).toISOString(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    }
  }
  if (!process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD.length < 12) {
    if (isProd) throw new Error("ADMIN_INITIAL_PASSWORD must be configured and at least 12 characters in production");
  } else {
    const admins = await db2.users();
    let admin = admins.find((u) => u.email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@alrufqah.sa").toLowerCase());
    if (!admin) {
      admin = { id: `usr-${id()}`, fullName: process.env.ADMIN_NAME || "System Administrator", email: (process.env.ADMIN_EMAIL || "admin@alrufqah.sa").toLowerCase(), phone: process.env.ADMIN_PHONE || "", role: "admin", idType: "national_id", idNumber: "", nationality: "", licenseNumber: "", loyaltyTier: "platinum", loyaltyPoints: 0, avatar: "", isActive: true, totalRentalsCount: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), passwordHash: await hashPassword(process.env.ADMIN_INITIAL_PASSWORD) };
      await db2.saveUser(admin);
    }
  }
  const calculateQuote = async (input) => {
    const car = (await db2.cars()).find((c) => c.id === input.carId);
    if (!car) throw Object.assign(new Error("Vehicle not found"), { status: 404 });
    const pickupDate = String(input.pickupDate || ""), returnDate = String(input.returnDate || "");
    const pickupTime = String(input.pickupTime || "10:00"), returnTime = String(input.returnTime || "10:00");
    const pickup = `${pickupDate}T${pickupTime}:00+03:00`, ret = `${returnDate}T${returnTime}:00+03:00`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || !/^\d{4}-\d{2}-\d{2}$/.test(returnDate) || new Date(ret) <= new Date(pickup)) throw Object.assign(new Error("Invalid rental dates"), { status: 400 });
    const days = Math.max(1, Math.ceil((new Date(ret).getTime() - new Date(pickup).getTime()) / 864e5));
    if (days > 365) throw Object.assign(new Error("Rental period cannot exceed 365 days"), { status: 400 });
    if (!await db2.hasAvailability(car.id, pickup, ret, input.excludeBookingId)) return { available: false, numberOfDays: days, baseAmount: 0, protectionAmount: 0, addonsAmount: 0, intercityFee: 0, discountAmount: 0, vatAmount: 0, totalAmount: 0, currency: "SAR" };
    const base = Number(car.dailyPrice) * days;
    const plans = await db2.content("protectionPlan");
    const plan = plans.find((p) => p.id === input.protectionPlanId) || plans[0] || PROTECTION_PLANS[0];
    const protectionAmount = Number(plan.pricePerDay) * days;
    const addons = input.selectedAddons || {};
    const addonCatalog = await db2.content("addon");
    const addonsAmount = Object.entries(addons).reduce((sum, [addonId, qty]) => {
      const opt = addonCatalog.find((o) => o.id === addonId) || ADDON_OPTIONS.find((o) => o.id === addonId);
      const q = Math.max(0, Math.min(Number(qty) || 0, opt?.maxQuantity || 1));
      return sum + (opt ? opt.pricePerDay * q * days : 0);
    }, 0);
    const branches = await db2.branches();
    const pickupBranch = branches.find((b) => b.id === input.pickupBranchId);
    const returnBranch = branches.find((b) => b.id === input.returnBranchId);
    const intercityFee = input.returnToDifferentLocation && pickupBranch && returnBranch && pickupBranch.city.en !== returnBranch.city.en ? 150 : 0;
    const promo = String(input.promoCode || "").trim().toUpperCase();
    const promoRows = await db2.content("offer");
    const promoOffer = promoRows.find((o) => String(o.code || "").toUpperCase() === promo && o.isActive !== false && (!o.validUntil || String(o.validUntil) >= (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)));
    const parsedDiscount = promoOffer ? Number(String(promoOffer.discount || "").replace(/[^0-9.]/g, "")) / 100 : 0;
    const promoRates = { WEEKEND20: 0.2, AIRPORT15: 0.15, EARLYBIRD: 0.1, MONTHLY35: days >= 25 ? 0.35 : 0 };
    const discountRate = promoOffer ? parsedDiscount : promoRates[promo] ?? Number(car.discountPercentage || 0) / 100;
    const discountAmount = Number((base * discountRate).toFixed(2));
    const subtotal = Math.max(0, base + protectionAmount + addonsAmount + intercityFee - discountAmount);
    const vatAmount = Number((subtotal * 0.15).toFixed(2));
    return { available: true, numberOfDays: days, baseAmount: base, protectionAmount, addonsAmount, intercityFee, discountAmount, vatAmount, totalAmount: Number((subtotal + vatAmount).toFixed(2)), currency: "SAR", depositRequired: Number(car.depositRequired || 0), includedMileage: Number(car.includedMileagePerDay || 0) };
  };
  const OCCUPIED_BOOKING_STATUSES = ["pending_payment", "payment_unknown", "confirmed", "ready_for_pickup", "picked_up", "active", "return_pending"];
  const RENTED_BOOKING_STATUSES = ["ready_for_pickup", "picked_up", "active"];
  const reconcileCarStatus = async (carId) => {
    const car = (await db2.cars()).find((c) => c.id === carId);
    if (!car) return;
    const rows = await db2.bookings();
    const live = rows.filter((b) => b.car?.id === carId && OCCUPIED_BOOKING_STATUSES.includes(String(b.status)));
    const next = live.some((b) => RENTED_BOOKING_STATUSES.includes(String(b.status))) ? "rented" : live.length ? "reserved" : "available";
    if (next !== (car.status || "available")) await db2.saveCar({ ...car, status: next });
  };
  app.get("/api/health", async (_req, res) => {
    try {
      await db2.ping();
      res.json({ status: "ok", database: db2.persistent ? "postgresql" : "memory-dev", timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "1.0.0" });
    } catch (e) {
      res.status(503).json({ status: "degraded", error: "database_unavailable" });
    }
  });
  app.get("/api/ready", async (_req, res) => {
    try {
      await db2.ping();
      res.json({ ready: true });
    } catch {
      res.status(503).json({ ready: false });
    }
  });
  const notificationWorker = async () => {
    try {
      const jobs = await db2.claimNotifications(10);
      for (const job of jobs) {
        const url = job.channel === "sms" ? process.env.SMS_PROVIDER_URL : job.channel === "email" ? process.env.EMAIL_PROVIDER_URL : process.env.WHATSAPP_PROVIDER_URL;
        const key = job.channel === "sms" ? process.env.SMS_API_KEY : job.channel === "email" ? process.env.EMAIL_API_KEY : process.env.WHATSAPP_API_KEY;
        if (!url || !key) {
          await db2.completeNotification(job.id, false, `${job.channel} provider not configured`);
          continue;
        }
        try {
          const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` }, body: JSON.stringify({ to: job.recipient, template: job.template, payload: job.payload }) });
          if (!r.ok) throw new Error(`provider ${r.status}`);
          await db2.completeNotification(job.id, true);
        } catch (e) {
          await db2.completeNotification(job.id, false, e?.message || "delivery failed");
        }
      }
    } catch (e) {
      console.error("notification worker error", e);
    }
  };
  if (!process.env.VERCEL) {
    const workerTimer = setInterval(notificationWorker, 5e3);
    void workerTimer;
  }
  app.post("/api/auth/register", rateLimit(6, 15 * 60 * 1e3), async (req, res) => {
    try {
      const body = req.body || {};
      const fullName = cleanString(body.fullName, 160);
      const email = cleanString(body.email, 254).toLowerCase();
      const phone = cleanString(body.phone, 30);
      const password = typeof body.password === "string" ? body.password : "";
      if (fullName.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 6 || password.length < 12) return res.status(400).json({ error: "Full name, valid email, phone and password of at least 12 characters are required" });
      const exists = (await db2.users()).find((u) => String(u.email || "").toLowerCase() === email);
      if (exists) return res.status(409).json({ error: "An account with this email already exists" });
      const value = { id: `usr-${id()}`, fullName, email, phone, role: "user", idType: "national_id", idNumber: "", nationality: "", licenseNumber: "", loyaltyTier: "silver", loyaltyPoints: 0, isActive: true, totalRentalsCount: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), passwordHash: await hashPassword(password) };
      await db2.saveUser(value);
      const token = createSessionToken();
      await db2.createSession(hashSessionToken(token), value.id, value.role, 8 * 60 * 60 * 1e3);
      setCookie(res, "alrufqah_session", token, 8 * 60 * 60 * 1e3);
      res.status(201).json({ user: safeUser(value) });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Unable to create account" });
    }
  });
  app.get("/api/auth/google", rateLimit(20, 15 * 60 * 1e3), async (req, res) => {
    const { clientId, clientSecret, redirectUri } = googleConfig();
    if (!clientId || !clientSecret) return res.status(503).json({ error: "Google Sign-In is not configured" });
    const state = import_node_crypto2.default.randomBytes(32).toString("base64url");
    setCookie(res, "alrufqah_google_state", state, 10 * 60 * 1e3);
    const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: "openid email profile", state, access_type: "online", prompt: "select_account" });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  });
  app.get("/api/auth/google/callback", rateLimit(20, 15 * 60 * 1e3), async (req, res) => {
    try {
      const { clientId, clientSecret, redirectUri } = googleConfig();
      const cookies = parseCookies(req);
      const state = String(req.query.state || "");
      if (!clientId || !clientSecret) return res.redirect("/login?error=google_not_configured");
      if (!state || state !== cookies.alrufqah_google_state) return res.redirect("/login?error=google_state");
      clearCookie(res, "alrufqah_google_state");
      const code = String(req.query.code || "");
      if (!code) return res.redirect("/login?error=google_cancelled");
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
      if (!tokenRes.ok) return res.redirect("/login?error=google_token");
      const tokens = await tokenRes.json();
      if (!tokens.id_token) return res.redirect("/login?error=google_identity");
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`);
      if (!verifyRes.ok) return res.redirect("/login?error=google_identity");
      const profile = await verifyRes.json();
      if (profile.aud !== clientId || profile.iss !== "https://accounts.google.com" || profile.email_verified !== "true") return res.redirect("/login?error=google_identity");
      const email = String(profile.email || "").toLowerCase();
      if (!email) return res.redirect("/login?error=google_email");
      let user = (await db2.users()).find((u) => String(u.email || "").toLowerCase() === email);
      if (!user) {
        user = { id: `usr-${id()}`, fullName: cleanString(profile.name || email.split("@")[0], 160), email, phone: "", role: "user", idType: "national_id", idNumber: "", nationality: "", licenseNumber: "", loyaltyTier: "silver", loyaltyPoints: 0, isActive: true, totalRentalsCount: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), avatar: cleanString(profile.picture || "", 1e3), googleId: cleanString(profile.sub, 200) };
        await db2.saveUser(user);
      } else if (!user.googleId) {
        user = { ...user, googleId: cleanString(profile.sub, 200), avatar: user.avatar || cleanString(profile.picture || "", 1e3) };
        await db2.saveUser(user);
      }
      if (!user.isActive) return res.redirect("/login?error=account_disabled");
      const token = createSessionToken();
      await db2.createSession(hashSessionToken(token), user.id, user.role, 8 * 60 * 60 * 1e3);
      setCookie(res, "alrufqah_session", token, 8 * 60 * 60 * 1e3);
      res.redirect("/dashboard");
    } catch (e) {
      console.error("Google OAuth error", e);
      res.redirect("/login?error=google_failed");
    }
  });
  app.post("/api/auth/login", rateLimit(8, 15 * 60 * 1e3), async (req, res) => {
    const email = cleanString(req.body?.email, 254).toLowerCase();
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || password.length < 8) return res.status(400).json({ error: "Email and password are required" });
    const users = await db2.users();
    const user = users.find((u) => u.email.toLowerCase() === email && u.isActive);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    let valid = false;
    if (user.passwordHash) valid = await verifyPassword(password, user.passwordHash);
    else if (user.role === "admin" && process.env.ADMIN_INITIAL_PASSWORD && password === process.env.ADMIN_INITIAL_PASSWORD) {
      user.passwordHash = await hashPassword(password);
      await db2.saveUser(user);
      valid = true;
    }
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = createSessionToken();
    await db2.createSession(hashSessionToken(token), user.id, user.role, 8 * 60 * 60 * 1e3);
    res.setHeader("Set-Cookie", `alrufqah_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${isProd ? "; Secure" : ""}`);
    res.json({ user: safeUser(user) });
  });
  app.post("/api/auth/logout", auth(false), async (req, res) => {
    const token = getBearer(req) || req.headers.cookie?.match(/(?:^|; )alrufqah_session=([^;]+)/)?.[1];
    if (token) await db2.revokeSession(hashSessionToken(token));
    res.setHeader("Set-Cookie", "alrufqah_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
    res.json({ success: true });
  });
  app.get("/api/auth/me", auth(false), async (req, res) => {
    const u = req.user;
    if (!u) return res.status(401).json({ error: "Unauthenticated" });
    const user = (await db2.users()).find((x) => x.id === u.sub);
    if (!user) return res.status(401).json({ error: "User not found" });
    res.json({ user: safeUser(user) });
  });
  app.patch("/api/auth/me", auth(), async (req, res) => {
    const u = req.user;
    if (!u) return res.status(401).json({ error: "Unauthenticated" });
    const rows = await db2.users();
    const user = rows.find((x) => x.id === u.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    const body = req.body || {};
    const next = { ...user };
    if (typeof body.fullName === "string") next.fullName = cleanString(body.fullName, 120) || user.fullName;
    if (typeof body.phone === "string") next.phone = cleanString(body.phone, 30);
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    if (newPassword) {
      if (newPassword.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters" });
      const current = typeof body.currentPassword === "string" ? body.currentPassword : "";
      let valid = false;
      if (user.passwordHash) valid = await verifyPassword(current, user.passwordHash);
      else if (user.role === "admin" && process.env.ADMIN_INITIAL_PASSWORD) valid = current === process.env.ADMIN_INITIAL_PASSWORD;
      if (!valid) return res.status(400).json({ error: "Current password is incorrect" });
      next.passwordHash = await hashPassword(newPassword);
    }
    await db2.saveUser(next);
    await db2.saveAudit({ id: `log-${id()}`, timestamp: (/* @__PURE__ */ new Date()).toISOString(), actor: `${next.fullName || user.fullName} (${user.email})`, action: user.role === "admin" ? "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A" : "Profile updated", category: "auth", details: newPassword ? "\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" : user.role === "admin" ? "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0633\u0627\u0628" : "Account details updated" });
    res.json({ user: safeUser(next) });
  });
  app.get("/api/cars", async (req, res) => {
    let cars = await db2.cars();
    const q = cleanString(req.query.search, 100).toLowerCase();
    if (q) cars = cars.filter((c) => `${c.brand} ${c.name.ar} ${c.name.en} ${c.plateNumber || ""}`.toLowerCase().includes(q));
    const category = cleanString(req.query.category, 30);
    if (category && category !== "all") cars = cars.filter((c) => c.category === category);
    res.json(cars);
  });
  app.post("/api/cars", auth(), role("admin", "staff"), async (req, res) => {
    const car = sanitizeCar(req.body);
    if (!car.brand || !car.name?.ar || !car.name?.en) return res.status(400).json({ error: "Invalid vehicle payload" });
    const value = { ...car, status: car.status || "available", id: `car-${id()}` };
    await db2.saveCar(value);
    res.status(201).json(value);
  });
  app.put("/api/cars/:id", auth(), role("admin", "staff"), async (req, res) => {
    const cars = await db2.cars();
    const old = cars.find((c) => c.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Car not found" });
    const value = sanitizeCar(req.body, old);
    value.id = old.id;
    await db2.saveCar(value);
    res.json(value);
  });
  app.delete("/api/cars/:id", auth(), role("admin"), async (req, res) => {
    if (!await db2.deleteCar(req.params.id)) return res.status(404).json({ error: "Car not found" });
    res.json({ success: true });
  });
  app.get("/api/branches", async (_req, res) => res.json(await db2.branches()));
  app.post("/api/branches", auth(), role("admin"), async (req, res) => {
    const value = { ...sanitizeBranch(req.body), id: `branch-${id()}` };
    await db2.saveBranch(value);
    res.status(201).json(value);
  });
  app.put("/api/branches/:id", auth(), role("admin"), async (req, res) => {
    const old = (await db2.branches()).find((b) => b.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Branch not found" });
    const value = { ...sanitizeBranch(req.body, old), id: old.id };
    await db2.saveBranch(value);
    res.json(value);
  });
  app.delete("/api/branches/:id", auth(), role("admin"), async (req, res) => {
    if (!await db2.deleteBranch(req.params.id)) return res.status(404).json({ error: "Branch not found" });
    res.json({ success: true });
  });
  app.get("/api/categories", async (_req, res) => res.json(await db2.categories()));
  app.get("/api/categories/:id", async (req, res) => {
    const cat = (await db2.categories()).find((c) => c.id === req.params.id || c.slug === req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json(cat);
  });
  app.post("/api/categories", auth(), role("admin"), async (req, res) => {
    const body = req.body || {};
    if (!body.name?.ar || !body.name?.en) return res.status(400).json({ error: "Arabic and English names are required" });
    const slug = cleanString(body.slug || body.name.en, 60).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `cat-${id().slice(0, 6)}`;
    const exists = (await db2.categories()).some((c) => c.slug === slug);
    if (exists) return res.status(409).json({ error: "Category slug already exists" });
    const value = { id: `cat-${id()}`, slug, name: { ar: cleanString(body.name.ar, 60), en: cleanString(body.name.en, 60) }, description: body.description ? { ar: cleanString(body.description.ar, 200), en: cleanString(body.description.en, 200) } : void 0, icon: cleanString(body.icon, 40) || "Tag", color: cleanString(body.color, 20) || "#DFAB44", sortOrder: Number(body.sortOrder) || 0, isActive: body.isActive !== false, createdAt: (/* @__PURE__ */ new Date()).toISOString(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    await db2.saveCategory(value);
    res.status(201).json(value);
  });
  app.put("/api/categories/:id", auth(), role("admin"), async (req, res) => {
    const old = (await db2.categories()).find((c) => c.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Category not found" });
    const patch = sanitizeCategory(req.body, old);
    if (patch.name?.ar) patch.name.ar = cleanString(patch.name.ar, 60);
    if (patch.name?.en) patch.name.en = cleanString(patch.name.en, 60);
    if (patch.slug) {
      const dup = (await db2.categories()).some((c) => c.id !== old.id && c.slug === patch.slug);
      if (dup) return res.status(409).json({ error: "Category slug already exists" });
    }
    const value = { ...old, ...patch, id: old.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    if (req.body?.name) value.name = { ar: cleanString(req.body.name.ar || old.name.ar, 60), en: cleanString(req.body.name.en || old.name.en, 60) };
    if (req.body?.description) value.description = { ar: cleanString(req.body.description.ar || "", 200), en: cleanString(req.body.description.en || "", 200) };
    await db2.saveCategory(value);
    res.json(value);
  });
  app.delete("/api/categories/:id", auth(), role("admin"), async (req, res) => {
    const cats = await db2.categories();
    const target = cats.find((c) => c.id === req.params.id);
    if (!target) return res.status(404).json({ error: "Category not found" });
    const cars = await db2.cars();
    const used = cars.some((car) => car.brand?.toLowerCase() === target.slug.toLowerCase() || car.brand?.toLowerCase() === String(target.name?.en || "").toLowerCase());
    if (used) return res.status(409).json({ error: "Cannot delete brand in use by vehicles. Reassign vehicles first." });
    if (!await db2.deleteCategory(req.params.id)) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true });
  });
  app.get("/api/bookings", auth(), role("admin", "staff"), async (req, res) => {
    let rows = await db2.bookings();
    const actor = req.user;
    if (actor?.role === "staff" && actor.branchId) rows = rows.filter((b) => b.searchCriteria?.pickupBranchId === actor.branchId || b.searchCriteria?.returnBranchId === actor.branchId);
    const status = cleanString(req.query.status, 30);
    if (status) rows = rows.filter((b) => b.status === status);
    res.json(rows);
  });
  app.get("/api/bookings/my", auth(), async (req, res) => {
    const actor = req.user;
    if (!actor) return res.status(401).json({ error: "Authentication required" });
    const rows = await db2.bookings();
    const email = String(actor.email || "").toLowerCase().trim();
    const phone = String(actor.phone || "").trim();
    const mine = rows.filter((b) => String(b.customer?.email || "").toLowerCase().trim() === email || Boolean(phone && String(b.customer?.phone || "").trim() === phone) || Boolean(actor.sub && String(b.userId || "") === String(actor.sub)));
    res.json(mine.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))));
  });
  app.post("/api/bookings/lookup", rateLimit(12, 10 * 60 * 1e3), async (req, res) => {
    const bookingId = cleanString(req.body?.bookingId, 50);
    const secret = cleanString(req.body?.secret, 100);
    if (!bookingId || !secret) return res.status(400).json({ error: "Booking reference and registered mobile number are required" });
    const b = await db2.findBooking(bookingId, secret);
    if (!b) return res.status(404).json({ error: "Booking not found" });
    res.json(b);
  });
  app.post("/api/bookings/quote", rateLimit(30, 5 * 60 * 1e3), async (req, res) => {
    try {
      const quote = await calculateQuote(req.body || {});
      res.json(quote);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message || "Unable to calculate quote" });
    }
  });
  app.post("/api/bookings", rateLimit(20, 10 * 60 * 1e3), auth(false), async (req, res) => {
    try {
      const booking = req.body;
      if (!booking?.car?.id || !booking.searchCriteria?.pickupDate || !booking.searchCriteria?.returnDate || !booking.customer?.email || !booking.customer?.phone) return res.status(400).json({ error: "Required booking fields are missing" });
      const requestIdempotency = cleanString(req.headers["idempotency-key"], 120);
      if (requestIdempotency && !/^[A-Za-z0-9._:-]{8,120}$/.test(requestIdempotency)) return res.status(400).json({ error: "Invalid Idempotency-Key" });
      const idempotencyClaim = requestIdempotency ? await db2.claimIdempotency(requestIdempotency, "booking-create") : { claimed: true, response: null };
      if (!idempotencyClaim.claimed) {
        if (idempotencyClaim.response) return res.status(200).json(idempotencyClaim.response);
        return res.status(409).json({ error: "A request with this Idempotency-Key is already being processed. Please retry with the same key." });
      }
      const authoritativeCar = (await db2.cars()).find((c) => c.id === booking.car.id);
      if (!authoritativeCar) return res.status(404).json({ error: "Vehicle not found" });
      const quote = await calculateQuote({ carId: authoritativeCar.id, ...booking.searchCriteria, protectionPlanId: booking.protectionPlan?.id, selectedAddons: booking.selectedAddons });
      if (!quote.available) return res.status(409).json({ error: "Vehicle is no longer available for the selected time" });
      const paymentMethod = booking.payment?.method || "pay_on_arrival";
      if (paymentMethod !== "pay_on_arrival" && !process.env.STRIPE_SECRET_KEY) return res.status(501).json({ error: "Online payment provider is not configured" });
      const final = { ...booking, car: authoritativeCar, bookingId: booking.bookingId || bookingRef(), createdAt: (/* @__PURE__ */ new Date()).toISOString(), userId: req.user?.sub || booking.userId, status: paymentMethod === "pay_on_arrival" ? "confirmed" : "pending_payment", payment: { ...booking.payment, ...quote, isPaid: false, method: paymentMethod } };
      const saved = await db2.createBookingAtomic(final);
      if (!saved) return res.status(409).json({ error: "Vehicle is no longer available for the selected time" });
      if (paymentMethod !== "pay_on_arrival") {
        const payment = await createStripeCheckoutSession(saved);
        if (!payment.ok) {
          const failure = payment;
          const unresolved = failure.status >= 500 ? "payment_unknown" : "cancelled";
          await db2.saveBooking({ ...saved, status: unresolved });
          return res.status(failure.status).json({ error: failure.error, bookingStatus: unresolved });
        }
        const response = { ...saved, paymentIntent: { reference: payment.reference, data: payment.data } };
        await reconcileCarStatus(saved.car.id);
        if (requestIdempotency) await db2.completeIdempotency(requestIdempotency, response);
        return res.status(201).json(response);
      }
      await reconcileCarStatus(saved.car.id);
      if (requestIdempotency) await db2.completeIdempotency(requestIdempotency, saved);
      res.status(201).json(saved);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message || "Booking failed" });
    }
  });
  app.post("/api/bookings/:id/cancel", rateLimit(10, 10 * 60 * 1e3), async (req, res) => {
    const actor = req.user;
    const secret = cleanString(req.body?.secret, 100);
    const booking = await db2.findBooking(req.params.id, secret);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const allowedOwner = Boolean(actor && (actor.role === "admin" || actor.role === "staff" || actor.sub === booking.userId));
    if (!allowedOwner && !secret) return res.status(400).json({ error: "Registered mobile number is required" });
    if (!["confirmed", "pending_payment", "payment_unknown"].includes(booking.status)) return res.status(409).json({ error: "This booking cannot be cancelled in its current status" });
    const value = { ...booking, status: "cancelled" };
    await db2.saveBooking(value);
    await reconcileCarStatus(booking.car?.id);
    await db2.enqueueNotification("email", booking.customer.email, "booking.cancelled", { bookingId: booking.bookingId });
    res.json(value);
  });
  app.put("/api/bookings/:id/status", auth(), role("admin", "staff"), async (req, res) => {
    const all = await db2.bookings();
    const old = all.find((b) => b.bookingId === req.params.id);
    const next = String(req.body?.status || "");
    const transitions = { pending_payment: ["cancelled", "confirmed", "payment_unknown"], payment_unknown: ["confirmed", "cancelled"], confirmed: ["active", "cancelled", "no_show"], active: ["return_pending", "completed"], return_pending: ["completed"], completed: [], cancelled: [], no_show: [] };
    if (!old || !transitions[old.status]?.includes(next)) return res.status(409).json({ error: "Invalid booking state transition" });
    const value = { ...old, status: next };
    await db2.saveBooking(value);
    await reconcileCarStatus(old.car?.id);
    res.json(value);
  });
  app.post("/api/payments/intents", rateLimit(20, 10 * 60 * 1e3), auth(false), async (req, res) => {
    const { bookingId, secret } = req.body || {};
    if (!bookingId) return res.status(400).json({ error: "Invalid payment intent" });
    const booking = (await db2.bookings()).find((b) => b.bookingId === bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const requester = req.user;
    if (!requester && cleanString(secret, 100) !== cleanString(booking.customer?.phone, 100)) return res.status(404).json({ error: "Booking not found" });
    if (booking.status !== "pending_payment") return res.status(409).json({ error: "Booking is not awaiting payment" });
    const amount = Number(booking.payment?.totalAmount || 0);
    if (amount <= 0) return res.status(400).json({ error: "Booking has no payable amount" });
    const result = await createStripeCheckoutSession(booking);
    if (!result.ok) {
      const failure = result;
      return res.status(failure.status).json({ error: failure.error });
    }
    res.status(201).json({ status: "pending", reference: result.reference, data: result.data });
  });
  app.post("/api/payments/webhook", async (req, res) => {
    const raw = req.rawBody || JSON.stringify(req.body || {});
    if (!verifyStripeWebhookSignature(raw, String(req.headers["stripe-signature"] || ""))) return res.status(401).json({ error: "Invalid webhook signature" });
    const event = req.body || {};
    const obj = event.data?.object || {};
    const providerEventId = String(event.id || "").trim();
    if (!providerEventId) return res.status(400).json({ error: "Missing provider event id" });
    const bookingId = String(event.type === "checkout.session.completed" ? obj?.client_reference_id : "").trim();
    const paymentStatus = event.type === "checkout.session.completed" ? "succeeded" : "";
    const paidStatus = ["checkout.session.completed", "payment_intent.succeeded"].includes(event.type) ? "succeeded" : "";
    const freshEvent = await db2.recordPaymentEvent("stripe", providerEventId, bookingId, paymentStatus, event);
    if (!freshEvent) return res.json({ received: true, duplicate: true });
    if (bookingId && paidStatus === "succeeded") {
      const booking = (await db2.bookings()).find((b) => b.bookingId === bookingId);
      if (booking) {
        const value = { ...booking, payment: { ...booking.payment, isPaid: true, providerReference: obj?.id || providerEventId, provider: "stripe" }, status: booking.status === "pending_payment" ? "confirmed" : booking.status };
        await db2.saveBooking(value);
        await reconcileCarStatus(booking.car?.id);
      }
    }
    res.json({ received: true });
  });
  app.put("/api/bookings/:id/tamm", auth(), role("admin", "staff"), async (req, res) => {
    const booking = (await db2.bookings()).find((b) => b.bookingId === req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const value = { ...booking, tammAuthorized: true, tammAuthorizationNumber: `AR-${booking.bookingId}` };
    await db2.saveBooking(value);
    res.json(value);
  });
  app.delete("/api/bookings/:id", auth(), role("admin"), async (req, res) => {
    const booking = (await db2.bookings()).find((b) => b.bookingId === req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    await db2.deleteBooking(req.params.id);
    await reconcileCarStatus(booking.car?.id);
    res.json({ success: true });
  });
  app.post("/api/bookings/:id/reinstate", auth(), role("admin"), async (req, res) => {
    const old = (await db2.bookings()).find((b) => b.bookingId === req.params.id);
    if (!old) return res.status(404).json({ error: "Booking not found" });
    if (!["cancelled", "no_show"].includes(old.status)) return res.status(409).json({ error: "Booking can only be restored from cancelled or no-show state" });
    const value = { ...old, status: "confirmed" };
    await db2.saveBooking(value);
    await reconcileCarStatus(old.car?.id);
    res.json(value);
  });
  app.post("/api/invoices/:bookingId/submit-zatca", auth(), role("admin", "staff"), async (req, res) => {
    const booking = (await db2.bookings()).find((b) => b.bookingId === req.params.bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const invoice = { invoiceNumber: `INV-${booking.bookingId}`, issueDate: (/* @__PURE__ */ new Date()).toISOString(), currency: "SAR", vatRate: 0.15, customer: booking.customer, total: booking.payment?.totalAmount || 0, issuedBy: "Al-Rufqah Internal", internal: true };
    res.json({ submitted: true, reference: `INV-${booking.bookingId}`, invoice, data: { mode: "internal", externalIntegration: false } });
  });
  app.get("/api/users", auth(), role("admin", "staff"), async (_req, res) => res.json((await db2.users()).map(safeUser)));
  app.post("/api/users", auth(), role("admin"), async (req, res) => {
    const body = req.body || {};
    if (!body.fullName || !body.email || !body.phone || !body.role) return res.status(400).json({ error: "Invalid user payload" });
    if (!["admin", "staff", "user"].includes(body.role)) return res.status(400).json({ error: "Invalid role" });
    const value = { id: `usr-${id()}`, fullName: cleanString(body.fullName, 160), email: cleanString(body.email, 254).toLowerCase(), phone: cleanString(body.phone, 30), role: body.role, idType: body.idType || "national_id", idNumber: cleanString(body.idNumber, 80), nationality: cleanString(body.nationality, 100), licenseNumber: cleanString(body.licenseNumber, 80), loyaltyTier: body.loyaltyTier || "silver", loyaltyPoints: Number(body.role === "user" ? 500 : 0), avatar: cleanString(body.avatar, 1e3), branchId: cleanString(body.branchId, 80) || void 0, isActive: true, totalRentalsCount: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) };
    if (body.password) {
      if (typeof body.password !== "string" || body.password.length < 12) return res.status(400).json({ error: "Password must be at least 12 characters" });
      value.passwordHash = await hashPassword(body.password);
    }
    await db2.saveUser(value);
    res.status(201).json(safeUser(value));
  });
  app.put("/api/users/:id", auth(), role("admin"), async (req, res) => {
    const old = (await db2.users()).find((u) => u.id === req.params.id);
    if (!old) return res.status(404).json({ error: "User not found" });
    const allowed = ["fullName", "email", "phone", "role", "branchId", "isActive", "idType", "idNumber", "nationality", "licenseNumber", "loyaltyTier", "loyaltyPoints", "avatar"];
    const patch = {};
    for (const key of allowed) if (req.body?.[key] !== void 0) patch[key] = req.body[key];
    if (patch.role && !["admin", "staff", "user"].includes(patch.role)) return res.status(400).json({ error: "Invalid role" });
    const value = { ...old, ...patch, id: old.id };
    await db2.saveUser(value);
    res.json(safeUser(value));
  });
  app.delete("/api/users/:id", auth(), role("admin"), async (req, res) => {
    if (!await db2.deleteUser(req.params.id)) return res.status(404).json({ error: "User not found" });
    res.json({ success: true });
  });
  app.get("/api/blog", async (_req, res) => res.json(await db2.blog()));
  app.post("/api/blog", auth(), role("admin", "staff"), async (req, res) => {
    const value = { ...sanitizeBlog(req.body), id: `post-${id()}`, views: 0, likes: 0, publishedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) };
    await db2.saveBlog(value);
    res.status(201).json(value);
  });
  app.put("/api/blog/:id", auth(), role("admin", "staff"), async (req, res) => {
    const old = (await db2.blog()).find((p) => p.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Post not found" });
    const value = { ...sanitizeBlog(req.body, old), id: old.id };
    await db2.saveBlog(value);
    res.json(value);
  });
  app.delete("/api/blog/:id", auth(), role("admin"), async (req, res) => {
    if (!await db2.deleteBlog(req.params.id)) return res.status(404).json({ error: "Post not found" });
    res.json({ success: true });
  });
  app.post("/api/blog/:id/like", rateLimit(60, 60 * 60 * 1e3), async (req, res) => {
    const old = (await db2.blog()).find((p) => p.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Post not found" });
    const value = { ...old, likes: old.likes + 1 };
    await db2.saveBlog(value);
    res.json({ likes: value.likes });
  });
  app.get("/api/roadside", auth(), role("admin", "staff"), async (_req, res) => res.json(await db2.roadside()));
  app.post("/api/roadside", rateLimit(10, 10 * 60 * 1e3), async (req, res) => {
    const value = { callerName: cleanString(req.body?.callerName, 120), callerPhone: cleanString(req.body?.callerPhone, 30), carModel: cleanString(req.body?.carModel, 120), plateNumber: cleanString(req.body?.plateNumber, 40), issueType: cleanString(req.body?.issueType, 40), city: cleanString(req.body?.city, 80), locationDescription: cleanString(req.body?.locationDescription, 500), coordinates: req.body?.coordinates, notes: cleanString(req.body?.notes, 1e3), id: `sos-${id()}`, ticketNumber: `SOS-${import_node_crypto2.default.randomInt(1e4, 99999)}`, createdAt: (/* @__PURE__ */ new Date()).toISOString(), status: "pending" };
    await db2.saveRoadside(value);
    res.status(201).json(value);
  });
  app.put("/api/roadside/:id", auth(), role("admin", "staff"), async (req, res) => {
    const old = (await db2.roadside()).find((t) => t.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Ticket not found" });
    const allowed = ["status", "priority", "assignedUnit", "notes", "locationDescription", "coordinates"];
    const patch = {};
    for (const k of allowed) if (req.body?.[k] !== void 0) patch[k] = req.body[k];
    const value = { ...old, ...patch, id: old.id };
    await db2.saveRoadside(value);
    res.json(value);
  });
  app.get("/api/inspections", auth(), role("admin", "staff"), async (_req, res) => res.json(await db2.inspections()));
  app.post("/api/inspections", auth(), role("admin", "staff"), async (req, res) => {
    const allowed = ["bookingId", "carId", "inspectionType", "inspectorName", "odometer", "fuelLevel", "cleanliness", "tiresCondition", "acWorking", "spareTirePresent", "scratchesOrDents", "signatureUrl", "notes"];
    const value = { id: `insp-${id()}`, date: (/* @__PURE__ */ new Date()).toISOString() };
    for (const k of allowed) if (req.body?.[k] !== void 0) value[k] = req.body[k];
    await db2.saveInspection(value);
    res.status(201).json(value);
  });
  app.get("/api/corporate", auth(), role("admin", "staff"), async (_req, res) => res.json(await db2.corporate()));
  app.post("/api/corporate", rateLimit(10, 10 * 60 * 1e3), async (req, res) => {
    const value = { companyName: cleanString(req.body?.companyName, 200), contactPerson: cleanString(req.body?.contactPerson, 160), phone: cleanString(req.body?.phone, 30), email: cleanString(req.body?.email, 254).toLowerCase(), fleetSize: cleanString(req.body?.fleetSize, 100), rentalDuration: cleanString(req.body?.rentalDuration, 100), city: cleanString(req.body?.city, 100), notes: cleanString(req.body?.notes, 1500), id: `corp-${id()}`, status: "new", createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) };
    await db2.saveCorporate(value);
    res.status(201).json(value);
  });
  app.put("/api/corporate/:id", auth(), role("admin", "staff"), async (req, res) => {
    const old = (await db2.corporate()).find((x) => x.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Inquiry not found" });
    const allowed = ["companyName", "contactPerson", "phone", "email", "fleetSize", "rentalDuration", "city", "notes", "status"];
    const patch = {};
    for (const k of allowed) if (req.body?.[k] !== void 0) patch[k] = req.body[k];
    const value = { ...old, ...patch, id: old.id };
    await db2.saveCorporate(value);
    res.json(value);
  });
  app.get("/api/contact", auth(), role("admin", "staff"), async (_req, res) => res.json(await db2.contacts()));
  app.post("/api/contact", rateLimit(10, 10 * 60 * 1e3), async (req, res) => {
    const value = {
      id: `contact-${id()}`,
      name: cleanString(req.body?.name, 120),
      phone: cleanString(req.body?.phone, 30),
      email: cleanString(req.body?.email, 254).toLowerCase() || void 0,
      subject: cleanString(req.body?.subject, 80) || "general",
      message: cleanString(req.body?.message, 2e3),
      status: "new",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!value.name || !value.phone || !value.message) return res.status(400).json({ error: "Name, phone and message are required" });
    await db2.saveContact(value);
    res.status(201).json(value);
  });
  app.put("/api/contact/:id", auth(), role("admin", "staff"), async (req, res) => {
    const old = (await db2.contacts()).find((x) => x.id === req.params.id);
    if (!old) return res.status(404).json({ error: "Message not found" });
    const allowed = ["name", "phone", "email", "subject", "message", "status"];
    const patch = {};
    for (const k of allowed) if (req.body?.[k] !== void 0) patch[k] = req.body[k];
    const value = { ...old, ...patch, id: old.id };
    await db2.saveContact(value);
    res.json(value);
  });
  app.delete("/api/contact/:id", auth(), role("admin"), async (req, res) => {
    if (!await db2.deleteContact(req.params.id)) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true });
  });
  app.get("/api/logs", auth(), role("admin", "staff"), async (_req, res) => res.json(await db2.audits()));
  app.post("/api/logs", auth(), role("admin", "staff"), async (req, res) => {
    const value = { ...req.body, id: `log-${id()}`, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
    await db2.saveAudit(value);
    res.status(201).json(value);
  });
  app.get("/api/stats", auth(), role("admin", "staff"), async (_req, res) => {
    const [cars, bookings] = await Promise.all([db2.cars(), db2.bookings()]);
    const paid = bookings.reduce((s, b) => s + (b.payment?.isPaid ? Number(b.payment.totalAmount || 0) : 0), 0);
    const active = bookings.filter((b) => ["active", "confirmed", "ready_for_pickup", "picked_up"].includes(String(b.status))).length;
    const total = cars.length;
    const byCity = /* @__PURE__ */ new Map();
    for (const b of bookings) byCity.set(b.searchCriteria?.pickupCity || "Unknown", (byCity.get(b.searchCriteria?.pickupCity || "Unknown") || 0) + Number(b.payment?.isPaid ? b.payment.totalAmount || 0 : 0));
    const monthly = /* @__PURE__ */ new Map();
    for (const b of bookings) {
      const d = String(b.createdAt || "").slice(0, 7) || "unknown";
      monthly.set(d, (monthly.get(d) || 0) + Number(b.payment?.isPaid ? b.payment.totalAmount || 0 : 0));
    }
    res.json({ totalRevenue: paid, activeRentals: active, totalFleet: total, occupancyRate: total ? Math.min(100, Math.round(active / total * 100)) : 0, satisfactionRating: null, revenueByCity: [...byCity].map(([name, value]) => ({ name, value })), monthlyTrends: [...monthly].sort(([a], [b]) => a.localeCompare(b)).map(([month, revenue]) => ({ month, revenue })), fleetStatusBreakdown: [{ name: "available", value: cars.filter((c) => c.status === "available").length }, { name: "rented", value: cars.filter((c) => c.status === "rented").length }, { name: "maintenance", value: cars.filter((c) => c.status === "maintenance").length }, { name: "reserved", value: cars.filter((c) => c.status === "reserved").length }] });
  });
  const contentTypeMap = { offers: "offer", "used-cars": "usedCar", loyalty: "loyaltyTier", subscriptions: "subscription", faq: "faq", seo: "seo", "used-car-leads": "usedCarLead", "protection-plans": "protectionPlan", addons: "addon" };
  app.post("/api/content/used-cars/test-drive", rateLimit(10, 10 * 60 * 1e3), async (req, res) => {
    const body = req.body || {};
    if (!body.usedCarId || !cleanString(body.customerName, 160) || !cleanString(body.customerPhone, 30) || !cleanString(body.preferredDate, 30)) return res.status(400).json({ error: "Customer name, phone, vehicle and preferred date are required" });
    const value = { id: `lead-${id()}`, usedCarId: cleanString(body.usedCarId, 100), customerName: cleanString(body.customerName, 160), customerPhone: cleanString(body.customerPhone, 30), preferredDate: cleanString(body.preferredDate, 30), status: "new", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    await db2.saveContent("usedCarLead", value);
    res.status(201).json(value);
  });
  app.get("/api/content/used-car-leads", auth(), role("admin", "staff"), async (_req, res) => res.json(await db2.content("usedCarLead")));
  app.get("/api/content/:type", async (req, res) => {
    const type = contentTypeMap[String(req.params.type)];
    if (!type) return res.status(404).json({ error: "Unknown content type" });
    res.json(await db2.content(type));
  });
  app.post("/api/content/:type", auth(), role("admin"), async (req, res) => {
    const type = contentTypeMap[String(req.params.type)];
    if (!type) return res.status(404).json({ error: "Unknown content type" });
    const value = { ...req.body || {}, id: String(req.body?.id || `${type}-${id()}`) };
    await db2.saveContent(type, value);
    res.status(201).json(value);
  });
  app.put("/api/content/:type/:id", auth(), role("admin"), async (req, res) => {
    const type = contentTypeMap[String(req.params.type)];
    if (!type) return res.status(404).json({ error: "Unknown content type" });
    const rows = await db2.content(type);
    const old = rows.find((x) => String(x.id) === String(req.params.id));
    if (!old) return res.status(404).json({ error: "Content item not found" });
    const value = { ...old, ...req.body || {}, id: old.id };
    await db2.saveContent(type, value);
    res.json(value);
  });
  app.delete("/api/content/:type/:id", auth(), role("admin"), async (req, res) => {
    const type = contentTypeMap[String(req.params.type)];
    if (!type) return res.status(404).json({ error: "Unknown content type" });
    if (!await db2.deleteContent(type, req.params.id)) return res.status(404).json({ error: "Content item not found" });
    res.json({ success: true });
  });
  app.get("/api/settings/payments", auth(), role("admin"), async (_req, res) => {
    const rows = await db2.content("paymentSettings");
    const x = rows.find((v2) => v2.id === "default");
    const v = x?.value || {};
    res.json({ provider: v.provider || "generic", enabled: Boolean(v.enabled), environment: v.environment || "test", apiUrl: v.apiUrl || "", publicKey: v.publicKey || "", hasApiKey: Boolean(decryptSecret(v.apiKey)), hasWebhookSecret: Boolean(decryptSecret(v.webhookSecret)) });
  });
  app.put("/api/settings/payments", auth(), role("admin"), async (req, res) => {
    const body = req.body || {};
    const rows = await db2.content("paymentSettings");
    const old = rows.find((v) => v.id === "default");
    const prev = old?.value || {};
    const value = { ...prev, provider: cleanString(body.provider, 50) || "generic", enabled: Boolean(body.enabled), environment: body.environment === "live" ? "live" : "test", apiUrl: cleanString(body.apiUrl, 500), publicKey: cleanString(body.publicKey, 1e3) };
    if (typeof body.apiKey === "string" && body.apiKey.trim()) value.apiKey = encryptSecret(body.apiKey.trim());
    if (typeof body.webhookSecret === "string" && body.webhookSecret.trim()) value.webhookSecret = encryptSecret(body.webhookSecret.trim());
    await db2.saveContent("paymentSettings", { id: "default", key: "default", value });
    res.json({ provider: value.provider, enabled: value.enabled, environment: value.environment, apiUrl: value.apiUrl, publicKey: value.publicKey, hasApiKey: Boolean(value.apiKey), hasWebhookSecret: Boolean(value.webhookSecret) });
  });
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /login
Sitemap: ${process.env.APP_URL || "http://localhost:3000"}/sitemap.xml
`);
  });
  app.get("/sitemap.xml", (_req, res) => {
    const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
    const pages = ["/", "/fleet", "/branches", "/offers", "/corporate", "/subscription", "/used-cars", "/loyalty", "/manage-booking", "/about", "/faq", "/contact", "/blog"];
    const urls = pages.map((p) => `<url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`).join("");
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  });
  if (opts.serveStatic) {
    if (!isProd) {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
      app.use(vite.middlewares);
    } else {
      const distPath = import_node_path.default.join(process.cwd(), "dist");
      app.use(import_express.default.static(distPath, { maxAge: "1y", index: false }));
      app.get("*", (req, res) => {
        const site = String(process.env.APP_URL || "").replace(/\/$/, "");
        const file = import_node_path.default.join(distPath, "index.html");
        if (!site) return res.sendFile(file);
        return res.type("html").send(import_node_fs.default.readFileSync(file, "utf8").replaceAll("__SITE_URL__", site));
      });
    }
  }
  app.use((err, req, res, _next) => {
    console.error({ requestId: req.requestId, error: err });
    if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
  });
  return app;
}
if (!process.env.VERCEL) {
  createApp({ serveStatic: true }).then((app2) => app2.listen(PORT, "0.0.0.0", () => console.log(`[Al-Rufqah] ${isProd ? "production" : "development"} server listening on :${PORT} | db=${runtimeDb?.persistent ? "postgresql" : "memory-dev"}`))).catch((err) => {
    console.error("Fatal startup error", err);
    process.exit(1);
  });
}

// api/index.ts
var appPromise = null;
function withTimeout(p, ms, label) {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms))
  ]);
}
function getApp() {
  if (!appPromise) {
    appPromise = withTimeout(createApp({ serveStatic: false }), 12e3, "createApp").catch((err) => {
      appPromise = null;
      console.error("[api] createApp failed:", err);
      throw err;
    });
  }
  return appPromise;
}
async function runDebug() {
  const info = {
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    hasDbUrl: Boolean(process.env.DATABASE_URL),
    dbHost: process.env.DATABASE_URL ? safeHost(process.env.DATABASE_URL) : null,
    appUrl: process.env.APP_URL,
    authSecretLen: process.env.AUTH_SECRET ? process.env.AUTH_SECRET.length : 0,
    adminPwLen: process.env.ADMIN_INITIAL_PASSWORD ? process.env.ADMIN_INITIAL_PASSWORD.length : 0,
    databaseSsl: process.env.DATABASE_SSL
  };
  try {
    const { ProductionDB: ProductionDB2 } = await Promise.resolve().then(() => (init_production_db(), production_db_exports));
    const db2 = await withTimeout(ProductionDB2.create(), 1e4, "ProductionDB.create");
    await db2.ping();
    info.dbPing = "ok";
    info.dbType = db2.persistent ? "postgresql" : "memory";
  } catch (e) {
    info.dbError = e?.message;
    info.dbStack = String(e?.stack || "").split("\n").slice(0, 6);
  }
  return info;
}
function safeHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return url.slice(0, 40);
  }
}
async function handler(req, res) {
  const path2 = String(req.url || "").split("?")[0];
  if (path2 === "/api/__debug") {
    try {
      const info = await runDebug();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(info, null, 2));
    } catch (e) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ fatal: e?.message, stack: String(e?.stack || "").split("\n").slice(0, 6) }, null, 2));
    }
    return;
  }
  try {
    const app2 = await getApp();
    return app2(req, res);
  } catch (err) {
    console.error("[api] request handler failed:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err?.message || "Function initialization failed", stack: process.env.NODE_ENV !== "production" ? err?.stack : void 0 }));
  }
}

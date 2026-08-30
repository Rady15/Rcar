import { randomUUID } from 'node:crypto';
import type { Car, Branch, BookingDetails, AppUser, BlogPost, RoadsideTicket, InspectionReport, CorporateInquiry, SystemAuditLog, ContactMessage } from '../src/types';

export type EntityType = 'car'|'branch'|'booking'|'user'|'blog'|'roadside'|'inspection'|'corporate'|'audit'|'contact'|'offer'|'usedCar'|'loyaltyTier'|'subscription'|'faq'|'seo'|'paymentSettings'|'usedCarLead'|'protectionPlan'|'addon'|'category';

type Row = { id: string; entity_type: EntityType; data: any; car_id?: string|null; pickup_at?: string|null; return_at?: string|null; status?: string|null; email?: string|null; phone?: string|null; created_at: string };

export class ProductionDB {
  private pool: any = null;
  private memory = new Map<string, Map<string, any>>();
  private sessions = new Map<string, { userId:string; role:string; expiresAt:number }>();
  private devRateLimits = new Map<string, {count:number; reset:number}>();
  public readonly persistent: boolean;

  private constructor(pool: any) {
    this.pool = pool;
    this.persistent = Boolean(pool);
    for (const type of ['car','branch','booking','user','blog','roadside','inspection','corporate','audit','contact','offer','usedCar','loyaltyTier','subscription','faq','seo','paymentSettings','usedCarLead','protectionPlan','addon','category'] as EntityType[]) this.memory.set(type, new Map());
  }

  static async create() {
    if (!process.env.DATABASE_URL) { if (process.env.NODE_ENV === 'production') throw new Error('DATABASE_URL is required in production'); return new ProductionDB(null); }
    const mod: any = await import('pg');
    const dbUrl = process.env.DATABASE_URL || '';
    const sslHint = /(neon\.tech|supabase|rds\.amazonaws|render\.com|herokuapp|amazonaws|sslmode=require|sslmode=verify|channel_binding=)/i.test(dbUrl);
    const sslEnabled = process.env.DATABASE_SSL === 'true' || sslHint || (process.env.NODE_ENV === 'production' && process.env.DATABASE_SSL !== 'false');
    const pool = new mod.Pool({ connectionString: dbUrl, max: Number(process.env.DB_POOL_MAX || 10), idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000, ssl: sslEnabled ? { rejectUnauthorized: false } : undefined });
    const db = new ProductionDB(pool);
    await db.migrate();
    return db;
  }

  private async migrate() {
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

  async ping() { if (!this.persistent) return true; await this.pool.query('SELECT 1'); return true; }
  async consumeRateLimit(key: string, limit: number, windowMs: number): Promise<{ allowed: boolean; retryAfterMs: number }> {
    const now = Date.now();
    if (!this.persistent) {
      const current = this.devRateLimits.get(key);
      if (!current || now >= current.reset) { this.devRateLimits.set(key, { count: 1, reset: now + windowMs }); return { allowed: true, retryAfterMs: 0 }; }
      current.count += 1;
      return { allowed: current.count <= limit, retryAfterMs: Math.max(0, current.reset - now) };
    }
    if (Math.random() < 0.01) void this.pool.query("DELETE FROM rate_limit_buckets WHERE window_started_at < now() - interval '24 hours'").catch(() => {});
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


  private async list<T>(type: EntityType): Promise<T[]> {
    if (!this.persistent) return [...(this.memory.get(type)?.values() || [])] as T[];
    const { rows } = await this.pool.query('SELECT data FROM app_entities WHERE entity_type=$1 ORDER BY created_at DESC', [type]);
    return rows.map((r: any) => r.data) as T[];
  }

  private async get<T>(type: EntityType, id: string): Promise<T|null> {
    if (!this.persistent) return (this.memory.get(type)?.get(id) as T) || null;
    const { rows } = await this.pool.query('SELECT data FROM app_entities WHERE entity_type=$1 AND entity_id=$2', [type,id]);
    return rows[0]?.data || null;
  }

  private async put<T extends object>(type: EntityType, value: T, meta: Partial<Row> = {}): Promise<T> {
    const id = (value as any).id || (value as any).bookingId || randomUUID();
    const normalized: any = { ...value, ...(type === 'booking' ? { id: undefined } : {}) };
    if (type === 'booking') normalized.bookingId = (value as any).bookingId || id;
    delete normalized.id;
    const stored: any = type === 'booking' ? normalized : { ...value, id };
    if (!this.persistent) { this.memory.get(type)!.set(id, stored); return stored; }
    await this.pool.query(`INSERT INTO app_entities(entity_type,entity_id,data,car_id,pickup_at,return_at,status,email,phone) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(entity_type,entity_id) DO UPDATE SET data=EXCLUDED.data,car_id=EXCLUDED.car_id,pickup_at=EXCLUDED.pickup_at,return_at=EXCLUDED.return_at,status=EXCLUDED.status,email=EXCLUDED.email,phone=EXCLUDED.phone,updated_at=now()`, [type,id,stored,meta.car_id||null,meta.pickup_at||null,meta.return_at||null,meta.status||null,meta.email||null,meta.phone||null]);
    return stored;
  }

  private async remove(type: EntityType, id: string) {
    if (!this.persistent) return this.memory.get(type)!.delete(id);
    const r = await this.pool.query('DELETE FROM app_entities WHERE entity_type=$1 AND entity_id=$2', [type,id]); return r.rowCount > 0;
  }

  async cars() { return this.list<Car>('car'); }
  async branches() { return this.list<Branch>('branch'); }
  async categories() { return this.list<any>('category'); }
  async saveCategory(category: any) { return this.put('category', category); }
  async deleteCategory(id: string) { return this.remove('category', id); }
  async bookings() { return this.list<BookingDetails>('booking'); }
  async users() { return this.list<AppUser>('user'); }
  async blog() { return this.list<BlogPost>('blog'); }
  async roadside() { return this.list<RoadsideTicket>('roadside'); }
  async inspections() { return this.list<InspectionReport>('inspection'); }
  async corporate() { return this.list<CorporateInquiry>('corporate'); }
  async audits() { return this.list<SystemAuditLog>('audit'); }
  async contacts() { return this.list<ContactMessage>('contact'); }
  async content<T=any>(type: Exclude<EntityType, 'car'|'branch'|'booking'|'user'|'blog'|'roadside'|'inspection'|'corporate'|'audit'|'contact'>) { return this.list<T>(type); }
  async saveContent<T extends object>(type: Exclude<EntityType, 'car'|'branch'|'booking'|'user'|'blog'|'roadside'|'inspection'|'corporate'|'audit'|'contact'>, value: T) { return this.put(type, value); }
  async deleteContent(type: Exclude<EntityType, 'car'|'branch'|'booking'|'user'|'blog'|'roadside'|'inspection'|'corporate'|'audit'|'contact'>, id: string) { return this.remove(type,id); }

  async saveCar(car: Car) { return this.put('car', car, { status: car.status }); }
  async saveBranch(branch: Branch) { return this.put('branch', branch); }
  async saveBooking(booking: BookingDetails) { return this.put('booking', booking, { car_id: booking.car.id, pickup_at: `${booking.searchCriteria.pickupDate}T${booking.searchCriteria.pickupTime}:00+03:00`, return_at: `${booking.searchCriteria.returnDate}T${booking.searchCriteria.returnTime}:00+03:00`, status: booking.status, email: booking.customer.email, phone: booking.customer.phone }); }

  /** Atomically checks availability and inserts a booking. This is the production path used by the API. */
  async createBookingAtomic(booking: BookingDetails) {
    const pickup = `${booking.searchCriteria.pickupDate}T${booking.searchCriteria.pickupTime}:00+03:00`;
    const ret = `${booking.searchCriteria.returnDate}T${booking.searchCriteria.returnTime}:00+03:00`;
    if (!this.persistent) {
      if (!(await this.hasAvailability(booking.car.id, pickup, ret))) return null;
      return this.saveBooking(booking);
    }
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // Advisory lock serializes booking attempts for the same physical vehicle.
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [booking.car.id]);
      const conflict = await client.query(`SELECT 1 FROM app_entities WHERE entity_type='booking' AND car_id=$1 AND status NOT IN ('cancelled','completed') AND pickup_at < $3::timestamptz AND return_at > $2::timestamptz LIMIT 1`, [booking.car.id, pickup, ret]);
      if (conflict.rowCount) { await client.query('ROLLBACK'); return null; }
      const bookingId = booking.bookingId || `RUF-${Math.floor(10000 + Math.random()*90000)}`;
      const final: any = { ...booking, bookingId, createdAt: new Date().toISOString(), status: booking.status || 'confirmed' };
      const id = bookingId;
      const stored: any = { ...final };
      delete stored.id;
      await client.query(`INSERT INTO app_entities(entity_type,entity_id,data,car_id,pickup_at,return_at,status,email,phone) VALUES('booking',$1,$2,$3,$4,$5,$6,$7,$8)`, [id, stored, booking.car.id, pickup, ret, stored.status, stored.customer?.email || null, stored.customer?.phone || null]);
      await client.query('COMMIT');
      return final as BookingDetails;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  async saveUser(user: AppUser) { return this.put('user', user, { email: user.email, phone: user.phone }); }
  async saveBlog(post: BlogPost) { return this.put('blog', post); }
  async saveRoadside(ticket: RoadsideTicket) { return this.put('roadside', ticket, { status: ticket.status, phone: ticket.callerPhone }); }
  async saveInspection(report: InspectionReport) { return this.put('inspection', report); }
  async saveCorporate(inquiry: CorporateInquiry) { return this.put('corporate', inquiry, { status: inquiry.status, email: inquiry.email, phone: inquiry.phone }); }
  async saveAudit(log: SystemAuditLog) { return this.put('audit', log); }
  async saveContact(msg: ContactMessage) { return this.put('contact', msg, { status: msg.status, email: msg.email || null, phone: msg.phone }); }
  async deleteCar(id:string) { return this.remove('car',id); }
  async deleteBranch(id:string) { return this.remove('branch',id); }
  async deleteUser(id:string) { return this.remove('user',id); }
  async deleteBlog(id:string) { return this.remove('blog',id); }
  async deleteContact(id:string) { return this.remove('contact',id); }
  async deleteBooking(id:string) { return this.remove('booking',id); }

  async findBooking(id:string, secret?:string) {
    if (!this.persistent) {
      const all = await this.bookings(); const b = all.find(x=>x.bookingId.toUpperCase()===id.toUpperCase());
      if (!b) return null; if (secret && ![b.customer.phone,b.customer.idNumber,b.customer.email].includes(secret)) return null; return b;
    }
    const params:any[]=[id]; let sql='SELECT data FROM app_entities WHERE entity_type=\'booking\' AND entity_id=$1';
    if (secret) { sql += ' AND (phone=$2 OR email=$2 OR data->\'customer\'->>\'idNumber\'=$2)'; params.push(secret); }
    const {rows}=await this.pool.query(sql,params); return rows[0]?.data || null;
  }

  async hasAvailability(carId:string, pickup:string, ret:string, excludeBookingId?:string) {
    if (!this.persistent) {
      const all=await this.bookings(); return !all.some((b:any)=>b.car?.id===carId && b.status!=='cancelled' && b.bookingId!==excludeBookingId && `${b.searchCriteria.pickupDate}T${b.searchCriteria.pickupTime}` < ret && `${b.searchCriteria.returnDate}T${b.searchCriteria.returnTime}` > pickup);
    }
    const params:any[]=[carId,pickup,ret]; let sql=`SELECT 1 FROM app_entities WHERE entity_type='booking' AND car_id=$1 AND status NOT IN ('cancelled','completed') AND pickup_at < $3::timestamptz AND return_at > $2::timestamptz`;
    if(excludeBookingId){sql+=' AND entity_id<>$4';params.push(excludeBookingId)}
    const {rowCount}=await this.pool.query(sql,params); return rowCount===0;
  }

  async seedIfEmpty(seed: {cars:Car[];branches:Branch[];blog:BlogPost[];users:AppUser[];bookings:BookingDetails[];roadside:RoadsideTicket[];inspections:InspectionReport[];corporate:CorporateInquiry[];audits:SystemAuditLog[]}) {
    const count = this.persistent ? Number((await this.pool.query('SELECT count(*)::int AS n FROM app_entities')).rows[0].n) : [...this.memory.values()].reduce((n,m)=>n+m.size,0);
    if(count>0) return false;
    for(const x of seed.cars) await this.saveCar(x); for(const x of seed.branches) await this.saveBranch(x); for(const x of seed.blog) await this.saveBlog(x); for(const x of seed.users) await this.saveUser(x); for(const x of seed.bookings) await this.saveBooking(x); for(const x of seed.roadside) await this.saveRoadside(x); for(const x of seed.inspections) await this.saveInspection(x); for(const x of seed.corporate) await this.saveCorporate(x); for(const x of seed.audits) await this.saveAudit(x); return true;
  }
  async createSession(tokenHash: string, userId: string, role: string, ttlMs: number) {
    const expires = Date.now() + ttlMs;
    if (!this.persistent) { this.sessions.set(tokenHash, { userId, role, expiresAt: expires }); return; }
    await this.pool.query('INSERT INTO auth_sessions(token_hash,user_id,role,expires_at) VALUES($1,$2,$3,to_timestamp($4/1000.0))', [tokenHash,userId,role,expires]);
  }

  async getSession(tokenHash: string) {
    if (!this.persistent) { const s=this.sessions.get(tokenHash); if(!s || s.expiresAt < Date.now()){ this.sessions.delete(tokenHash); return null; } return s; }
    const {rows}=await this.pool.query('SELECT user_id AS "userId", role, expires_at AS "expiresAt" FROM auth_sessions WHERE token_hash=$1 AND revoked_at IS NULL AND expires_at>now()', [tokenHash]);
    if(!rows[0]) return null;
    return { userId: rows[0].userId, role: rows[0].role, expiresAt: new Date(rows[0].expiresAt).getTime() };
  }

  async revokeSession(tokenHash: string) {
    if (!this.persistent) { this.sessions.delete(tokenHash); return; }
    await this.pool.query('UPDATE auth_sessions SET revoked_at=now() WHERE token_hash=$1 AND revoked_at IS NULL', [tokenHash]);
  }

  async enqueueNotification(channel:string, recipient:string, template:string, payload:any) {
    if (!this.persistent) return null;
    const {rows}=await this.pool.query('INSERT INTO notification_outbox(channel,recipient,template,payload) VALUES($1,$2,$3,$4) RETURNING id', [channel,recipient,template,payload]);
    return rows[0]?.id || null;
  }

  async claimNotifications(limit=20) {
    if (!this.persistent) return [];
    const client=await this.pool.connect();
    try {
      await client.query('BEGIN');
      const {rows}=await client.query(`SELECT id,channel,recipient,template,payload,attempts FROM notification_outbox WHERE status='pending' AND available_at<=now() ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT $1`,[limit]);
      if(rows.length) await client.query(`UPDATE notification_outbox SET status='processing',attempts=attempts+1 WHERE id=ANY($1::uuid[])`,[rows.map((r:any)=>r.id)]);
      await client.query('COMMIT'); return rows;
    } catch(e){ await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  }

  async completeNotification(id:string, ok:boolean, error?:string) {
    if(!this.persistent) return;
    if(ok) await this.pool.query(`UPDATE notification_outbox SET status='sent',sent_at=now(),last_error=NULL WHERE id=$1`,[id]);
    else await this.pool.query(`UPDATE notification_outbox SET status=CASE WHEN attempts>=5 THEN 'failed' ELSE 'pending' END,available_at=now()+make_interval(secs => LEAST(3600, power(2,attempts)::int*10)),last_error=$2 WHERE id=$1`,[id,error||'Delivery failed']);
  }

  async claimIdempotency(key: string, scope: string): Promise<{claimed:boolean;response:any|null}> {
    if (!this.persistent) return {claimed:true,response:null};
    const existing = await this.pool.query('SELECT response FROM idempotency_keys WHERE key=$1 AND scope=$2 AND expires_at>now()', [key, scope]);
    if (existing.rows[0]) return {claimed:false,response:existing.rows[0].response ?? null};
    try {
      const inserted = await this.pool.query('INSERT INTO idempotency_keys(key,scope) VALUES($1,$2) ON CONFLICT(key,scope) DO NOTHING', [key, scope]);
      if (inserted.rowCount !== 1) {
        const row = await this.pool.query('SELECT response FROM idempotency_keys WHERE key=$1 AND scope=$2 AND expires_at>now()', [key, scope]);
        return {claimed:false,response:row.rows[0]?.response ?? null};
      }
      return {claimed:true,response:null};
    } catch { return {claimed:false,response:null}; }
  }

  async completeIdempotency(key: string, response: any) {
    if (!this.persistent) return;
    await this.pool.query('UPDATE idempotency_keys SET response=$3 WHERE key=$1 AND scope=$2', [key, 'booking-create', response]);
  }

  async recordPaymentEvent(provider: string, providerEventId: string, bookingId: string, status: string, payload: any) {
    if (!this.persistent) return true;
    const result = await this.pool.query(
      'INSERT INTO payment_events(provider,provider_event_id,booking_id,status,payload) VALUES($1,$2,$3,$4,$5) ON CONFLICT(provider,provider_event_id) DO NOTHING',
      [provider, providerEventId, bookingId, status, payload]
    );
    return result.rowCount === 1;
  }

}

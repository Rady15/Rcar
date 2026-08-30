import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const context = fs.readFileSync('src/context/AppContext.tsx','utf8');
const analytics = fs.readFileSync('src/components/dashboard/AdminAnalyticsView.tsx','utf8');
const audit = fs.readFileSync('src/components/dashboard/AdminAuditLogsView.tsx','utf8');


test('admin dashboard hydrates users and audit logs from the server', () => {
  assert.match(context, /apiGet<AppUser\[\]>\('\/api\/users'\)/);
  assert.match(context, /apiGet<SystemAuditLog\[\]>\('\/api\/logs'\)/);
  assert.match(context, /setUsersList\(ul\.value as AppUser\[\]\)/);
  assert.match(context, /setAuditLogs\(al\.value as SystemAuditLog\[\]\)/);
});

test('server-backed dashboard collections treat empty API responses as authoritative', () => {
  assert.doesNotMatch(context, /o\?\.status==='fulfilled' && o\.value\.length/);
  assert.doesNotMatch(context, /uc\?\.status==='fulfilled' && uc\.value\.length/);
  assert.doesNotMatch(context, /lt\?\.status==='fulfilled' && lt\.value\.length/);
  assert.doesNotMatch(context, /sp\?\.status==='fulfilled' && sp\.value\.length/);
  assert.doesNotMatch(context, /fq\?\.status==='fulfilled' && fq\.value\.length/);
  assert.doesNotMatch(context, /pp\?\.status==='fulfilled' && pp\.value\.length/);
  assert.doesNotMatch(context, /ao\?\.status==='fulfilled' && ao\.value\.length/);
});

test('analytics uses server stats and audit records instead of fabricated deltas/activity', () => {
  assert.match(analytics, /apiGet<any>\('\/api\/stats'\)/);
  assert.doesNotMatch(analytics, /delta: '\+8\.2%'/);
  assert.doesNotMatch(analytics, /delta: '\+18%'/);
  assert.doesNotMatch(analytics, /delta: '\+12%'/);
  assert.doesNotMatch(analytics, /Array\.from\(\{ length: Math\.max\(0, 4 - userBookings\.length\)/);
  assert.match(analytics, /auditLogs\.slice\(0, 4\)/);
});

test('audit view renders the actual audit-log schema', () => {
  assert.match(audit, /log\.actor/);
  assert.match(audit, /log\.category/);
  assert.match(audit, /log\.details/);
  assert.doesNotMatch(audit, /log\.performedBy/);
  assert.doesNotMatch(audit, /log\.target/);
});


test('production UI has no legacy domain or fake operational fallbacks', () => {
  const seo = fs.readFileSync('src/data/seoData.ts','utf8');
  const server = fs.readFileSync('server.ts','utf8');
  const modals = fs.readFileSync('src/components/dashboard/Modals.tsx','utf8');
  const bookings = fs.readFileSync('src/components/dashboard/AdminBookingsView.tsx','utf8');
  const fleet = fs.readFileSync('src/components/dashboard/AdminFleetView.tsx','utf8');
  const staff = fs.readFileSync('src/components/dashboard/StaffCounterView.tsx','utf8');
  const portal = fs.readFileSync('src/components/dashboard/CustomerPortalView.tsx','utf8');
  const usedCars = fs.readFileSync('src/views/UsedCarsView.tsx','utf8');
  assert.doesNotMatch(seo, /osb\.com\.sa|G-RIFAHA|GTM-RFH/);
  assert.doesNotMatch(server, /unsafe-eval/);
  for (const text of [modals, bookings, fleet, staff, portal, usedCars]) {
    assert.doesNotMatch(text, /أ ب ج 2025|ر ف ق 2025|2025-03-01|0501234567|0112208900|14500/);
  }
});

test('distributed rate limiter is persisted in production database', () => {
  const db = fs.readFileSync('backend/production-db.ts','utf8');
  const migration = fs.readFileSync('backend/migrations/003_final_production.sql','utf8');
  assert.match(db, /consumeRateLimit/);
  assert.match(db, /rate_limit_buckets/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS rate_limit_buckets/);
});

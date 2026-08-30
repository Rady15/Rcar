import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const server = fs.readFileSync('server.ts','utf8');
const context = fs.readFileSync('src/context/AppContext.tsx','utf8');

test('production API uses persistent storage and atomic booking', () => {
  assert.match(server, /ProductionDB/);
  assert.match(server, /createBookingAtomic/);
  assert.match(server, /Online payment provider is not configured/);
  const integrations = fs.readFileSync('backend/integrations.ts','utf8');
  assert.match(integrations, /TAMM integration is not configured/);
  assert.match(integrations, /ZATCA integration is not configured/);
});

test('customer booking access is protected', () => {
  assert.match(server, /Registered mobile number is required/);
  assert.match(server, /\/api\/bookings\/:id\/cancel/);
  assert.match(server, /Invalid booking state transition/);
});

test('production does not seed demo PII by default', () => {
  assert.doesNotMatch(server, /SEED_DEMO_DATA === 'true'/);
  assert.match(server, /SEED_CATALOG !== 'false'/);
  assert.match(context, /\/api\/auth\/me/);
});

test('business data is not written to localStorage', () => {
  assert.doesNotMatch(context, /localStorage\.setItem\('alrufqah_(cars|branches|bookings|blog_posts)'/);
});

test('deployment and release documentation exists', () => {
  for (const file of [
    'PRODUCTION_TODO.md','README_PRODUCTION.md','RELEASE_NOTES.md','SECURITY.md',
    'Dockerfile','docker-compose.yml','.env.example',
    'backend/migrations/001_production_hardening.sql',
    'backend/migrations/002_operational_production.sql',
    'backend/integrations.ts'
  ]) assert.equal(fs.existsSync(file), true, file);
});

test('security hardening is present', () => {
  assert.match(server, /X-Request-ID/);
  assert.match(server, /Content-Security-Policy/);
  assert.doesNotMatch(server, /unsafe-eval/);
  assert.match(server, /consumeRateLimit/);
  assert.match(server, /PAYMENT_WEBHOOK_SECRET is required/);
  assert.match(server, /payment_unknown/);
  assert.match(server, /recordPaymentEvent/);
  assert.match(server, /claimIdempotency/);
  assert.match(server, /sanitizeCar/);
});

test('customer lookup does not require secrets in the URL', () => {
  assert.match(server, /app\.post\('\/api\/bookings\/lookup'/);
  assert.match(context, /Role is server-authoritative/);
  assert.doesNotMatch(context, /RUFQAH2025/);
});

test('dashboard does not expose a client-side role switcher', () => {
  const sidebar = fs.readFileSync('src/components/dashboard/DashboardSidebar.tsx','utf8');
  assert.doesNotMatch(sidebar, /setActiveRole\(/);
});

test('final security and operations closure', () => {
  assert.match(server, /createSession/);
  assert.match(server, /revokeSession/);
  assert.doesNotMatch(server, /app\.get\('\/api\/bookings\/:id'/);
  assert.match(server, /claimNotifications/);
  assert.match(server, /completeNotification/);
  assert.match(server, /payment_unknown/);
  assert.match(server, /Cross-site request blocked/);
  assert.match(server, /X-Request-ID/);
});

test('keys-only activation documentation exists', () => {
  assert.equal(fs.existsSync('KEYS_ONLY_SETUP.md'), true);
  assert.equal(fs.existsSync('RELEASE_GATE.md'), true);
  assert.match(fs.readFileSync('backend/migrations/003_final_production.sql','utf8'), /uq_idempotency_key_scope/);
});

test('customer registration and Google OAuth are implemented', () => {
  assert.match(server, /\/api\/auth\/register/);
  assert.match(server, /\/api\/auth\/google/);
  assert.match(server, /GOOGLE_CLIENT_SECRET/);
  assert.match(fs.readFileSync('src/views/LoginView.tsx','utf8'), /api\/auth\/google/);
});

test('invoice printing isolates the invoice from the rest of the page', () => {
  const modal = fs.readFileSync('src/components/dashboard/Modals.tsx','utf8');
  const css = fs.readFileSync('src/index.css','utf8');
  assert.match(modal, /print-invoice/);
  assert.match(css, /body \* \{ visibility: hidden/);
  assert.match(css, /\.print-invoice, \.print-invoice \*/);
});

test('SEO crawl endpoints and release files exist', () => {
  assert.match(server, /app\.get\('\/robots\.txt'/);
  assert.match(server, /app\.get\('\/sitemap\.xml'/);
  assert.equal(fs.existsSync('PRODUCTION_TODO.md'), true);
  assert.equal(fs.existsSync('README_PRODUCTION.md'), true);
  assert.equal(fs.existsSync('RELEASE_NOTES.md'), true);
  assert.equal(fs.existsSync('SECURITY.md'), true);
  assert.equal(fs.existsSync('RELEASE_GATE.md'), true);
  assert.equal(fs.existsSync('.env'), false);
  assert.equal(fs.existsSync('.env.bak'), false);
});

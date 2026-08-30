import test from 'node:test';
import assert from 'node:assert/strict';

const required = process.env.E2E_REQUIRED === '1';
const base = (process.env.E2E_BASE_URL || '').replace(/\/$/, '');
if (required && !base) throw new Error('E2E_BASE_URL is required when E2E_REQUIRED=1');
const email = process.env.E2E_ADMIN_EMAIL || '';
const password = process.env.E2E_ADMIN_PASSWORD || '';

const request = async (path, options = {}) => {
  const res = await fetch(`${base}${path}`, options);
  const text = await res.text();
  let body = null; try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { res, body };
};

test('production API smoke: public health/catalog endpoints', { skip: !base }, async () => {
  const health = await request('/api/health');
  assert.equal(health.res.status, 200);
  assert.equal(health.body.status, 'ok');
  assert.equal(health.body.database, 'postgresql');

  const ready = await request('/api/ready');
  assert.equal(ready.res.status, 200);
  assert.equal(ready.body.ready, true);

  for (const endpoint of ['/api/cars', '/api/branches', '/api/categories', '/api/blog', '/api/content/offers', '/api/content/used-cars']) {
    const result = await request(endpoint);
    assert.equal(result.res.status, 200, endpoint);
    assert.ok(Array.isArray(result.body), endpoint);
  }
});

test('production API smoke: protected admin endpoints reject anonymous access', { skip: !base }, async () => {
  for (const endpoint of ['/api/users', '/api/logs', '/api/stats']) {
    const result = await request(endpoint);
    assert.equal(result.res.status, 401, endpoint);
  }
});

test('production API E2E: authenticated admin can read dashboard data', { skip: !base || !email || !password }, async () => {
  const login = await request('/api/auth/login', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  assert.equal(login.res.status, 200);
  const cookie = login.res.headers.get('set-cookie');
  assert.ok(cookie, 'login did not issue a session cookie');

  const headers = { cookie: cookie.split(';')[0] };
  for (const endpoint of ['/api/auth/me', '/api/users', '/api/logs', '/api/stats']) {
    const result = await request(endpoint, { headers });
    assert.equal(result.res.status, 200, endpoint);
  }

  const users = await request('/api/users', { headers });
  const logs = await request('/api/logs', { headers });
  const stats = await request('/api/stats', { headers });
  assert.ok(Array.isArray(users.body));
  assert.ok(Array.isArray(logs.body));
  assert.equal(typeof stats.body.totalFleet, 'number');
  assert.equal(typeof stats.body.activeRentals, 'number');
});

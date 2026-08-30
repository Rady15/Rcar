# Production Release Notes

## Final hardening pass

### Data integrity
- Dashboard Users now reads the authoritative server collection from `/api/users`.
- Audit Logs now reads `/api/logs` on hydration.
- Analytics now reads `/api/stats` for server-derived metrics.
- Empty server responses are preserved as empty state instead of falling back to mock catalog data.

### SEO
- Removed legacy `osb.com.sa` references from source SEO configuration.
- Removed legacy tracking IDs and hard-coded legacy sitemap/target URLs.
- SEO client state is empty/non-indexing until the server configuration is loaded; failed requests do not expose stale seed data.
- Production seed derives canonical and sitemap URLs from `APP_URL`.

### Production UI hygiene
- Removed fake plate-number fallbacks.
- Removed fake booking date fallbacks.
- Removed demo phone defaults.
- Removed fake inspection odometer defaults.

### Security / operations
- Removed `unsafe-eval` from production CSP.
- Production rate limiting is PostgreSQL-backed and shared across application instances.
- Added cleanup for expired rate-limit buckets.
- Added API E2E smoke coverage for public, protected, and authenticated dashboard paths.

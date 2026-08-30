# Production Deployment

1. Copy `.env.example` to `.env` and fill secrets.
2. Never commit `.env`.
3. Run migrations against PostgreSQL.
4. Build with `npm run build`.
5. Start with `npm start`.
6. Configure Google OAuth redirect to `/api/auth/google/callback`.
7. Verify `/robots.txt` and `/sitemap.xml`.

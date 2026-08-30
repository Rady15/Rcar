# Al-Rufqah Production Integration Fixes

## Implemented

- Replaced public Fleet/Branches/Offers/Used Cars/Loyalty/Subscriptions/FAQ pages with API-backed AppContext data.
- Seeded catalog content into PostgreSQL `app_entities` when missing.
- Added a unified CMS API for offers, used cars, loyalty, subscriptions, FAQ, protection plans and add-ons.
- Added an Admin **Site Content & Settings** center for managing the catalog data stored in the database.
- Fixed Fleet status persistence so Dashboard changes are written to the backend.
- Added real Corporate RFP submission from the public form to `/api/corporate`.
- Added Used-Car Test Drive lead persistence and an Admin list endpoint.
- Made promo validation and quote discounts database-driven when matching active offers.
- Made booking protection plans and add-ons database-driven.
- Booking creation now sends the backend `Idempotency-Key` header.
- Added Admin payment gateway configuration UI.
- Payment API key and webhook secret are encrypted at rest with a key derived from `AUTH_SECRET` and are never returned to the browser.
- Payment settings can be controlled from Dashboard without editing server source files.
- Payment runtime uses Dashboard credentials first and environment variables as fallback.
- SEO settings are persisted in the database instead of browser-only localStorage and are hydrated for the application.
- Removed the uploaded `.env` from the release archive to avoid shipping credentials.

## Deployment

The repository uses Docker to build the production `dist` bundle. After extracting the project:

1. Create `.env` from `.env.example` and supply real production values.
2. Run `npm ci`.
3. Run `npm run typecheck`.
4. Run `npm test`.
5. Run `npm run build`.
6. Run the production container with `docker compose up -d --build`.

The current analysis environment could not complete `npm ci` because package downloads did not finish within the execution window, so the final archive contains source changes and requires a normal dependency install/build on the deployment machine.

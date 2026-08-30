# Payment configuration

Payment credentials can be configured by an administrator from **Dashboard → Site Content & Settings → Payments**.

- Provider and API URL are configurable.
- Public key is safe to expose to the frontend only where the provider requires it.
- Secret API key and webhook secret are encrypted at rest using `AUTH_SECRET` and are never returned to the browser.
- Test/Live mode and enable/disable are controlled from the dashboard.
- If dashboard credentials are absent, the server can still fall back to `PAYMENT_API_URL`, `PAYMENT_API_KEY`, and `PAYMENT_WEBHOOK_SECRET` environment variables.
- Always configure the payment provider webhook to call `/api/payments/webhook` and use the configured webhook secret.

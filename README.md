
## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
3. Run the app:
   `npm run dev`


## Final production closure
This package contains the application-level production hardening, atomic booking path, server-authoritative pricing, authentication/authorization, secure customer lookup/cancellation, payment webhook transport, TAMM/ZATCA fail-closed transports, operational tables, deployment files and release documentation.

Private third-party credentials/contracts/certificates cannot be embedded in source code. Configure them in `.env` and validate them in the provider sandbox before enabling live transactions.

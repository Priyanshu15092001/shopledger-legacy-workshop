# ShopLedger

## Stack
- Node.js CommonJS application using Express 4 and body-parser for JSON requests.
- Browser UI is static HTML, CSS, and JavaScript served from `public/`.
- Persistent application data is stored in `data/db.json` through `lib/store.js`.

## Module map
- `routes/customers.js` — lists customers and settlements; records Khata settlements.
- `routes/orders.js` — lists, retrieves, places, and cancels orders.
- `routes/products.js` — lists products and active coupons.
- `routes/reports.js` — dashboard, GST reconciliation, pricing preview, and admin export endpoints.
- `lib/coupons.js` — normalizes, validates, and calculates coupon discounts from config.
- `lib/dates.js` — formats today’s date, normalizes date keys, and derives fiscal years.
- `lib/inventory.js` — finds products, checks/reserves/releases stock, and summarizes inventory.
- `lib/invoice.js` — computes invoice figures and renders printable invoice HTML.
- `lib/ledger.js` — customer lookup/listing, Khata order debits/reversals, and settlements.
- `lib/orders.js` — adds, finds, cancels, and filters orders.
- `lib/pricing.js` — calculates subtotals, discounts, line GST, and order totals.
- `lib/reports.js` — prepares dashboard summaries and compares invoice figures with stored orders.
- `lib/store.js` — reads/writes `data/db.json` and appends audit entries.
- `lib/tax.js` — resolves GST rates and splits tax into CGST and SGST.

## Commands
- Start the app: `node server.js` (also available as `npm start`).
- Run tests: `node --test`.
- `package.json` currently has no test suite configured; its `npm test` script is a placeholder that exits with an error.

## Rules
1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; they use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket
- Invoice total and GST breakdown do not match what the customer was billed.
- Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).

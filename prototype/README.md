# CardDemo — Interactive Prototype

A complete, clickable HTML/CSS/JavaScript prototype for the **CardDemo** mainframe credit card management application. Covers all 10 modules with list, detail, and form screens.

## 🚀 Quick Start

Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari). No server or build step required.

**Demo Credentials:**
| User ID | Password | Type |
|---------|----------|------|
| ADMIN001 | ADMIN001 | Admin |
| USER0001 | PASS0001 | Regular User |
| USER0002 | PASS0002 | Regular User |

> All credentials are case-insensitive for the demo.

---

## 📁 File Structure

```
prototype/
 index.html                      # Login screen (also: login.html)
 dashboard.html                  # Main dashboard
 accounts-list.html              # Account list with search/filter
 accounts-detail.html            # Account detail + customer info + cards
 accounts-form.html              # New/Edit account
 credit-cards-list.html          # Credit card list
 credit-cards-detail.html        # Card detail with visual + transactions
 credit-cards-form.html          # New/Edit credit card
 transactions-list.html          # Transaction list with filter
 transactions-detail.html        # Transaction detail
 transactions-form.html          # New transaction (with Copy Last)
 billing-form.html               # Make a payment (2-step: lookup → confirm)
 billing-list.html               # Payment history
 reports-list.html               # Report list
 reports-form.html               # Generate report
 reports-detail.html             # Report detail + preview
 users-list.html                 # User management (admin)
 users-detail.html               # User detail
 users-form.html                 # New/Edit user
 batch-list.html                 # Batch jobs monitor + run simulation
 batch-detail.html               # Batch job detail + SYSOUT log
 authorization-list.html         # Authorization list + fraud flagging
 authorization-detail.html       # Authorization detail
 transaction-types-list.html     # Transaction type codes
 transaction-types-detail.html   # Type detail with categories
 transaction-types-form.html     # New/Edit type + dynamic categories
 styles/
   ├── reset.css                   # CSS reset
   ├── variables.css               # CSS custom properties (design tokens)
   ├── global.css                  # App layout, header, sidebar, nav
   └── components.css              # BEM components (buttons, cards, forms, tables…)
 scripts/
   ├── mock-data.js                # Mock data + CRUD helpers (all global)
   └── utils.js                   # Shared utilities (all global)
 assets/
    └── images/
        └── placeholder.svg
```

---

## 🗂️ Modules Covered

| Module | Pages | Key Features |
|--------|-------|-------------|
| **Authentication** | login/index | Validates against mock users, routes Admin vs User |
| **Accounts** | list, detail, form | Search, filter by status/group, optimistic-lock update simulation |
| **Credit Cards** | list, detail, form | Visual card UI, activate/deactivate, pagination |
| **Transactions** | list, detail, form | Filter by type, Copy Last Transaction button |
| **Billing** | form (2-step), list | Balance lookup → confirm payment workflow |
| **Reports** | list, form, detail | Report type selection, date params, simulate generation |
| **User Management** | list, detail, form | Admin CRUD, delete with confirmation modal |
| **Batch Processing** | list, detail | Run simulation with 2s delay, SYSOUT log viewer |
| **Authorizations** | list, detail | Fraud flag/unflag, status badges |
| **Transaction Types** | list, detail, form | Dynamic categories, admin-only |

---

## 🎨 Design System

All colors are CSS custom properties — never hardcoded hex values.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1976D2` | Header, buttons, active nav, links |
| `--color-secondary` | `#424242` | Cancel buttons, secondary actions |
| `--color-surface` | `#FFFFFF` | Card backgrounds |
| `--color-background` | `#F5F5F5` | Page background |
| `--color-success` | `#388E3C` | Active status, positive amounts |
| `--color-warning` | `#F57C00` | Pending status, admin badges |
| `--color-error` | `#D32F2F` | Inactive status, negative amounts, errors |

---

## 📊 Mock Data

All data lives in `scripts/mock-data.js` as a global `mockData` object:

- **22 users** (2 Admin + 20 Regular)
- **20 accounts** (mix of Active/Inactive, STANDARD/GOLD/PREMIUM/PLATINUM groups)
- **10 customers** (with full address, SSN, FICO score)
- **21 credit cards** (linked to accounts)
- **22 transactions** (various types and merchants)
- **5 payments** (billing history)
- **5 reports** (different statuses)
- **10 batch jobs** (with status and RC)
- **8 authorizations** (including fraud-flagged)
- **7 transaction types** (with categories)

CRUD operations (`createItem`, `updateItem`, `deleteItem`) write to in-memory `mockData` — changes persist for the browser session.

---

## 🔧 Technical Notes

- **No frameworks** — vanilla HTML5, CSS3, ES6+ (no imports/exports)
- **No CDN** — fully self-contained, works offline
- **No build step** — open directly in browser
- **Navigation** — standard `<a href>` links between HTML files
- **Responsive** — sidebar collapses on mobile via hamburger toggle
- **Accessibility** — skip links, ARIA roles, semantic HTML

---

## 📋 Assumptions

1. Authentication session uses `mockData.currentUser` (in-memory only, resets on page reload)
2. The login page redirects to `dashboard.html` on success regardless of user type (both see all navigation in prototype)
3. Batch job "Run" simulates execution with a 2-second delay; RC=0000 (~90%) or RC=0008 (~10%)
4. Report "Generate" creates a Pending item; clicking "Simulate Completion" marks it Done
5. Interest rate formula `(bal × rate) / 1200` is displayed in account detail but not recalculated in real-time
6. Optimistic locking is simulated — the "data changed by another user" scenario is not demo-able in a single-user static prototype
7. Card CVV is masked/not displayed (security best practice)
8. Passwords shown as `••••••••` in user detail (never revealed)

# FlowMesh Frontend

The web client for **FlowMesh Store** — a full-stack e-commerce demo that lets authenticated users browse products, manage a shopping cart, pay via an external payment provider, and track orders through payment and shipping stages.

This repository is the **Next.js frontend**. It communicates with a separate FlowMesh backend API (not included in this repo) over HTTP with cookie-based authentication.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Routes & Pages](#routes--pages)
- [Authentication](#authentication)
- [Shopping Cart](#shopping-cart)
- [Order Lifecycle](#order-lifecycle)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [UI & Styling](#ui--styling)
- [Configuration](#configuration)
- [Deployment](#deployment)

---

## Features

### Authentication
- **Login** (`/login`) — username/password sign-in with client-side validation
- **Signup** (`/signup`) — account creation with email validation and password confirmation
- **Protected routes** — all store pages require a valid auth cookie; unauthenticated users are redirected to `/login`
- **Session cookies** — auth tokens are stored in an HTTP-only cookie (`flowmesh_token`) set by the backend on login/register

### Product Catalog
- Browse products fetched from the backend API
- Responsive product grid with images, prices, and product IDs
- Loading skeletons and error states for failed API requests
- Add/remove items from cart directly from the product card

### Shopping Cart
- Client-side cart persisted in `localStorage` under the key `flowmesh_cart`
- Cart badge and item count shown in the store and orders navigation
- Checkout page with line items, totals, remove/clear actions, and a **Pay now** button

### Checkout & Payments
- Creates an order via `POST /orders` with the list of product IDs in the cart
- Redirects the user to an external **payment URL** returned by the backend (e.g. Stripe Checkout)
- **Success page** (`/success?order_id=...`) — confirms payment and clears the cart
- **Cancel page** (`/cancel?order_id=...`) — shown when the user abandons checkout

### Order Tracking
- **Orders list** (`/orders`) — all orders for the authenticated user
- **Order progress UI** — visual stepper through Payment → Confirmed → Shipped → Delivered
- Status badges with color coding (pending, failed, completed)
- Per-order details: products, total amount, user ID, and live status label

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) (Radix Nova style) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | [Geist](https://vercel.com/font) & Geist Mono via `next/font` |
| Notifications | [Sonner](https://sonner.emilkowal.ski) (toast library, wired via UI component) |
| Theming | CSS variables + `next-themes` support in dependencies |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FlowMesh Frontend                        │
│                      (Next.js App)                           │
├─────────────────────────────────────────────────────────────┤
│  (auth) routes          │  (protected) routes               │
│  ├── /login             │  ├── /          Product catalog     │
│  └── /signup            │  ├── /checkout  Cart & payment      │
│                         │  ├── /orders    Order history       │
│                         │  ├── /success   Payment success     │
│                         │  └── /cancel    Payment cancelled   │
├─────────────────────────────────────────────────────────────┤
│  Client state: useCart (localStorage)                        │
│  Server auth:  cookie check in (protected)/layout.tsx        │
└──────────────────────────┬──────────────────────────────────┘
                           │ fetch(..., { credentials: "include" })
                           ▼
              ┌────────────────────────────┐
              │   FlowMesh Backend API     │
              │   (NEXT_PUBLIC_API_URL)    │
              └────────────────────────────┘
```

The app uses **Next.js route groups** to separate public auth pages from protected store pages. Protected routes are guarded server-side by reading the `flowmesh_token` cookie before rendering children.

All API calls from the browser use `credentials: "include"` so session cookies are sent automatically.

---

## Project Structure

```
flowmesh-frontend/
├── app/
│   ├── layout.tsx                 # Root layout (fonts, metadata)
│   ├── globals.css                # Tailwind + shadcn theme tokens
│   ├── (auth)/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Signup page
│   └── (protected)/
│       ├── layout.tsx             # Auth guard (redirects to /login)
│       ├── page.tsx               # Product catalog (home)
│       ├── checkout/page.tsx      # Checkout
│       ├── orders/page.tsx        # Order history
│       ├── success/page.tsx       # Post-payment success
│       └── cancel/page.tsx        # Post-payment cancel
├── components/
│   ├── login-form.tsx             # Login form + API call
│   ├── signup-form.tsx            # Registration form + API call
│   ├── checkout-cart.tsx          # Cart review + order creation
│   ├── order-card.tsx             # Single order in list view
│   ├── order-details.tsx          # Order summary card
│   ├── order-status-progress.tsx  # 4-step progress stepper
│   ├── order-page-shell.tsx       # Shared layout for success/cancel
│   ├── order-page-fallback.tsx    # Suspense loading skeleton
│   ├── orders-page-content.tsx    # Orders list page content
│   ├── success-page-content.tsx   # Success page logic
│   ├── cancel-page-content.tsx    # Cancel page logic
│   └── ui/                        # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       ├── skeleton.tsx
│       └── ...
├── hooks/
│   ├── use-cart.ts                # Cart state + localStorage sync
│   └── use-orders.ts              # Fetch orders, optional single-order filter
├── lib/
│   ├── order.ts                   # Order types, status mapping, progress logic
│   ├── product.ts                 # Product type, price/name formatters
│   └── utils.ts                   # cn() helper, TOKEN_KEY constant
├── public/                        # Static assets
├── components.json                # shadcn/ui configuration
├── next.config.ts                 # Next.js config (image domains)
├── tsconfig.json                  # TypeScript config (@/* path alias)
└── package.json
```

---

## Routes & Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Sign in with username and password |
| `/signup` | Public | Create a new account |
| `/` | Protected | Product catalog — main store homepage |
| `/checkout` | Protected | Review cart and initiate payment |
| `/orders` | Protected | View all orders with status progress |
| `/success` | Protected | Payment confirmation (`?order_id=` query param) |
| `/cancel` | Protected | Abandoned checkout (`?order_id=` query param) |

---

## Authentication

1. User submits credentials on `/login` or `/signup`.
2. Frontend sends a `POST` request to the backend (`/auth/login` or `/auth/register`).
3. On success, the backend sets a cookie named **`flowmesh_token`** (defined as `TOKEN_KEY` in `lib/utils.ts`).
4. The `(protected)/layout.tsx` server component reads this cookie on every protected request.
5. If the cookie is missing, the user is redirected to `/login`.

Auth forms include basic client-side validation:
- Login: username and password required; password length check
- Signup: valid email format, matching passwords, duplicate account error handling

> **Note:** "Login with Google" and "Sign up with Google" buttons are present in the UI but are not wired to OAuth flows.

---

## Shopping Cart

The cart is managed entirely on the client via the `useCart` hook:

- **Storage key:** `flowmesh_cart` in `localStorage`
- **Hydration-safe:** `isHydrated` flag prevents SSR/client mismatch before reading storage
- **Operations:** `addToCart`, `removeFromCart`, `clearCart`, `isInCart`, `cartTotal`
- **Duplicate prevention:** adding the same product twice is ignored
- **Auto-clear:** cart is cleared on the success page after payment

Cart data is **not** synced to the server until checkout, when product IDs are sent in the order creation request.

---

## Order Lifecycle

Orders progress through a defined set of backend statuses. The frontend maps each status to a user-friendly label and a 4-stage visual progress bar.

### Order Statuses

| Backend Status | UI Label | Progress |
|----------------|----------|----------|
| `PAYMENT_PENDING` | Awaiting payment | 12% — Payment step active |
| `PAYMENT_FAILED` | Payment failed | 0% — Payment step failed |
| `PAYMENT_COMPLETED` | Payment confirmed | 37% — Confirmed step active |
| `SHIPPING_PENDING` | Preparing shipment | 62% — Shipped step active |
| `SHIPPING_FAILED` | Shipment failed | 50% — Shipped step failed |
| `SHIPPING_COMPLETED` | Out for delivery | 87% — Delivered step active |
| `COMPLETED` | Delivered | 100% — All steps complete |

### Progress Stages

The UI displays four stages: **Payment → Confirmed → Shipped → Delivered**

Logic lives in `lib/order.ts` (`getOrderProgress`, `getOrderStatusVariant`, `shouldDisplayOrderStatus`).

### Order Data Model

```typescript
type Order = {
  id: string;
  products: string[];   // product IDs, e.g. "prod-abc123"
  totalAmount: number;
  userId: string;
  status: OrderStatus;
};

type Product = {
  id: string;
  price: number;
  imageUrl: string;
};
```

---

## API Integration

All requests target `process.env.NEXT_PUBLIC_API_URL` and include cookies.

| Method | Endpoint | Used By | Purpose |
|--------|----------|---------|---------|
| `POST` | `/auth/login` | Login form | Authenticate user |
| `POST` | `/auth/register` | Signup form | Create account |
| `GET` | `/products` | Home page | List catalog products |
| `GET` | `/orders` | Orders hook | List user's orders |
| `POST` | `/orders` | Checkout | Create order + get payment URL |

### Checkout flow

```
User clicks "Pay now"
       │
       ▼
POST /orders  { products: ["prod-...", ...] }
       │
       ▼
Response: { paymentUrl: "https://..." }
       │
       ▼
window.location.href = paymentUrl   (redirect to payment provider)
       │
       ├── Success → /success?order_id=<id>  (cart cleared)
       └── Cancel  → /cancel?order_id=<id>
```

The backend is expected to handle payment webhooks and update order status asynchronously. The frontend polls order state by re-fetching `/orders` when viewing order pages.

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required — base URL of the FlowMesh backend API
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production, point this to your deployed API (e.g. `https://flowmesh-api.onrender.com`).

> `.env*` files are gitignored. Do not commit secrets or environment-specific URLs unless intentional.

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** (or yarn/pnpm/bun)
- A running **FlowMesh backend API** with CORS and cookie settings configured for this frontend's origin

### Install & Run

```bash
# Clone the repository
git clone <repository-url>
cd flowmesh-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local   # if an example exists, otherwise create manually
# Set NEXT_PUBLIC_API_URL in .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login` until you authenticate.

### Production Build

```bash
npm run build
npm start
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server with hot reload |
| `build` | `npm run build` | Create optimized production build |
| `start` | `npm start` | Serve the production build |
| `lint` | `npm run lint` | Run ESLint |

---

## UI & Styling

- **Design system:** shadcn/ui with the **Radix Nova** style preset
- **Theme:** CSS custom properties in `app/globals.css` (neutral base color)
- **Dark mode:** CSS variant configured (`@custom-variant dark`); `next-themes` is available in dependencies
- **Responsive:** mobile-first layouts with `sm:`, `lg:` breakpoints
- **Loading states:** skeleton components for products, cart, orders, and payment pages
- **Icons:** Lucide React throughout navigation and status indicators
- **Toasts:** Sonner component available in `components/ui/sonner.tsx`

### Key UI Components

| Component | Purpose |
|-----------|---------|
| `OrderStatusProgress` | 4-step stepper with progress bar and failure states |
| `OrderCard` | Full order card for the orders list |
| `OrderDetails` | Compact order summary for success/cancel pages |
| `CheckoutCart` | Cart line items, total, and pay button |
| `ProductCard` (inline in home page) | Product image, price, add-to-cart |

---

## Configuration

### `next.config.ts`

Remote image domains allowed for `next/image`:

- `localhost`
- `flowmesh-api.onrender.com`
- `picsum.photos`

Add additional domains here if your backend serves product images from other hosts.

### `tsconfig.json`

Path alias `@/*` maps to the project root for clean imports (e.g. `@/components/ui/button`).

### `components.json`

shadcn/ui configuration — style, aliases, and Tailwind integration. Use the shadcn CLI to add new components:

```bash
npx shadcn@latest add <component-name>
```

---

## Deployment

This is a standard Next.js application and can be deployed to [Vercel](https://vercel.com), Render, or any Node.js hosting platform.

**Before deploying:**

1. Set `NEXT_PUBLIC_API_URL` to your production API URL in the hosting provider's environment settings.
2. Ensure the backend allows your frontend origin in CORS and sets cookies with the correct `SameSite` / `Secure` attributes for cross-origin or same-site deployment.
3. Add any new image host domains to `next.config.ts` if needed.

---

## Related Projects

This frontend is designed to work with the **FlowMesh backend API**, which provides authentication, product catalog, order management, and payment integration. Run both services locally for full end-to-end testing.

---

## License

Private project (`"private": true` in `package.json`).

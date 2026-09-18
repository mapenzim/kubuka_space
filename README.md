# Kubuka Space PBC

Kubuka Space PBC is a full-stack business platform built to help organisations discover digital products, purchase services, publish useful content, manage professional profiles, and communicate with the Kubuka team in real time.

The application combines a public marketing website and online store with authenticated customer profiles and a role-protected administration workspace.

## Website features

### Public experience

- A responsive landing page presenting Kubuka Space, its services, featured solutions, and contact options.
- A product store organised by category, including helpful fallback content when a category has no available products.
- Shopping cart, delivery details, checkout, and printable order receipts.
- A fixed **$20 discount per unit** on products priced above **$250**. Prices and totals are recalculated on the server during checkout.
- A blog with author pages and visible publication dates.
- Contact and real-time support chat for guests and signed-in users.
- Automatic chat acknowledgement, typing and presence indicators, and live message updates with a polling fallback.
- A purchase-gated code snippet marketplace for HTML, React, and Python deliveries.
- Authentication, account navigation, light/dark themes, and responsive layouts.
- Privacy, cookie, licence, and terms pages.

### Customer profiles

Signed-in users can maintain a professional profile containing:

- Personal and biographical information.
- Skills with add, edit, and delete controls.
- Work experience using month/year dates, including a **Present** option for current roles.
- Work experience sorted with current positions first, followed by the newest entries.
- Publications and order history.

### Administration workspace

The protected `/admin` area provides:

- Dashboard summaries and operational views.
- User creation, editing, suspension, archiving, and deletion.
- Product, category, stock, and order management.
- Blog post creation and editing with a rich-text editor.
- A support inbox for guest and customer conversations.
- Snippet product creation, customer requirement tracking, manual review, versioning, and secure delivery through chat.
- Conversation archiving and deletion that is reflected in the customer chat interface.
- Administrative profile and application settings.

## Roles and access rules

The application supports four roles:

| Role | Purpose |
| --- | --- |
| `SUPERUSER` | The single owner-level account. It is created during initial seeding and can add other administrators. |
| `ADMIN` | Manages users, products, orders, posts, and customer conversations. |
| `EDITOR` | Provides restricted content-management access where permitted. |
| `USER` | Uses the public store, profile, orders, and support chat. |

Important account rules:

- Only one superuser may exist.
- The superuser is excluded from the standard dashboard user list.
- Other administrator accounts are created by the superuser.
- An administrator cannot change their own role.
- A user's email address is immutable after account creation.
- Suspended and archived account states are enforced by the authentication and administration flows.

## Checkout status

Checkout currently completes orders locally so the full cart-to-receipt flow can be tested before the payment gateway is enabled. The server validates the customer, address, cart contents, prices, discounts, and stock inside a database transaction; it then records the order as paid using the temporary payment method and redirects to the receipt.

Paynow configuration is scaffolded in the project, but live Paynow payment processing still needs to be connected before accepting real payments.

## Technology

- [Next.js](https://nextjs.org/) 16 with the App Router and Turbopack
- React 19 and TypeScript
- PostgreSQL with Prisma ORM
- Auth.js/NextAuth credentials authentication with JWT sessions
- Tailwind CSS 4 and Radix UI primitives
- Lexical rich-text editing for blog content
- Server-Sent Events with polling fallback for support chat
- Cloudflare Turnstile for anti-bot form protection
- Vercel Analytics and Speed Insights

## Local Ollama snippet workflow

Ollama generation stays on the developer's machine and is never called by Vercel:

1. Ensure Ollama is running. The local connection and model are configured in `ollama.config.json`.
2. Export the request brief from production or development as a `.json` file.
3. In local development, open `/admin/snippets`, choose **Choose brief JSON** on the matching request, and select that exported file.
4. Once the filename is confirmed, select **Generate with Ollama**.
5. Wait for local generation to finish, then review every populated file in the delivery dialog before sending it to chat.

The generation button is intentionally absent in production. The export/import workflow remains available as a manual fallback:

```bash
pnpm snippet:generate -- ~/Downloads/snippet-request-ID.json
```

Export the customer's Ollama brief, run the command, review and test the generated `.delivery.json`, then import it through the request's delivery dialog.

The configured model is `qwen2.5-coder:7b` at `http://127.0.0.1:11434`. `OLLAMA_URL` and `OLLAMA_MODEL` environment variables can still temporarily override the configuration. Generated code remains local until an administrator explicitly delivers it.

## Getting started

### Requirements

- Node.js 20 or newer
- pnpm 11
- A PostgreSQL database

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the environment

Create a `.env` file in the project root. Replace every example value with a secure value for your environment.

```bash
DATABASE_URL_KUBUKA="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_SECRET="replace-with-a-long-random-secret"

NEXT_PUBLIC_TURNSTILE_SITE_KEY_SIGNUP_FORM="your-turnstile-site-key"
TURNSTILE_SECRET_KEY_SIGNUP_FORM="your-turnstile-secret-key"
TURNSTILE_SECRET_KEY_MESSAGE_FORM="your-message-form-secret-key"

SEED_SUPERUSER_NAME="Your Name"
SEED_SUPERUSER_EMAIL="admin@example.com"
SEED_SUPERUSER_PASSWORD="replace-with-a-strong-password"

# Optional until live Paynow processing is enabled
PAYNOW_INTEGRATION_ID=""
PAYNOW_INTEGRATION_KEY=""
PAYNOW_RESULT_URL=""
PAYNOW_RETURN_URL=""
```

`NEXTAUTH_SECRET` can be used as a fallback when `AUTH_SECRET` is not set. Do not commit `.env` files or production credentials.

### Local access to production snippet requests

The local developer administrator can load the same snippet requests created on Vercel without exposing the database URL to the browser. Add these values only to the ignored local `.env.local` file:

```bash
DEV_PRODUCTION_DATABASE_URL_KUBUKA="copy-the-server-side-DATABASE_URL_KUBUKA-value-from-vercel"
DEV_ADMIN_EMAIL="the-single-developer-admin@example.com"
```

The developer administrator must also exist as an active `ADMIN` or `SUPERUSER` in the local database. When the bridge is enabled:

- Only that exact local administrator email may open the production snippet connection.
- `/admin/snippets` reads current products and requests from the production database and displays **Live production requests**.
- Generation status, reviewed deliveries, and the delivery marker sent to the customer's existing conversation are written back to the same production records.
- Other local pages and actions continue using `DATABASE_URL_KUBUKA`; they cannot use this production connection.
- Adding store products is disabled in this mode to keep the bridge limited to fulfilment.
- Prisma migrations and seeding never use the bridge URL.

Never prefix either variable with `NEXT_PUBLIC_`, commit them, or paste their values into client-side code.

### 3. Prepare the database

```bash
pnpm db:setup
```

This generates the Prisma client, applies committed migrations, and seeds the initial superuser, roles, categories, and starter products. Set the `SEED_SUPERUSER_*` variables before running it for the first time.

### 4. Start development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the local development server with Turbopack. |
| `pnpm lint` | Runs ESLint across the project. |
| `pnpm build` | Generates the Prisma client and creates a production build. |
| `pnpm start` | Starts the compiled production server. |
| `pnpm db:generate` | Regenerates the Prisma client. |
| `pnpm db:migrate` | Applies committed database migrations. |
| `pnpm db:seed` | Seeds roles, the initial superuser, categories, and starter products. |
| `pnpm db:setup` | Runs generation, migration, and seeding in sequence. |

## Main routes

| Route | Description |
| --- | --- |
| `/` | Marketing homepage and featured solutions. |
| `/store` | Product catalogue and category browsing. |
| `/cart` | Shopping cart. |
| `/checkout` | Authenticated checkout and delivery information. |
| `/posts` | Published blog posts. |
| `/authors` | Blog author directory. |
| `/contact_us` | Contact information and enquiries. |
| `/profile` | Customer profile, experience, skills, publications, and orders. |
| `/authentication` | Sign-in and registration experience. |
| `/admin` | Role-protected administration workspace. |
| `/admin/snippets` | Snippet catalogue and fulfilment queue. |

## Project structure

```text
app/                 Next.js routes, layouts, actions, and API handlers
components/          Shared public, profile, store, chat, and admin UI
lib/                 Authentication, database, pricing, validation, and utilities
prisma/              Prisma schema, migrations, and seed data
public/              Static images, icons, and other browser assets
types/               Shared TypeScript declarations
```

## Production deployment

Before deploying:

1. Add all required environment variables to the hosting platform.
2. Use a production PostgreSQL database that is reachable from the deployment environment.
3. Run `pnpm db:migrate` against the production database.
4. Run `pnpm build` and deploy the generated application.
5. Seed only when creating a new environment, and provide secure superuser credentials.

The application is prepared for Vercel deployment and includes Vercel Analytics and Speed Insights. Its production Vercel build command automatically applies committed Prisma migrations before compiling the application; preview builds do not alter the production schema. Authenticated and account-specific pages remain dynamic, while public content uses caching where appropriate.

## Payment launch checklist

Before enabling real purchases:

- Connect checkout to Paynow and verify payment callbacks server-side.
- Stop marking newly created orders as paid before confirmation.
- Test successful, cancelled, failed, and delayed payment states.
- Confirm the result and return URLs are publicly reachable over HTTPS.
- Reconcile Paynow references with the local order and payment records.

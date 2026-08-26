# HunarHub — Digital Marketplace for Local Micro-Entrepreneurs

HunarHub connects customers with nearby cobblers, potters/kumhars, tailors, artisans, and small vendors. It is a student-scale full-stack marketplace: customers discover local work and make requests or orders; entrepreneurs manage their profile and listings; administrators keep the marketplace safe.

## Features and roles

- **Customers:** register and log in, browse approved entrepreneurs and available products, search and filter by category, location, and price, place product orders or service requests, track/cancel their own transactions, submit reviews after completed work, and report transaction-related issues.
- **Entrepreneurs:** register into an approval queue, edit a business profile and availability, create/edit/hide/delete services and products, add product image URLs and stock, respond to incoming orders and requests, and view earnings based only on completed work.
- **Admins:** approve or reject entrepreneurs, add and update categories, view orders and requests, resolve complaints, and view database-backed platform analytics.

The product deliberately has no payment gateway, delivery/logistics service, mobile app, or AI recommendations. Payment and delivery are arranged directly between the customer and entrepreneur.

## Stack and architecture

- Client: React 18, Vite, React Router, CSS (with Bootstrap available in the project)
- Server: Node.js, Express, REST API
- Data: MongoDB with Mongoose
- Security: bcryptjs password hashes and JWT bearer authentication

`client/src` contains the responsive single-page UI. `server/src/routes` exposes REST endpoints, with Mongoose models in `server/src/models` and role/ownership middleware in `server/src/middleware`.

Core entities are `User`, `Entrepreneur`, `Category` (also used as a skill type), `Service`, `Product`, `Order`, `ServiceRequest`, `Review`, and `Complaint`.

## API overview

| Area | Base endpoint | Notes |
| --- | --- | --- |
| Authentication | `/api/auth` | register, login, current user |
| Discovery | `/api/categories`, `/api/entrepreneurs`, `/api/products` | public approved/available listings |
| Entrepreneur management | `/api/entrepreneurs/me`, `/api/services`, `/api/products` | JWT entrepreneur role and ownership checks |
| Transactions | `/api/orders`, `/api/requests` | clear validated status transitions |
| Feedback | `/api/reviews`, `/api/complaints` | customer transactions only |
| Administration | `/api/admin` | JWT admin role only |

Orders use `pending → confirmed → completed` (or cancellation). Service requests use `pending → accepted → completed`, with rejection or cancellation where permitted. The server rejects invalid state transitions and unauthorized updates.

## Setup

Prerequisites: Node.js 20+ and a running MongoDB instance.

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGODB_URI` and replace `JWT_SECRET` with a long, private random value. Never commit this file.
3. Install dependencies with `npm run install:all`.
4. Start both apps with `npm run dev`.

The client is served at `http://localhost:5173`; the API is served at `http://localhost:5000`. Visit `GET /api/health` to see API and database connection state.

### Environment variables

Server (`server/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hunarhub
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Client (`client/.env`, optional):

```env
VITE_API_URL=http://localhost:5000/api
```

## Quality checks

Run server model tests with `npm test`. Build the production client with `npm run build`. Database-dependent manual/API testing needs MongoDB running; the project does not seed accounts automatically, so create customer and entrepreneur accounts through the UI. An admin account must be created directly in the database for local demonstration because public registration correctly disallows admin roles.

## Deployment

1. Deploy the server with the variables above and a managed MongoDB connection string.
2. Set `CLIENT_URL` to the deployed frontend origin.
3. Build the client with `npm run build` and host `client/dist` on a static host.
4. Set `VITE_API_URL` during the client build to the deployed server URL plus `/api`.

For a production deployment, use HTTPS and keep all credentials in the host's secret store.

## Known limitations and future work

Images are URL-based rather than uploaded files. Orders contain one product per checkout and delivery/payment are offline arrangements. Category management is intentionally lightweight. Future enhancements may include file uploads, multi-item baskets, notification delivery, richer admin reports, and payments only after the basic marketplace has been validated.

See [the PRD](docs/PRD.md) and [technical documentation](docs/TECHNICAL.md) for project scope and implementation notes.

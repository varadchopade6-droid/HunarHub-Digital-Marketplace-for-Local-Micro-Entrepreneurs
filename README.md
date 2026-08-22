# HunarHub

Stages 1–2 foundation for a local micro-entrepreneur marketplace. The repository has a React + Bootstrap frontend and an Express + MongoDB REST API.

## Setup

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Run `npm install` from the repository root, then `npm run install:all`.
3. Run `npm run dev`.

The frontend runs on `http://localhost:5173` and API on `http://localhost:5000`. `GET /api/health` confirms API and MongoDB connection status.

## Stage 1 endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a customer or entrepreneur |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Return the authenticated user |
| GET | `/api/users/me` | Example authenticated user route |
| GET | `/api/health` | API/database status |
| GET | `/api/categories` | List the five marketplace categories |
| GET | `/api/entrepreneurs` | Browse approved entrepreneurs (`search`, `category`, `location`) |
| GET/PUT | `/api/entrepreneurs/me` | Read/update the signed-in entrepreneur profile |
| GET | `/api/entrepreneurs/:id` | Public profile with available listings |
| GET/POST | `/api/products` | Browse products (`search`, `category`, `location`, `minPrice`, `maxPrice`) / create a listing |
| GET/PUT/DELETE | `/api/products/:id` | View or owner-manage a product |
| GET/POST | `/api/services/mine`, `/api/services` | Owner list/create services |
| PUT/DELETE | `/api/services/:id` | Owner-manage a service |

Future route groups for orders, requests, reviews and admin are mounted and intentionally return `501` until their matching project stage.

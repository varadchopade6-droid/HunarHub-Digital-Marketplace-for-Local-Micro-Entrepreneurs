# HunarHub

Stage 1 foundation for a local micro-entrepreneur marketplace. The repository has a React + Bootstrap frontend and an Express + MongoDB REST API.

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

Future route groups are mounted for entrepreneurs, products, services, orders, requests, reviews and admin. They intentionally return `501` until their matching project stage.

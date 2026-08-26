# HunarHub Technical Documentation

## Server design

Express mounts REST route groups under `/api`. `protect` verifies a JWT and loads its user; `authorize` enforces customer, entrepreneur, or admin roles. Each listing and transaction route additionally finds the entrepreneur profile tied to the authenticated user before it changes data. Mongoose schema validation covers required values, ranges, and enumerated statuses. The central error handler returns validation, duplicate-key, malformed-ID, and generic API errors safely.

## Data and workflow integrity

Creating an order uses an atomic stock decrement constrained by availability and remaining stock. It restores stock if the entrepreneur cannot accept work and when an order is cancelled. Service requests snapshot the listed service name and price. Reviews must reference a completed transaction owned by the caller. Admin analytics aggregate completed order/request values and stored ratings rather than fabricated metrics.

## Client design

The Vite React client uses a small fetch wrapper that attaches the stored bearer token. Route-level components present loading, empty, success, and error states. The dashboard differs by JWT user role. Responsive CSS collapses grids and navigation for tablet and mobile layouts.

## Security notes

Passwords use bcryptjs hashing; they are excluded from normal model output. Secrets and MongoDB credentials are environment variables and `.env` is ignored. CORS permits the configured client origin. This is sensible coursework security, not a substitute for a production security assessment.

# IntuVision Waitlist Backend

Simple Express + Supabase backend for:
- storing waitlist/contact submissions
- viewing them in an admin page
- exporting rows for CRM and marketing tools

## 1) Configure environment

Create `backend/.env` from `.env.example`.

Required:
- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- one key:
  - preferred: `SUPABASE_SERVICE_ROLE_KEY`
  - fallback: `SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_PASSWORD`

## 2) Create database table

Run this SQL in Supabase SQL Editor:

`backend/sql/waitlist_customers.sql`

## 3) Start backend

From `backend`:

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

## 4) Connect frontend

Set in `frontend/.env`:

```bash
VITE_API_URL=http://localhost:4000
```

Then run frontend (`npm run dev` in `frontend`).

## API Endpoints

- `GET /api/health` - health check
- `POST /api/waitlist` - store a waitlist entry
- `GET /api/admin/waitlist?limit=300` - admin list (requires `x-admin-password` header)

## Notes for CRM integration

For now, use Admin page CSV export (`/admin`) to import into CRM.
Later, you can add a scheduled sync job or webhook-based connector from this backend.

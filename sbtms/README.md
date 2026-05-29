# Smart Bus Ticketing and Transport Management System (SBTMS)

Full-stack bus ticketing platform built with **React + Vite + Tailwind** (frontend) and **Node.js + Express + MySQL + JWT** (backend).

## Folder structure
```
sbtms/
├── backend/          Node.js + Express REST API
├── frontend/         React + Vite SPA
├── database/         database.sql (schema + sample data)
└── README.md
```

## Requirements
- Node.js 18+
- MySQL 8+
- npm

## 1. Database setup
```bash
mysql -u root -p < database/database.sql
```
This creates the `sbtms` database, all tables and inserts sample data.

Default admin account:
- Email: `admin@sbtms.com`
- Password: `admin123`

## 2. Backend setup
```bash
cd backend
cp .env.example .env       # edit DB credentials and JWT secret
npm install
npm run dev                # http://localhost:5000
```

## 3. Frontend setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

## Features
- Passenger registration / login (JWT, bcrypt, role based)
- Browse, search and filter buses & schedules
- Seat selection with duplicate-booking prevention
- Digital ticket generation & booking history
- Profile management
- Admin dashboard: manage buses, drivers, routes, schedules, bookings, passengers
- Reports (revenue, bookings, occupancy)
- Responsive Tailwind UI

## REST API (prefix `/api`)
| Resource | Endpoints |
|---|---|
| auth | POST /auth/register, /auth/login, /auth/admin/login, GET /auth/me |
| users | GET/PUT /users/profile, GET /users (admin) |
| buses | GET /buses, GET /buses/:id, POST/PUT/DELETE /buses (admin) |
| drivers | CRUD /drivers (admin) |
| routes | GET /routes, CRUD /routes (admin) |
| schedules | GET /schedules (search), CRUD /schedules (admin) |
| bookings | POST /bookings, GET /bookings/my, GET /bookings (admin), DELETE /bookings/:id |
| payments | POST /payments, GET /payments (admin) |
| reports | GET /reports/summary (admin) |

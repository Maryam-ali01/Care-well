# Carewell - Clinic Appointment Management System (MERN)

Three roles (Admin, Doctor, Patient), JWT auth, role-based authorization, and the full
booking -> approval -> monitoring workflow.

## Stack
Client: React + Vite, Tailwind CSS 3, React Router, Axios, Lucide icons, GSAP.
Server: Node, Express, MongoDB + Mongoose, JWT, bcryptjs, dotenv, CORS.

## Setup
Requires Node 18+ and a running MongoDB (local or Atlas).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env      # edit MONGO_URI and JWT_SECRET
npm run seed              # creates demo admin, doctor, patient (safe to re-run)
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

## Demo logins
| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Admin   | admin@clinic.com   | Admin123!   |
| Doctor  | doctor@clinic.com  | Doctor123!  |
| Patient | patient@clinic.com | Patient123! |

The login page also has click-to-fill demo buttons.

## API
POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, PUT /api/auth/profile
GET /api/doctors/featured (public), GET /api/doctors, GET /api/doctors/specializations, GET /api/doctors/:id
POST /api/appointments, GET /api/appointments/my, GET /api/appointments/doctor, GET /api/appointments/:id,
PATCH /api/appointments/:id/status, PATCH /api/appointments/:id/cancel
GET /api/admin/users, POST /api/admin/doctors, DELETE /api/admin/users/:id,
PATCH /api/admin/users/:id/status, GET /api/admin/appointments, GET /api/admin/stats

## Business rules enforced on the backend
- Public registration always creates a patient; role is never taken from the client.
- Only patients book; only the assigned doctor approves/rejects; patients cancel only their own pending ones.
- No past bookings, no duplicate (patient, doctor, date, time), no double booking of an approved slot.
- Deactivated users cannot log in and are blocked on every protected request.
- Passwords hashed with bcryptjs; admin accounts cannot be deleted or deactivated.
- Past-date check uses the server's local time zone.

## Final testing checklist
1. Admin logs in -> Add doctor (Dr. Ahmed, Cardiologist, 5 years).
2. Patient registers -> logs in -> Find doctors -> search "Ahmed" -> Book.
3. Doctor logs in -> Appointment requests -> Approve.
4. Patient logs in again -> My appointments shows Approved.
5. Admin logs in again -> All appointments + Manage users show everything.
6. Try: booking in the past, booking an approved slot, patient opening /admin, deactivated user login.

## Not included
Doctor Availability is optional in the brief: the model exists (server/models/DoctorAvailability.js) but is not wired to booking.

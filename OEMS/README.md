# Online Examination Management System

A minimal full-stack college-project friendly exam platform built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT, and bcrypt.

## Features

- Student registration and login
- Role-based dashboards for Student, Teacher, and Admin
- Teacher exam creation and MCQ question management
- Student exam attempt and automatic scoring
- Student result history
- Teacher result view per exam
- Admin user role management, exam list, and simple reports

## Project Structure

```text
backend/
  config/ controllers/ middleware/ models/ routes/ seed/ utils/
frontend/
  src/components src/context src/layouts src/pages src/routes src/services
```

## Setup

You can run both apps from the project root:

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000` and frontend runs on `http://localhost:5173`.

### Separate Terminal Setup

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Demo Accounts

After running `npm run seed` in `backend/`:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@oems.com | password123 |
| Teacher | teacher@oems.com | password123 |
| Student | student@oems.com | password123 |

## Notes

- MongoDB should be running locally before seeding or starting the backend.
- Student registration always creates a `student` account.
- Admin can promote users to `teacher` or `admin`.
- Exam scoring is calculated on the backend from saved correct options.

# Online Examination Management System

A full-stack academic project that simulates an online examination platform for students, teachers, and administrators. It is designed to showcase role-based access, exam management, and automated evaluation in a practical web application.

[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)

## Features

- Student registration and login
- Role-based dashboards for student, teacher, and admin
- Teacher exam creation and MCQ question management
- Automatic scoring and result tracking
- Admin moderation and reporting workflows

## Project Structure

```text
OEMS/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── src/
│   └── public/
└── README.md
```

## Setup

Run both apps from the project root:

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run seed
npm run dev
```

Backend: http://localhost:5000
Frontend: http://localhost:5173

## Demo Accounts

After running the seed command:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@oems.com | password123 |
| Teacher | teacher@oems.com | password123 |
| Student | student@oems.com | password123 |

## Screenshots

Screenshots will be added soon.

## Future Improvements

- Add live exam timer and proctoring support
- Improve analytics and reporting
- Add test question banks and import/export
- Strengthen authentication and role validation

## Author

GitHub: [github.com/vikram](https://github.com/vikramsumit)

## License

MIT — Free to use and modify.

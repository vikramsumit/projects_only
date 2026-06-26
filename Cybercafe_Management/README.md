# CyberShield Cafe Manager

A full-stack **Cyber Security Cafe Management System** for running a secure internet/gaming cafe. Manage PC stations, member accounts, billing sessions, bookings, and a built-in security operations center.

![CyberShield](https://img.shields.io/badge/CyberShield-Cafe%20Manager-00ff88)

## Features

### Cafe Operations
- **Dashboard** — Real-time stats, revenue charts, station grid, security alerts
- **PC Stations** — Manage terminals by zone (gaming, lab), hourly rates, maintenance mode
- **Sessions** — Start/end sessions, live elapsed time & billing, payment (cash/card/balance)
- **Members** — Customer accounts with membership tiers, balance top-ups, time packages
- **Bookings** — Schedule PC reservations in advance

### Cyber Security
- **Security Incidents** — Report & track malware, phishing, policy violations, network anomalies
- **Blocked URLs** — Content filtering rules by category (malware, P2P, gambling, etc.)
- **Firewall Rules** — Network access control (ports, protocols, IP ranges)
- **Endpoint Scanning** — Run security scans on each station
- **Audit Logs** — Full activity trail for admin actions

### Administration
- **Reports** — Revenue analytics and transaction history
- **Settings** — Staff user management, time package pricing
- **Role-based access** — Admin vs Staff permissions

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS v4     |
| Backend  | Node.js, Express                    |
| Database | SQLite (better-sqlite3)             |
| Auth     | JWT tokens                          |

## Quick Start

### Prerequisites
- Node.js 20+

### Installation

```bash
cd cyber-cafe-manager
npm install
npm run install:all
```

### Run the Application

**Option 1 — Both servers (recommended):**
```bash
npm run dev
```

**Option 2 — Separate terminals:**
```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm run seed
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

## Default Login Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | `admin`  | `admin123` |
| Staff | `staff`  | `staff123` |

## Project Structure

```
cyber-cafe-manager/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server
│   │   ├── database.js       # SQLite schema
│   │   ├── seed.js           # Demo data
│   │   ├── routes/           # API endpoints
│   │   └── middleware/       # JWT auth
│   └── data/                 # SQLite database (auto-created)
├── frontend/
│   └── src/
│       ├── pages/            # Dashboard, Stations, Security, etc.
│       ├── components/       # Layout, UI components
│       └── api/              # API client
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard` | Dashboard stats |
| GET/POST | `/api/stations` | Manage PCs |
| GET/POST | `/api/sessions` | Session management |
| GET/POST | `/api/members` | Member CRUD |
| GET/POST | `/api/bookings` | Reservations |
| GET/POST | `/api/security/*` | Security center |
| GET | `/api/dashboard/reports/*` | Reports |

## Sample Data

The seed script creates:
- 8 PC stations (gaming zones + Kali Linux lab)
- 4 demo members
- 5 time packages
- Blocked URL rules & firewall rules
- Sample security incidents

## License

MIT — Free to use and modify.

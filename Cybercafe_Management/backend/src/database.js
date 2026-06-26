import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'cafe.db');

import fs from 'fs';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'staff')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    balance REAL DEFAULT 0,
    membership_type TEXT DEFAULT 'standard' CHECK(membership_type IN ('standard', 'premium', 'student')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'inactive')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    zone TEXT DEFAULT 'main',
    specs TEXT,
    hourly_rate REAL NOT NULL DEFAULT 5,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'in_use', 'maintenance', 'offline')),
    ip_address TEXT,
    last_scan_at TEXT,
    scan_status TEXT DEFAULT 'clean' CHECK(scan_status IN ('clean', 'warning', 'infected', 'pending')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    station_id INTEGER NOT NULL,
    started_by INTEGER,
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration_minutes INTEGER,
    amount REAL,
    payment_method TEXT DEFAULT 'cash' CHECK(payment_method IN ('cash', 'card', 'balance', 'package')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'cancelled')),
    notes TEXT,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (station_id) REFERENCES stations(id),
    FOREIGN KEY (started_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    station_id INTEGER,
    booking_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (station_id) REFERENCES stations(id)
  );

  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    hours REAL NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS member_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    hours_remaining REAL NOT NULL,
    purchased_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (package_id) REFERENCES packages(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    type TEXT NOT NULL CHECK(type IN ('topup', 'session', 'package', 'refund')),
    amount REAL NOT NULL,
    description TEXT,
    created_by INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS security_incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER,
    member_id INTEGER,
    incident_type TEXT NOT NULL CHECK(incident_type IN ('malware', 'phishing', 'unauthorized_access', 'policy_violation', 'network_anomaly', 'other')),
    severity TEXT DEFAULT 'medium' CHECK(severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'investigating', 'resolved', 'closed')),
    reported_by INTEGER,
    resolved_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (station_id) REFERENCES stations(id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (reported_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS blocked_urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url_pattern TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    reason TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    details TEXT,
    ip_address TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS firewall_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK(rule_type IN ('allow', 'block')),
    protocol TEXT DEFAULT 'any',
    port TEXT,
    source_ip TEXT,
    destination TEXT,
    active INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 100,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;

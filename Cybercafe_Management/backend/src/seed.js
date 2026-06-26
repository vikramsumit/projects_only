import bcrypt from 'bcryptjs';
import db from './database.js';

const adminHash = bcrypt.hashSync('admin123', 10);
const staffHash = bcrypt.hashSync('staff123', 10);

db.prepare(`
  INSERT OR IGNORE INTO users (id, username, password_hash, full_name, role)
  VALUES (1, 'admin', ?, 'System Administrator', 'admin')
`).run(adminHash);

db.prepare(`
  INSERT OR IGNORE INTO users (id, username, password_hash, full_name, role)
  VALUES (2, 'staff', ?, 'Front Desk Staff', 'staff')
`).run(staffHash);

const stations = [
  ['PC-01', 'Alpha Terminal', 'zone-a', 'i7-12700K, RTX 4070, 32GB RAM', 8, '192.168.1.101'],
  ['PC-02', 'Beta Terminal', 'zone-a', 'i7-12700K, RTX 4070, 32GB RAM', 8, '192.168.1.102'],
  ['PC-03', 'Gamma Terminal', 'zone-a', 'Ryzen 7 5800X, RTX 3060, 16GB RAM', 6, '192.168.1.103'],
  ['PC-04', 'Delta Terminal', 'zone-b', 'Ryzen 7 5800X, RTX 3060, 16GB RAM', 6, '192.168.1.104'],
  ['PC-05', 'Echo Terminal', 'zone-b', 'i5-12400, GTX 1660, 16GB RAM', 5, '192.168.1.105'],
  ['PC-06', 'Foxtrot Terminal', 'zone-b', 'i5-12400, GTX 1660, 16GB RAM', 5, '192.168.1.106'],
  ['PC-07', 'Secure Lab 1', 'lab', 'Kali Linux, 64GB RAM, Dual Monitor', 10, '192.168.2.101'],
  ['PC-08', 'Secure Lab 2', 'lab', 'Kali Linux, 64GB RAM, Dual Monitor', 10, '192.168.2.102'],
];

const insertStation = db.prepare(`
  INSERT OR IGNORE INTO stations (station_number, name, zone, specs, hourly_rate, ip_address, scan_status, last_scan_at)
  VALUES (?, ?, ?, ?, ?, ?, 'clean', datetime('now'))
`);

stations.forEach(s => insertStation.run(...s));

const members = [
  ['Alex Chen', 'alex@email.com', '555-0101', 'premium', 50],
  ['Jordan Smith', 'jordan@email.com', '555-0102', 'standard', 25],
  ['Sam Rivera', 'sam@email.com', '555-0103', 'student', 15],
  ['Taylor Kim', 'taylor@email.com', '555-0104', 'standard', 0],
];

const insertMember = db.prepare(`
  INSERT INTO members (member_code, full_name, email, phone, membership_type, balance)
  VALUES (?, ?, ?, ?, ?, ?)
`);

members.forEach(m => {
  const code = 'M' + Math.random().toString(36).substring(2, 8).toUpperCase();
  insertMember.run(code, ...m);
});

const packages = [
  ['1 Hour Pass', 1, 5, 'Quick gaming session'],
  ['3 Hour Bundle', 3, 12, 'Popular choice for casual users'],
  ['5 Hour Bundle', 5, 18, 'Extended play time'],
  ['10 Hour Premium', 10, 30, 'Best value for regulars'],
  ['Weekend Special', 8, 22, 'Valid Fri-Sun only'],
];

const insertPkg = db.prepare(`
  INSERT OR IGNORE INTO packages (name, hours, price, description) VALUES (?, ?, ?, ?)
`);
packages.forEach(p => insertPkg.run(...p));

const blockedUrls = [
  ['*.malware-site.com', 'malware', 'Known malware distribution'],
  ['*.phishing-bank.net', 'phishing', 'Bank phishing site'],
  ['torrent*', 'p2p', 'P2P file sharing blocked'],
  ['*.darkweb.onion', 'illegal', 'Tor hidden services blocked on public PCs'],
  ['crypto-miner.js', 'crypto', 'Cryptocurrency mining scripts'],
  ['*.gambling-ads.com', 'gambling', 'Unauthorized gambling'],
];

const insertUrl = db.prepare(`
  INSERT OR IGNORE INTO blocked_urls (url_pattern, category, reason) VALUES (?, ?, ?)
`);
blockedUrls.forEach(u => insertUrl.run(...u));

const firewallRules = [
  ['Block SMB External', 'block', 'tcp', '445', 'any', 'external', 10],
  ['Allow DNS', 'allow', 'udp', '53', 'any', 'any', 20],
  ['Allow HTTP/HTTPS', 'allow', 'tcp', '80,443', 'any', 'any', 30],
  ['Block Telnet', 'block', 'tcp', '23', 'any', 'any', 40],
  ['Block RDP External', 'block', 'tcp', '3389', 'any', 'external', 50],
  ['Lab Network Isolation', 'block', 'any', 'any', '192.168.2.0/24', '192.168.1.0/24', 60],
];

const insertFw = db.prepare(`
  INSERT OR IGNORE INTO firewall_rules (name, rule_type, protocol, port, source_ip, destination, priority)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
firewallRules.forEach(r => insertFw.run(...r));

const incidents = [
  [3, 1, 'policy_violation', 'medium', 'Attempted torrent download', 'User tried to access blocked P2P site'],
  [7, null, 'network_anomaly', 'high', 'Unusual outbound traffic', 'Lab PC sending data to unknown IP'],
];

const insertIncident = db.prepare(`
  INSERT INTO security_incidents (station_id, member_id, incident_type, severity, title, description, reported_by, status)
  VALUES (?, ?, ?, ?, ?, ?, 1, 'open')
`);
incidents.forEach(i => insertIncident.run(...i));

console.log('Database seeded successfully!');
console.log('Login: admin / admin123  or  staff / staff123');

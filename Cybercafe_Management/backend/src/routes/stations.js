import { Router } from 'express';
import db from '../database.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { logAudit } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const { status, zone } = req.query;
  let sql = `
    SELECT s.*, 
      (SELECT COUNT(*) FROM sessions sess WHERE sess.station_id = s.id AND sess.status = 'active') as active_session
    FROM stations s WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ' AND s.status = ?'; params.push(status); }
  if (zone) { sql += ' AND s.zone = ?'; params.push(zone); }
  sql += ' ORDER BY s.station_number';
  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', authMiddleware, (req, res) => {
  const station = db.prepare('SELECT * FROM stations WHERE id = ?').get(req.params.id);
  if (!station) return res.status(404).json({ error: 'Station not found' });
  const activeSession = db.prepare(`
    SELECT sess.*, m.full_name as member_name, m.member_code
    FROM sessions sess LEFT JOIN members m ON m.id = sess.member_id
    WHERE sess.station_id = ? AND sess.status = 'active'
  `).get(req.params.id);
  res.json({ ...station, active_session: activeSession || null });
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { station_number, name, zone, specs, hourly_rate, ip_address } = req.body;
  if (!station_number || !name) return res.status(400).json({ error: 'Station number and name required' });
  try {
    const result = db.prepare(`
      INSERT INTO stations (station_number, name, zone, specs, hourly_rate, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(station_number, name, zone || 'main', specs || null, hourly_rate ?? 5, ip_address || null);
    logAudit(db, req.user.id, 'create', 'station', result.lastInsertRowid, { station_number }, req.ip);
    res.status(201).json(db.prepare('SELECT * FROM stations WHERE id = ?').get(result.lastInsertRowid));
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Station number exists' });
    throw e;
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, zone, specs, hourly_rate, status, ip_address, scan_status } = req.body;
  db.prepare(`
    UPDATE stations SET name = COALESCE(?, name), zone = COALESCE(?, zone),
    specs = COALESCE(?, specs), hourly_rate = COALESCE(?, hourly_rate),
    status = COALESCE(?, status), ip_address = COALESCE(?, ip_address),
    scan_status = COALESCE(?, scan_status),
    last_scan_at = CASE WHEN ? IS NOT NULL THEN datetime('now') ELSE last_scan_at END
    WHERE id = ?
  `).run(name, zone, specs, hourly_rate, status, ip_address, scan_status, scan_status, req.params.id);
  logAudit(db, req.user.id, 'update', 'station', req.params.id, req.body, req.ip);
  res.json(db.prepare('SELECT * FROM stations WHERE id = ?').get(req.params.id));
});

router.post('/:id/scan', authMiddleware, (req, res) => {
  const statuses = ['clean', 'clean', 'clean', 'warning', 'pending'];
  const scan_status = statuses[Math.floor(Math.random() * statuses.length)];
  db.prepare(`
    UPDATE stations SET scan_status = ?, last_scan_at = datetime('now') WHERE id = ?
  `).run(scan_status, req.params.id);
  logAudit(db, req.user.id, 'scan', 'station', req.params.id, { scan_status }, req.ip);
  res.json(db.prepare('SELECT * FROM stations WHERE id = ?').get(req.params.id));
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const active = db.prepare("SELECT id FROM sessions WHERE station_id = ? AND status = 'active'").get(req.params.id);
  if (active) return res.status(400).json({ error: 'Cannot delete station with active session' });
  db.prepare('DELETE FROM stations WHERE id = ?').run(req.params.id);
  logAudit(db, req.user.id, 'delete', 'station', req.params.id, null, req.ip);
  res.json({ success: true });
});

export default router;

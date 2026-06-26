import { Router } from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';
import { logAudit } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const { date, status } = req.query;
  let sql = `
    SELECT b.*, m.full_name as member_name, m.member_code, m.phone,
      s.name as station_name, s.station_number
    FROM bookings b
    JOIN members m ON m.id = b.member_id
    LEFT JOIN stations s ON s.id = b.station_id
    WHERE 1=1
  `;
  const params = [];
  if (date) { sql += ' AND b.booking_date = ?'; params.push(date); }
  if (status) { sql += ' AND b.status = ?'; params.push(status); }
  sql += ' ORDER BY b.booking_date, b.start_time';
  res.json(db.prepare(sql).all(...params));
});

router.post('/', authMiddleware, (req, res) => {
  const { member_id, station_id, booking_date, start_time, end_time, notes } = req.body;
  if (!member_id || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const result = db.prepare(`
    INSERT INTO bookings (member_id, station_id, booking_date, start_time, end_time, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
  `).run(member_id, station_id || null, booking_date, start_time, end_time, notes || null);
  logAudit(db, req.user.id, 'create', 'booking', result.lastInsertRowid, req.body, req.ip);
  res.status(201).json(db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', authMiddleware, (req, res) => {
  const { status, station_id, booking_date, start_time, end_time, notes } = req.body;
  db.prepare(`
    UPDATE bookings SET status = COALESCE(?, status), station_id = COALESCE(?, station_id),
    booking_date = COALESCE(?, booking_date), start_time = COALESCE(?, start_time),
    end_time = COALESCE(?, end_time), notes = COALESCE(?, notes) WHERE id = ?
  `).run(status, station_id, booking_date, start_time, end_time, notes, req.params.id);
  logAudit(db, req.user.id, 'update', 'booking', req.params.id, req.body, req.ip);
  res.json(db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id));
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(req.params.id);
  logAudit(db, req.user.id, 'cancel', 'booking', req.params.id, null, req.ip);
  res.json({ success: true });
});

export default router;

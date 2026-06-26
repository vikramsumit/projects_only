import { Router } from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const stats = {
    active_sessions: db.prepare("SELECT COUNT(*) as c FROM sessions WHERE status = 'active'").get().c,
    available_stations: db.prepare("SELECT COUNT(*) as c FROM stations WHERE status = 'available'").get().c,
    total_stations: db.prepare('SELECT COUNT(*) as c FROM stations').get().c,
    total_members: db.prepare("SELECT COUNT(*) as c FROM members WHERE status = 'active'").get().c,
    today_revenue: db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM sessions
      WHERE status = 'completed' AND date(end_time) = date('now')
    `).get().total,
    today_sessions: db.prepare(`
      SELECT COUNT(*) as c FROM sessions WHERE date(start_time) = date('now')
    `).get().c,
    open_incidents: db.prepare("SELECT COUNT(*) as c FROM security_incidents WHERE status IN ('open', 'investigating')").get().c,
    pending_bookings: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending' AND booking_date >= date('now')").get().c,
  };

  const revenueWeek = db.prepare(`
    SELECT date(end_time) as day, SUM(amount) as revenue, COUNT(*) as sessions
    FROM sessions WHERE status = 'completed' AND end_time >= date('now', '-7 days')
    GROUP BY date(end_time) ORDER BY day
  `).all();

  const stationUsage = db.prepare(`
    SELECT st.name, st.station_number, st.status, st.scan_status,
      COUNT(sess.id) as sessions_today
    FROM stations st
    LEFT JOIN sessions sess ON sess.station_id = st.id AND date(sess.start_time) = date('now')
    GROUP BY st.id ORDER BY st.station_number
  `).all();

  const recentIncidents = db.prepare(`
    SELECT si.*, st.station_number FROM security_incidents si
    LEFT JOIN stations st ON st.id = si.station_id
    ORDER BY si.created_at DESC LIMIT 5
  `).all();

  res.json({ stats, revenueWeek, stationUsage, recentIncidents });
});

router.get('/reports/revenue', authMiddleware, (req, res) => {
  const { from, to } = req.query;
  let sql = `
    SELECT date(end_time) as date, SUM(amount) as revenue, COUNT(*) as sessions,
      SUM(duration_minutes) as total_minutes
    FROM sessions WHERE status = 'completed'
  `;
  const params = [];
  if (from) { sql += ' AND date(end_time) >= ?'; params.push(from); }
  if (to) { sql += ' AND date(end_time) <= ?'; params.push(to); }
  sql += ' GROUP BY date(end_time) ORDER BY date DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/reports/transactions', authMiddleware, (req, res) => {
  const transactions = db.prepare(`
    SELECT t.*, m.full_name as member_name, u.full_name as created_by_name
    FROM transactions t
    LEFT JOIN members m ON m.id = t.member_id
    LEFT JOIN users u ON u.id = t.created_by
    ORDER BY t.created_at DESC LIMIT 100
  `).all();
  res.json(transactions);
});

export default router;

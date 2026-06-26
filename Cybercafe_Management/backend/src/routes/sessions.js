import { Router } from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';
import { calcSessionAmount, logAudit } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const { status, date } = req.query;
  let sql = `
    SELECT sess.*, st.name as station_name, st.station_number,
      m.full_name as member_name, m.member_code,
      u.full_name as started_by_name
    FROM sessions sess
    JOIN stations st ON st.id = sess.station_id
    LEFT JOIN members m ON m.id = sess.member_id
    LEFT JOIN users u ON u.id = sess.started_by
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ' AND sess.status = ?'; params.push(status); }
  if (date) { sql += ' AND date(sess.start_time) = ?'; params.push(date); }
  sql += ' ORDER BY sess.start_time DESC LIMIT 100';
  res.json(db.prepare(sql).all(...params));
});

router.get('/active', authMiddleware, (req, res) => {
  const sessions = db.prepare(`
    SELECT sess.*, st.name as station_name, st.station_number, st.hourly_rate,
      m.full_name as member_name, m.member_code, m.balance as member_balance
    FROM sessions sess
    JOIN stations st ON st.id = sess.station_id
    LEFT JOIN members m ON m.id = sess.member_id
    WHERE sess.status = 'active'
    ORDER BY sess.start_time
  `).all();
  const enriched = sessions.map(s => {
    const start = new Date(s.start_time);
    const mins = Math.floor((Date.now() - start.getTime()) / 60000);
    return { ...s, elapsed_minutes: mins, current_amount: calcSessionAmount(mins, s.hourly_rate) };
  });
  res.json(enriched);
});

router.post('/start', authMiddleware, (req, res) => {
  const { station_id, member_id, notes } = req.body;
  if (!station_id) return res.status(400).json({ error: 'Station required' });

  const station = db.prepare('SELECT * FROM stations WHERE id = ?').get(station_id);
  if (!station) return res.status(404).json({ error: 'Station not found' });
  if (station.status === 'in_use') return res.status(400).json({ error: 'Station already in use' });
  if (station.status === 'maintenance' || station.status === 'offline') {
    return res.status(400).json({ error: 'Station unavailable' });
  }

  if (member_id) {
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(member_id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    if (member.status !== 'active') return res.status(400).json({ error: 'Member account not active' });
  }

  const startSession = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO sessions (member_id, station_id, started_by, start_time, notes)
      VALUES (?, ?, ?, datetime('now'), ?)
    `).run(member_id || null, station_id, req.user.id, notes || null);
    db.prepare("UPDATE stations SET status = 'in_use' WHERE id = ?").run(station_id);
    return result.lastInsertRowid;
  });

  const sessionId = startSession();
  logAudit(db, req.user.id, 'start_session', 'session', sessionId, { station_id, member_id }, req.ip);
  res.status(201).json(db.prepare(`
    SELECT sess.*, st.name as station_name FROM sessions sess
    JOIN stations st ON st.id = sess.station_id WHERE sess.id = ?
  `).get(sessionId));
});

router.post('/:id/end', authMiddleware, (req, res) => {
  const { payment_method } = req.body;
  const session = db.prepare(`
    SELECT sess.*, st.hourly_rate FROM sessions sess
    JOIN stations st ON st.id = sess.station_id WHERE sess.id = ?
  `).get(req.params.id);

  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status !== 'active') return res.status(400).json({ error: 'Session not active' });

  const endTime = new Date();
  const startTime = new Date(session.start_time);
  const durationMinutes = Math.max(1, Math.ceil((endTime - startTime) / 60000));
  const amount = calcSessionAmount(durationMinutes, session.hourly_rate);
  const method = payment_method || 'cash';

  const endSession = db.transaction(() => {
    db.prepare(`
      UPDATE sessions SET end_time = datetime('now'), duration_minutes = ?,
      amount = ?, payment_method = ?, status = 'completed' WHERE id = ?
    `).run(durationMinutes, amount, method, req.params.id);

    db.prepare("UPDATE stations SET status = 'available' WHERE id = ?").run(session.station_id);

    if (method === 'balance' && session.member_id) {
      const member = db.prepare('SELECT balance FROM members WHERE id = ?').get(session.member_id);
      if (member.balance < amount) throw new Error('Insufficient balance');
      db.prepare('UPDATE members SET balance = balance - ? WHERE id = ?').run(amount, session.member_id);
      db.prepare(`
        INSERT INTO transactions (member_id, type, amount, description, created_by)
        VALUES (?, 'session', ?, ?, ?)
      `).run(session.member_id, -amount, `Session #${req.params.id}`, req.user.id);
    }
  });

  try {
    endSession();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  logAudit(db, req.user.id, 'end_session', 'session', req.params.id, { amount, durationMinutes }, req.ip);
  res.json(db.prepare(`
    SELECT sess.*, st.name as station_name FROM sessions sess
    JOIN stations st ON st.id = sess.station_id WHERE sess.id = ?
  `).get(req.params.id));
});

export default router;

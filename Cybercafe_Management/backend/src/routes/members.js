import { Router } from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateMemberCode, logAudit } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const { search, status } = req.query;
  let sql = 'SELECT * FROM members WHERE 1=1';
  const params = [];
  if (search) {
    sql += ' AND (full_name LIKE ? OR member_code LIKE ? OR email LIKE ? OR phone LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', authMiddleware, (req, res) => {
  const member = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  const packages = db.prepare(`
    SELECT mp.*, p.name as package_name FROM member_packages mp
    JOIN packages p ON p.id = mp.package_id
    WHERE mp.member_id = ? AND mp.hours_remaining > 0
  `).all(req.params.id);
  const sessions = db.prepare(`
    SELECT s.*, st.name as station_name FROM sessions s
    JOIN stations st ON st.id = s.station_id
    WHERE s.member_id = ? ORDER BY s.start_time DESC LIMIT 20
  `).all(req.params.id);
  res.json({ ...member, packages, recent_sessions: sessions });
});

router.post('/', authMiddleware, (req, res) => {
  const { full_name, email, phone, membership_type, balance } = req.body;
  if (!full_name) return res.status(400).json({ error: 'Full name required' });
  const code = generateMemberCode();
  const result = db.prepare(`
    INSERT INTO members (member_code, full_name, email, phone, membership_type, balance)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(code, full_name, email || null, phone || null, membership_type || 'standard', balance || 0);
  logAudit(db, req.user.id, 'create', 'member', result.lastInsertRowid, { full_name }, req.ip);
  res.status(201).json(db.prepare('SELECT * FROM members WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', authMiddleware, (req, res) => {
  const { full_name, email, phone, membership_type, status } = req.body;
  db.prepare(`
    UPDATE members SET full_name = COALESCE(?, full_name), email = COALESCE(?, email),
    phone = COALESCE(?, phone), membership_type = COALESCE(?, membership_type),
    status = COALESCE(?, status) WHERE id = ?
  `).run(full_name, email, phone, membership_type, status, req.params.id);
  logAudit(db, req.user.id, 'update', 'member', req.params.id, req.body, req.ip);
  res.json(db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id));
});

router.post('/:id/topup', authMiddleware, (req, res) => {
  const { amount, description } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Valid amount required' });
  const member = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  db.prepare('UPDATE members SET balance = balance + ? WHERE id = ?').run(amount, req.params.id);
  db.prepare(`
    INSERT INTO transactions (member_id, type, amount, description, created_by)
    VALUES (?, 'topup', ?, ?, ?)
  `).run(req.params.id, amount, description || 'Balance top-up', req.user.id);
  logAudit(db, req.user.id, 'topup', 'member', req.params.id, { amount }, req.ip);
  res.json(db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id));
});

export default router;

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../database.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { logAudit } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, adminOnly, (req, res) => {
  const users = db.prepare('SELECT id, username, full_name, role, created_at FROM users ORDER BY id').all();
  res.json(users);
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { username, password, full_name, role } = req.body;
  if (!username || !password || !full_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const hash = bcrypt.hashSync(password, 10);
  try {
    const result = db.prepare(
      'INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)'
    ).run(username, hash, full_name, role || 'staff');
    logAudit(db, req.user.id, 'create', 'user', result.lastInsertRowid, { username }, req.ip);
    res.status(201).json({ id: result.lastInsertRowid, username, full_name, role: role || 'staff' });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username already exists' });
    throw e;
  }
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  logAudit(db, req.user.id, 'delete', 'user', req.params.id, null, req.ip);
  res.json({ success: true });
});

export default router;

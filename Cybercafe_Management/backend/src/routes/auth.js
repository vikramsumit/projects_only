import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { logAudit } from '../utils/helpers.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
  logAudit(db, user.id, 'login', 'user', user.id, null, req.ip);
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name }
  });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

export default router;

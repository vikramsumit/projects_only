import { Router } from 'express';
import db from '../database.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { logAudit } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.json(db.prepare('SELECT * FROM packages WHERE active = 1 ORDER BY price').all());
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { name, hours, price, description } = req.body;
  if (!name || !hours || !price) return res.status(400).json({ error: 'Name, hours, and price required' });
  const result = db.prepare(`
    INSERT INTO packages (name, hours, price, description) VALUES (?, ?, ?, ?)
  `).run(name, hours, price, description || null);
  res.status(201).json(db.prepare('SELECT * FROM packages WHERE id = ?').get(result.lastInsertRowid));
});

router.post('/purchase', authMiddleware, (req, res) => {
  const { member_id, package_id } = req.body;
  const pkg = db.prepare('SELECT * FROM packages WHERE id = ? AND active = 1').get(package_id);
  const member = db.prepare('SELECT * FROM members WHERE id = ?').get(member_id);
  if (!pkg || !member) return res.status(404).json({ error: 'Package or member not found' });

  const purchase = db.transaction(() => {
    if (member.balance < pkg.price) throw new Error('Insufficient balance');
    db.prepare('UPDATE members SET balance = balance - ? WHERE id = ?').run(pkg.price, member_id);
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    db.prepare(`
      INSERT INTO member_packages (member_id, package_id, hours_remaining, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(member_id, package_id, pkg.hours, expires.toISOString());
    db.prepare(`
      INSERT INTO transactions (member_id, type, amount, description, created_by)
      VALUES (?, 'package', ?, ?, ?)
    `).run(member_id, -pkg.price, `Purchased: ${pkg.name}`, req.user.id);
  });

  try {
    purchase();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  logAudit(db, req.user.id, 'purchase_package', 'member', member_id, { package_id }, req.ip);
  res.json({ success: true });
});

export default router;

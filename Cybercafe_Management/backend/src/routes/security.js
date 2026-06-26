import { Router } from 'express';
import db from '../database.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { logAudit } from '../utils/helpers.js';

const router = Router();

router.get('/incidents', authMiddleware, (req, res) => {
  const { status, severity } = req.query;
  let sql = `
    SELECT si.*, st.name as station_name, st.station_number,
      m.full_name as member_name, u.full_name as reported_by_name
    FROM security_incidents si
    LEFT JOIN stations st ON st.id = si.station_id
    LEFT JOIN members m ON m.id = si.member_id
    LEFT JOIN users u ON u.id = si.reported_by
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ' AND si.status = ?'; params.push(status); }
  if (severity) { sql += ' AND si.severity = ?'; params.push(severity); }
  sql += ' ORDER BY si.created_at DESC LIMIT 100';
  res.json(db.prepare(sql).all(...params));
});

router.post('/incidents', authMiddleware, (req, res) => {
  const { station_id, member_id, incident_type, severity, title, description } = req.body;
  if (!incident_type || !title) return res.status(400).json({ error: 'Type and title required' });
  const result = db.prepare(`
    INSERT INTO security_incidents (station_id, member_id, incident_type, severity, title, description, reported_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(station_id || null, member_id || null, incident_type, severity || 'medium', title, description || null, req.user.id);
  logAudit(db, req.user.id, 'create', 'security_incident', result.lastInsertRowid, { title }, req.ip);
  res.status(201).json(db.prepare('SELECT * FROM security_incidents WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/incidents/:id', authMiddleware, (req, res) => {
  const { status, severity, description } = req.body;
  const resolved = status === 'resolved' || status === 'closed';
  db.prepare(`
    UPDATE security_incidents SET status = COALESCE(?, status), severity = COALESCE(?, severity),
    description = COALESCE(?, description),
    resolved_at = CASE WHEN ? THEN datetime('now') ELSE resolved_at END
    WHERE id = ?
  `).run(status, severity, description, resolved ? 1 : 0, req.params.id);
  logAudit(db, req.user.id, 'update', 'security_incident', req.params.id, req.body, req.ip);
  res.json(db.prepare('SELECT * FROM security_incidents WHERE id = ?').get(req.params.id));
});

router.get('/blocked-urls', authMiddleware, (req, res) => {
  res.json(db.prepare('SELECT * FROM blocked_urls ORDER BY category, url_pattern').all());
});

router.post('/blocked-urls', authMiddleware, adminOnly, (req, res) => {
  const { url_pattern, category, reason } = req.body;
  if (!url_pattern) return res.status(400).json({ error: 'URL pattern required' });
  const result = db.prepare(`
    INSERT INTO blocked_urls (url_pattern, category, reason) VALUES (?, ?, ?)
  `).run(url_pattern, category || 'general', reason || null);
  logAudit(db, req.user.id, 'create', 'blocked_url', result.lastInsertRowid, { url_pattern }, req.ip);
  res.status(201).json(db.prepare('SELECT * FROM blocked_urls WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/blocked-urls/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM blocked_urls WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/firewall', authMiddleware, adminOnly, (req, res) => {
  res.json(db.prepare('SELECT * FROM firewall_rules ORDER BY priority, id').all());
});

router.post('/firewall', authMiddleware, adminOnly, (req, res) => {
  const { name, rule_type, protocol, port, source_ip, destination, priority } = req.body;
  if (!name || !rule_type) return res.status(400).json({ error: 'Name and rule type required' });
  const result = db.prepare(`
    INSERT INTO firewall_rules (name, rule_type, protocol, port, source_ip, destination, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, rule_type, protocol || 'any', port || null, source_ip || null, destination || null, priority ?? 100);
  logAudit(db, req.user.id, 'create', 'firewall_rule', result.lastInsertRowid, { name }, req.ip);
  res.status(201).json(db.prepare('SELECT * FROM firewall_rules WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/firewall/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, rule_type, protocol, port, source_ip, destination, active, priority } = req.body;
  db.prepare(`
    UPDATE firewall_rules SET name = COALESCE(?, name), rule_type = COALESCE(?, rule_type),
    protocol = COALESCE(?, protocol), port = COALESCE(?, port),
    source_ip = COALESCE(?, source_ip), destination = COALESCE(?, destination),
    active = COALESCE(?, active), priority = COALESCE(?, priority) WHERE id = ?
  `).run(name, rule_type, protocol, port, source_ip, destination, active, priority, req.params.id);
  res.json(db.prepare('SELECT * FROM firewall_rules WHERE id = ?').get(req.params.id));
});

router.delete('/firewall/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM firewall_rules WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/audit-logs', authMiddleware, adminOnly, (req, res) => {
  const logs = db.prepare(`
    SELECT al.*, u.full_name as user_name, u.username
    FROM audit_logs al LEFT JOIN users u ON u.id = al.user_id
    ORDER BY al.created_at DESC LIMIT 200
  `).all();
  res.json(logs);
});

router.get('/overview', authMiddleware, (req, res) => {
  const openIncidents = db.prepare("SELECT COUNT(*) as c FROM security_incidents WHERE status IN ('open', 'investigating')").get().c;
  const criticalIncidents = db.prepare("SELECT COUNT(*) as c FROM security_incidents WHERE severity = 'critical' AND status != 'closed'").get().c;
  const infectedStations = db.prepare("SELECT COUNT(*) as c FROM stations WHERE scan_status IN ('infected', 'warning')").get().c;
  const blockedUrls = db.prepare('SELECT COUNT(*) as c FROM blocked_urls WHERE active = 1').get().c;
  const firewallRules = db.prepare('SELECT COUNT(*) as c FROM firewall_rules WHERE active = 1').get().c;
  res.json({ openIncidents, criticalIncidents, infectedStations, blockedUrls, firewallRules });
});

export default router;

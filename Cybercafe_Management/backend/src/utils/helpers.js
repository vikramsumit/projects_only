export function generateMemberCode() {
  return 'M' + Date.now().toString(36).toUpperCase().slice(-6);
}

export function logAudit(db, userId, action, entityType, entityId, details, ip) {
  db.prepare(`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, action, entityType, entityId, details ? JSON.stringify(details) : null, ip);
}

export function calcSessionAmount(durationMinutes, hourlyRate) {
  return Math.round((durationMinutes / 60) * hourlyRate * 100) / 100;
}

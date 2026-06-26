const API = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  me: () => request('/auth/me'),

  dashboard: () => request('/dashboard'),
  revenueReport: (from, to) => request(`/dashboard/reports/revenue?from=${from || ''}&to=${to || ''}`),
  transactions: () => request('/dashboard/reports/transactions'),

  members: {
    list: (search) => request(`/members${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    get: (id) => request(`/members/${id}`),
    create: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    topup: (id, amount, description) =>
      request(`/members/${id}/topup`, { method: 'POST', body: JSON.stringify({ amount, description }) }),
  },

  stations: {
    list: () => request('/stations'),
    get: (id) => request(`/stations/${id}`),
    create: (data) => request('/stations', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/stations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    scan: (id) => request(`/stations/${id}/scan`, { method: 'POST' }),
    delete: (id) => request(`/stations/${id}`, { method: 'DELETE' }),
  },

  sessions: {
    list: (status) => request(`/sessions${status ? `?status=${status}` : ''}`),
    active: () => request('/sessions/active'),
    start: (data) => request('/sessions/start', { method: 'POST', body: JSON.stringify(data) }),
    end: (id, payment_method) =>
      request(`/sessions/${id}/end`, { method: 'POST', body: JSON.stringify({ payment_method }) }),
  },

  bookings: {
    list: (date) => request(`/bookings${date ? `?date=${date}` : ''}`),
    create: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    cancel: (id) => request(`/bookings/${id}`, { method: 'DELETE' }),
  },

  packages: {
    list: () => request('/packages'),
    create: (data) => request('/packages', { method: 'POST', body: JSON.stringify(data) }),
    purchase: (member_id, package_id) =>
      request('/packages/purchase', { method: 'POST', body: JSON.stringify({ member_id, package_id }) }),
  },

  security: {
    overview: () => request('/security/overview'),
    incidents: (status) => request(`/security/incidents${status ? `?status=${status}` : ''}`),
    createIncident: (data) => request('/security/incidents', { method: 'POST', body: JSON.stringify(data) }),
    updateIncident: (id, data) =>
      request(`/security/incidents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    blockedUrls: () => request('/security/blocked-urls'),
    addBlockedUrl: (data) => request('/security/blocked-urls', { method: 'POST', body: JSON.stringify(data) }),
    deleteBlockedUrl: (id) => request(`/security/blocked-urls/${id}`, { method: 'DELETE' }),
    firewall: () => request('/security/firewall'),
    addFirewall: (data) => request('/security/firewall', { method: 'POST', body: JSON.stringify(data) }),
    updateFirewall: (id, data) =>
      request(`/security/firewall/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteFirewall: (id) => request(`/security/firewall/${id}`, { method: 'DELETE' }),
    auditLogs: () => request('/security/audit-logs'),
  },

  users: {
    list: () => request('/users'),
    create: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },
};

export function formatCurrency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleString();
}

import { useEffect, useState } from 'react';
import { Plus, Trash2, Shield, Globe, Flame, FileText } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader, StatusBadge, Modal, Field, StatCard } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const INCIDENT_TYPES = ['malware', 'phishing', 'unauthorized_access', 'policy_violation', 'network_anomaly', 'other'];

export default function Security() {
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [blockedUrls, setBlockedUrls] = useState([]);
  const [firewall, setFirewall] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stations, setStations] = useState([]);
  const [showIncident, setShowIncident] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [showFw, setShowFw] = useState(false);
  const [form, setForm] = useState({});
  const { isAdmin } = useAuth();

  useEffect(() => { loadAll(); }, [tab]);

  async function loadAll() {
    const [ov, st] = await Promise.all([api.security.overview(), api.stations.list()]);
    setOverview(ov);
    setStations(st);
    if (tab === 'incidents') setIncidents(await api.security.incidents());
    if (tab === 'urls') setBlockedUrls(await api.security.blockedUrls());
    if (tab === 'firewall') setFirewall(await api.security.firewall());
    if (tab === 'audit' && isAdmin) setAuditLogs(await api.security.auditLogs());
  }

  async function handleIncident(e) {
    e.preventDefault();
    await api.security.createIncident({ ...form, station_id: form.station_id || null });
    setShowIncident(false);
    setForm({});
    loadAll();
  }

  async function resolveIncident(id) {
    await api.security.updateIncident(id, { status: 'resolved' });
    loadAll();
  }

  async function handleUrl(e) {
    e.preventDefault();
    await api.security.addBlockedUrl(form);
    setShowUrl(false);
    setForm({});
    loadAll();
  }

  async function handleFw(e) {
    e.preventDefault();
    await api.security.addFirewall(form);
    setShowFw(false);
    setForm({});
    loadAll();
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'incidents', label: 'Incidents', icon: Shield },
    { id: 'urls', label: 'Blocked URLs', icon: Globe },
    { id: 'firewall', label: 'Firewall', icon: Flame },
    ...(isAdmin ? [{ id: 'audit', label: 'Audit Logs', icon: FileText }] : []),
  ];

  return (
    <div className="p-8">
      <PageHeader title="Security Center" subtitle="Monitor threats, policies, and network protection" />

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && overview && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard label="Open Incidents" value={overview.openIncidents} color="text-cyber-danger" />
            <StatCard label="Critical" value={overview.criticalIncidents} color="text-cyber-danger" />
            <StatCard label="At-Risk Stations" value={overview.infectedStations} color="text-cyber-warning" />
            <StatCard label="Blocked URLs" value={overview.blockedUrls} color="text-cyber-blue" />
            <StatCard label="Firewall Rules" value={overview.firewallRules} />
          </div>
          <div className="card">
            <h3 className="font-semibold mb-3">Security Posture</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-cyber-surface rounded-lg">
                <span>Content Filtering</span>
                <span className="text-green-400">Active — {overview.blockedUrls} rules</span>
              </div>
              <div className="flex justify-between p-3 bg-cyber-surface rounded-lg">
                <span>Network Firewall</span>
                <span className="text-green-400">Active — {overview.firewallRules} rules</span>
              </div>
              <div className="flex justify-between p-3 bg-cyber-surface rounded-lg">
                <span>Endpoint Scanning</span>
                <span className={overview.infectedStations > 0 ? 'text-cyber-warning' : 'text-green-400'}>
                  {overview.infectedStations > 0 ? `${overview.infectedStations} stations need attention` : 'All stations clean'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'incidents' && (
        <>
          <div className="mb-4">
            <button onClick={() => { setShowIncident(true); setForm({}); }} className="btn btn-primary">
              <Plus size={16} /> Report Incident
            </button>
          </div>
          <div className="card table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Type</th><th>Severity</th><th>Station</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <tr key={inc.id}>
                    <td className="font-medium">{inc.title}</td>
                    <td className="capitalize text-sm">{inc.incident_type.replace(/_/g, ' ')}</td>
                    <td><StatusBadge status={inc.severity} /></td>
                    <td className="font-mono text-sm">{inc.station_number || '-'}</td>
                    <td><StatusBadge status={inc.status} /></td>
                    <td className="text-xs text-slate-500">{new Date(inc.created_at).toLocaleString()}</td>
                    <td>
                      {inc.status !== 'resolved' && inc.status !== 'closed' && (
                        <button onClick={() => resolveIncident(inc.id)} className="btn btn-secondary btn-sm">Resolve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'urls' && (
        <>
          {isAdmin && (
            <div className="mb-4">
              <button onClick={() => { setShowUrl(true); setForm({}); }} className="btn btn-primary">
                <Plus size={16} /> Block URL
              </button>
            </div>
          )}
          <div className="card table-wrap">
            <table>
              <thead><tr><th>Pattern</th><th>Category</th><th>Reason</th><th>Actions</th></tr></thead>
              <tbody>
                {blockedUrls.map(u => (
                  <tr key={u.id}>
                    <td className="font-mono text-cyber-accent text-sm">{u.url_pattern}</td>
                    <td className="capitalize">{u.category}</td>
                    <td className="text-slate-400 text-sm">{u.reason || '-'}</td>
                    <td>
                      {isAdmin && (
                        <button onClick={() => api.security.deleteBlockedUrl(u.id).then(loadAll)} className="btn btn-danger btn-sm">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'firewall' && isAdmin && (
        <>
          <div className="mb-4">
            <button onClick={() => { setShowFw(true); setForm({ rule_type: 'block' }); }} className="btn btn-primary">
              <Plus size={16} /> Add Rule
            </button>
          </div>
          <div className="card table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Type</th><th>Protocol</th><th>Port</th><th>Source</th><th>Dest</th><th>Priority</th><th>Actions</th></tr></thead>
              <tbody>
                {firewall.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.name}</td>
                    <td><StatusBadge status={r.rule_type === 'allow' ? 'available' : 'suspended'} /></td>
                    <td className="font-mono text-sm">{r.protocol}</td>
                    <td className="font-mono text-sm">{r.port || '*'}</td>
                    <td className="text-sm">{r.source_ip || 'any'}</td>
                    <td className="text-sm">{r.destination || 'any'}</td>
                    <td>{r.priority}</td>
                    <td>
                      <button onClick={() => api.security.deleteFirewall(r.id).then(loadAll)} className="btn btn-danger btn-sm">
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'audit' && isAdmin && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
            <tbody>
              {auditLogs.map(l => (
                <tr key={l.id}>
                  <td className="text-xs text-slate-500 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                  <td>{l.user_name || 'System'}</td>
                  <td className="font-mono text-cyber-accent text-sm">{l.action}</td>
                  <td className="text-sm">{l.entity_type} #{l.entity_id}</td>
                  <td className="text-xs text-slate-500 max-w-xs truncate">{l.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showIncident} onClose={() => setShowIncident(false)} title="Report Security Incident" wide>
        <form onSubmit={handleIncident}>
          <Field label="Title"><input className="w-full" required value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select className="w-full" value={form.incident_type || 'other'} onChange={e => setForm({ ...form, incident_type: e.target.value })}>
                {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </Field>
            <Field label="Severity">
              <select className="w-full" value={form.severity || 'medium'} onChange={e => setForm({ ...form, severity: e.target.value })}>
                {['low', 'medium', 'high', 'critical'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Station">
              <select className="w-full" value={form.station_id || ''} onChange={e => setForm({ ...form, station_id: e.target.value })}>
                <option value="">None</option>
                {stations.map(s => <option key={s.id} value={s.id}>{s.station_number}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description"><textarea className="w-full" rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Submit Report</button>
        </form>
      </Modal>

      <Modal open={showUrl} onClose={() => setShowUrl(false)} title="Block URL Pattern">
        <form onSubmit={handleUrl}>
          <Field label="URL Pattern"><input className="w-full" required placeholder="*.example.com" value={form.url_pattern || ''} onChange={e => setForm({ ...form, url_pattern: e.target.value })} /></Field>
          <Field label="Category"><input className="w-full" value={form.category || 'general'} onChange={e => setForm({ ...form, category: e.target.value })} /></Field>
          <Field label="Reason"><input className="w-full" value={form.reason || ''} onChange={e => setForm({ ...form, reason: e.target.value })} /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Add Block Rule</button>
        </form>
      </Modal>

      <Modal open={showFw} onClose={() => setShowFw(false)} title="Add Firewall Rule" wide>
        <form onSubmit={handleFw}>
          <Field label="Rule Name"><input className="w-full" required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select className="w-full" value={form.rule_type || 'block'} onChange={e => setForm({ ...form, rule_type: e.target.value })}>
                <option value="allow">Allow</option>
                <option value="block">Block</option>
              </select>
            </Field>
            <Field label="Protocol"><input className="w-full" value={form.protocol || 'any'} onChange={e => setForm({ ...form, protocol: e.target.value })} /></Field>
            <Field label="Port"><input className="w-full" placeholder="80,443" value={form.port || ''} onChange={e => setForm({ ...form, port: e.target.value })} /></Field>
            <Field label="Priority"><input type="number" className="w-full" value={form.priority || 100} onChange={e => setForm({ ...form, priority: parseInt(e.target.value) })} /></Field>
            <Field label="Source IP"><input className="w-full" value={form.source_ip || ''} onChange={e => setForm({ ...form, source_ip: e.target.value })} /></Field>
            <Field label="Destination"><input className="w-full" value={form.destination || ''} onChange={e => setForm({ ...form, destination: e.target.value })} /></Field>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Create Rule</button>
        </form>
      </Modal>
    </div>
  );
}

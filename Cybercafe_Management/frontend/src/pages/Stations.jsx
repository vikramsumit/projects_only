import { useEffect, useState } from 'react';
import { Plus, Scan, Play, Wrench } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader, StatusBadge, Modal, Field } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [members, setMembers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showStart, setShowStart] = useState(null);
  const [form, setForm] = useState({});
  const { isAdmin } = useAuth();

  useEffect(() => { load(); }, []);

  async function load() {
    const [st, mem] = await Promise.all([api.stations.list(), api.members.list()]);
    setStations(st);
    setMembers(mem.filter(m => m.status === 'active'));
  }

  async function handleAdd(e) {
    e.preventDefault();
    await api.stations.create(form);
    setShowAdd(false);
    setForm({});
    load();
  }

  async function handleScan(id) {
    await api.stations.scan(id);
    load();
  }

  async function handleStartSession(e) {
    e.preventDefault();
    await api.sessions.start({
      station_id: showStart.id,
      member_id: form.member_id || null,
      notes: form.notes,
    });
    setShowStart(null);
    setForm({});
    load();
  }

  async function setMaintenance(id, status) {
    await api.stations.update(id, { status });
    load();
  }

  return (
    <div className="p-8">
      <PageHeader
        title="PC Stations"
        subtitle="Manage terminals, zones, and security scans"
        action={isAdmin && (
          <button onClick={() => setShowAdd(true)} className="btn btn-primary">
            <Plus size={16} /> Add Station
          </button>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stations.map(st => (
          <div key={st.id} className={`card ${st.status === 'in_use' ? 'border-cyber-blue/40' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono font-bold text-cyber-accent">{st.station_number}</p>
                <p className="font-medium">{st.name}</p>
                <p className="text-xs text-slate-500">Zone: {st.zone} · ${st.hourly_rate}/hr</p>
              </div>
              <StatusBadge status={st.status} />
            </div>

            {st.specs && <p className="text-xs text-slate-400 mb-2">{st.specs}</p>}
            {st.ip_address && <p className="text-xs font-mono text-slate-500 mb-3">{st.ip_address}</p>}

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">Scan:</span>
              <StatusBadge status={st.scan_status} />
              {st.last_scan_at && (
                <span className="text-xs text-slate-600">{new Date(st.last_scan_at).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {st.status === 'available' && (
                <button onClick={() => { setShowStart(st); setForm({}); }} className="btn btn-primary btn-sm">
                  <Play size={14} /> Start Session
                </button>
              )}
              <button onClick={() => handleScan(st.id)} className="btn btn-secondary btn-sm">
                <Scan size={14} /> Scan
              </button>
              {st.status !== 'maintenance' && st.status !== 'in_use' && (
                <button onClick={() => setMaintenance(st.id, 'maintenance')} className="btn btn-secondary btn-sm">
                  <Wrench size={14} /> Maintenance
                </button>
              )}
              {st.status === 'maintenance' && (
                <button onClick={() => setMaintenance(st.id, 'available')} className="btn btn-primary btn-sm">
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Station">
        <form onSubmit={handleAdd}>
          <Field label="Station Number"><input className="w-full" required value={form.station_number || ''} onChange={e => setForm({ ...form, station_number: e.target.value })} placeholder="PC-09" /></Field>
          <Field label="Name"><input className="w-full" required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Zone"><input className="w-full" value={form.zone || 'main'} onChange={e => setForm({ ...form, zone: e.target.value })} /></Field>
          <Field label="Specs"><input className="w-full" value={form.specs || ''} onChange={e => setForm({ ...form, specs: e.target.value })} /></Field>
          <Field label="Hourly Rate ($)"><input type="number" step="0.5" className="w-full" value={form.hourly_rate || 5} onChange={e => setForm({ ...form, hourly_rate: parseFloat(e.target.value) })} /></Field>
          <Field label="IP Address"><input className="w-full" value={form.ip_address || ''} onChange={e => setForm({ ...form, ip_address: e.target.value })} placeholder="192.168.1.x" /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Create Station</button>
        </form>
      </Modal>

      <Modal open={!!showStart} onClose={() => setShowStart(null)} title={`Start Session — ${showStart?.station_number}`}>
        <form onSubmit={handleStartSession}>
          <Field label="Member (optional)">
            <select className="w-full" value={form.member_id || ''} onChange={e => setForm({ ...form, member_id: e.target.value || null })}>
              <option value="">Walk-in (no member)</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.full_name} ({m.member_code}) — ${m.balance}</option>
              ))}
            </select>
          </Field>
          <Field label="Notes"><textarea className="w-full" rows={2} value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Start Session</button>
        </form>
      </Modal>
    </div>
  );
}

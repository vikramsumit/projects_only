import { useEffect, useState } from 'react';
import { Square, RefreshCw } from 'lucide-react';
import { api, formatCurrency, formatDuration } from '../api/client';
import { PageHeader, StatusBadge, Modal, Field } from '../components/UI';

export default function Sessions() {
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [endSession, setEndSession] = useState(null);
  const [payment, setPayment] = useState('cash');
  const [tab, setTab] = useState('active');

  useEffect(() => { load(); const i = setInterval(load, 15000); return () => clearInterval(i); }, []);

  async function load() {
    const [a, h] = await Promise.all([api.sessions.active(), api.sessions.list()]);
    setActive(a);
    setHistory(h.filter(s => s.status !== 'active'));
  }

  async function handleEnd(e) {
    e.preventDefault();
    await api.sessions.end(endSession.id, payment);
    setEndSession(null);
    load();
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Sessions"
        subtitle="Monitor and manage active PC sessions"
        action={
          <button onClick={load} className="btn btn-secondary">
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        {['active', 'history'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'} capitalize`}
          >
            {t} {t === 'active' && active.length > 0 && `(${active.length})`}
          </button>
        ))}
      </div>

      {tab === 'active' && (
        active.length === 0 ? (
          <div className="card text-center text-slate-500 py-12">No active sessions</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map(s => (
              <div key={s.id} className="card border-cyber-blue/30">
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="font-mono font-bold text-cyber-blue">{s.station_number}</p>
                    <p className="text-sm">{s.station_name}</p>
                  </div>
                  <StatusBadge status="active" />
                </div>
                <div className="space-y-1 text-sm mb-4">
                  <p>Member: <span className="text-slate-300">{s.member_name || 'Walk-in'}</span></p>
                  <p>Elapsed: <span className="text-cyber-accent font-mono">{formatDuration(s.elapsed_minutes)}</span></p>
                  <p>Current: <span className="text-green-400 font-bold">{formatCurrency(s.current_amount)}</span></p>
                  <p className="text-xs text-slate-500">Started: {new Date(s.start_time).toLocaleTimeString()}</p>
                </div>
                <button onClick={() => { setEndSession(s); setPayment(s.member_id ? 'balance' : 'cash'); }} className="btn btn-danger w-full justify-center">
                  <Square size={14} /> End Session
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'history' && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Station</th><th>Member</th><th>Duration</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map(s => (
                <tr key={s.id}>
                  <td className="font-mono">{s.station_number}</td>
                  <td>{s.member_name || 'Walk-in'}</td>
                  <td>{s.duration_minutes ? formatDuration(s.duration_minutes) : '-'}</td>
                  <td className="text-green-400">{formatCurrency(s.amount)}</td>
                  <td className="capitalize">{s.payment_method}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="text-slate-500 text-xs">{new Date(s.start_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!endSession} onClose={() => setEndSession(null)} title="End Session">
        {endSession && (
          <form onSubmit={handleEnd}>
            <div className="mb-4 p-3 bg-cyber-surface rounded-lg text-sm space-y-1">
              <p>Station: <strong>{endSession.station_number}</strong></p>
              <p>Duration: <strong className="text-cyber-accent">{formatDuration(endSession.elapsed_minutes)}</strong></p>
              <p>Amount: <strong className="text-green-400">{formatCurrency(endSession.current_amount)}</strong></p>
            </div>
            <Field label="Payment Method">
              <select className="w-full" value={payment} onChange={e => setPayment(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                {endSession.member_id && <option value="balance">Member Balance (${endSession.member_balance})</option>}
              </select>
            </Field>
            <button type="submit" className="btn btn-danger w-full justify-center mt-2">Confirm & End Session</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

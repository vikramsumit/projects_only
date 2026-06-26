import { useEffect, useState } from 'react';
import { api, formatCurrency } from '../api/client';
import { PageHeader } from '../components/UI';

export default function Reports() {
  const [revenue, setRevenue] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState('revenue');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const [rev, tx] = await Promise.all([
      api.revenueReport(from, to),
      api.transactions(),
    ]);
    setRevenue(rev);
    setTransactions(tx);
  }

  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0);
  const totalSessions = revenue.reduce((s, r) => s + r.sessions, 0);

  return (
    <div className="p-8">
      <PageHeader title="Reports" subtitle="Revenue analytics and transaction history" />

      <div className="flex gap-2 mb-6">
        {['revenue', 'transactions'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'} capitalize`}>{t}</button>
        ))}
      </div>

      {tab === 'revenue' && (
        <>
          <div className="flex gap-3 mb-6 items-end">
            <div>
              <label className="block text-xs text-slate-400 mb-1">From</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">To</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <button onClick={load} className="btn btn-secondary">Apply</button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card"><p className="text-sm text-slate-400">Total Revenue</p><p className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</p></div>
            <div className="card"><p className="text-sm text-slate-400">Total Sessions</p><p className="text-2xl font-bold">{totalSessions}</p></div>
            <div className="card"><p className="text-sm text-slate-400">Avg per Session</p><p className="text-2xl font-bold">{formatCurrency(totalSessions ? totalRevenue / totalSessions : 0)}</p></div>
          </div>

          <div className="card table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Sessions</th><th>Total Minutes</th><th>Revenue</th></tr></thead>
              <tbody>
                {revenue.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-slate-500 py-8">No revenue data</td></tr>
                ) : revenue.map(r => (
                  <tr key={r.date}>
                    <td>{r.date}</td>
                    <td>{r.sessions}</td>
                    <td>{Math.round(r.total_minutes / 60 * 10) / 10}h</td>
                    <td className="text-green-400 font-bold">{formatCurrency(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'transactions' && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Member</th><th>Type</th><th>Amount</th><th>Description</th><th>By</th></tr></thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-slate-500 py-8">No transactions yet</td></tr>
              ) : transactions.map(t => (
                <tr key={t.id}>
                  <td className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString()}</td>
                  <td>{t.member_name || '-'}</td>
                  <td className="capitalize">{t.type}</td>
                  <td className={t.amount >= 0 ? 'text-green-400' : 'text-cyber-danger'}>{formatCurrency(Math.abs(t.amount))}</td>
                  <td className="text-sm text-slate-400">{t.description || '-'}</td>
                  <td className="text-sm">{t.created_by_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

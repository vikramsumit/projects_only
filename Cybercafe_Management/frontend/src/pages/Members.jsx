import { useEffect, useState } from 'react';
import { Plus, Search, Wallet } from 'lucide-react';
import { api, formatCurrency } from '../api/client';
import { PageHeader, StatusBadge, Modal, Field } from '../components/UI';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showTopup, setShowTopup] = useState(null);
  const [showPackage, setShowPackage] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => { load(); loadPackages(); }, []);

  async function load() {
    setMembers(await api.members.list(search));
  }

  async function loadPackages() {
    setPackages(await api.packages.list());
  }

  async function handleAdd(e) {
    e.preventDefault();
    await api.members.create(form);
    setShowAdd(false);
    setForm({});
    load();
  }

  async function handleTopup(e) {
    e.preventDefault();
    await api.members.topup(showTopup.id, parseFloat(form.amount), form.description);
    setShowTopup(null);
    setForm({});
    load();
  }

  async function handlePurchase(e) {
    e.preventDefault();
    await api.packages.purchase(showPackage.id, parseInt(form.package_id));
    setShowPackage(null);
    setForm({});
    load();
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Members"
        subtitle="Customer accounts, balances, and packages"
        action={
          <button onClick={() => { setShowAdd(true); setForm({}); }} className="btn btn-primary">
            <Plus size={16} /> Add Member
          </button>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-9"
            placeholder="Search by name, code, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
        </div>
        <button onClick={load} className="btn btn-secondary">Search</button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Balance</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td className="font-mono text-cyber-accent">{m.member_code}</td>
                <td className="font-medium">{m.full_name}</td>
                <td className="text-slate-400">{m.email || '-'}</td>
                <td className="text-slate-400">{m.phone || '-'}</td>
                <td><StatusBadge status={m.membership_type} /></td>
                <td className="text-green-400 font-bold">{formatCurrency(m.balance)}</td>
                <td><StatusBadge status={m.status} /></td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => { setShowTopup(m); setForm({}); }} className="btn btn-secondary btn-sm">
                      <Wallet size={12} /> Top Up
                    </button>
                    <button onClick={() => { setShowPackage(m); setForm({}); }} className="btn btn-secondary btn-sm">Package</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Member">
        <form onSubmit={handleAdd}>
          <Field label="Full Name"><input className="w-full" required value={form.full_name || ''} onChange={e => setForm({ ...form, full_name: e.target.value })} /></Field>
          <Field label="Email"><input type="email" className="w-full" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><input className="w-full" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Membership Type">
            <select className="w-full" value={form.membership_type || 'standard'} onChange={e => setForm({ ...form, membership_type: e.target.value })}>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="student">Student</option>
            </select>
          </Field>
          <Field label="Initial Balance ($)"><input type="number" step="0.01" className="w-full" value={form.balance || 0} onChange={e => setForm({ ...form, balance: parseFloat(e.target.value) })} /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Create Member</button>
        </form>
      </Modal>

      <Modal open={!!showTopup} onClose={() => setShowTopup(null)} title={`Top Up — ${showTopup?.full_name}`}>
        <form onSubmit={handleTopup}>
          <Field label="Amount ($)"><input type="number" step="0.01" min="0.01" className="w-full" required value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value })} /></Field>
          <Field label="Description"><input className="w-full" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Cash top-up" /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Add Balance</button>
        </form>
      </Modal>

      <Modal open={!!showPackage} onClose={() => setShowPackage(null)} title={`Buy Package — ${showPackage?.full_name}`}>
        <form onSubmit={handlePurchase}>
          <Field label="Package">
            <select className="w-full" required value={form.package_id || ''} onChange={e => setForm({ ...form, package_id: e.target.value })}>
              <option value="">Select package...</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.hours}h for {formatCurrency(p.price)}</option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-slate-500 mb-4">Balance: {formatCurrency(showPackage?.balance)}</p>
          <button type="submit" className="btn btn-primary w-full justify-center">Purchase</button>
        </form>
      </Modal>
    </div>
  );
}

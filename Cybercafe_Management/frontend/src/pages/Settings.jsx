import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api, formatCurrency } from '../api/client';
import { PageHeader, Modal, Field } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tab, setTab] = useState('users');
  const [showUser, setShowUser] = useState(false);
  const [showPkg, setShowPkg] = useState(false);
  const [form, setForm] = useState({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  async function load() {
    const [u, p] = await Promise.all([api.users.list(), api.packages.list()]);
    setUsers(u);
    setPackages(p);
  }

  async function handleUser(e) {
    e.preventDefault();
    await api.users.create(form);
    setShowUser(false);
    setForm({});
    load();
  }

  async function handlePkg(e) {
    e.preventDefault();
    await api.packages.create(form);
    setShowPkg(false);
    setForm({});
    load();
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <PageHeader title="Settings" subtitle="Admin access required" />
        <div className="card text-center text-slate-500 py-12">You don't have permission to access settings.</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader title="Settings" subtitle="Manage staff accounts and pricing packages" />

      <div className="flex gap-2 mb-6">
        {['users', 'packages'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'} capitalize`}>{t}</button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          <div className="mb-4">
            <button onClick={() => { setShowUser(true); setForm({ role: 'staff' }); }} className="btn btn-primary">
              <Plus size={16} /> Add Staff
            </button>
          </div>
          <div className="card table-wrap">
            <table>
              <thead><tr><th>Username</th><th>Full Name</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="font-mono">{u.username}</td>
                    <td>{u.full_name}</td>
                    <td className="capitalize">{u.role}</td>
                    <td className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => { if (confirm('Delete user?')) api.users.delete(u.id).then(load); }} className="btn btn-danger btn-sm">
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

      {tab === 'packages' && (
        <>
          <div className="mb-4">
            <button onClick={() => { setShowPkg(true); setForm({}); }} className="btn btn-primary">
              <Plus size={16} /> Add Package
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(p => (
              <div key={p.id} className="card">
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-2xl font-bold text-cyber-accent my-2">{formatCurrency(p.price)}</p>
                <p className="text-sm text-slate-400">{p.hours} hours</p>
                {p.description && <p className="text-xs text-slate-500 mt-2">{p.description}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={showUser} onClose={() => setShowUser(false)} title="Add Staff User">
        <form onSubmit={handleUser}>
          <Field label="Username"><input className="w-full" required value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} /></Field>
          <Field label="Full Name"><input className="w-full" required value={form.full_name || ''} onChange={e => setForm({ ...form, full_name: e.target.value })} /></Field>
          <Field label="Password"><input type="password" className="w-full" required value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} /></Field>
          <Field label="Role">
            <select className="w-full" value={form.role || 'staff'} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Create User</button>
        </form>
      </Modal>

      <Modal open={showPkg} onClose={() => setShowPkg(false)} title="Add Time Package">
        <form onSubmit={handlePkg}>
          <Field label="Name"><input className="w-full" required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Hours"><input type="number" step="0.5" className="w-full" required value={form.hours || ''} onChange={e => setForm({ ...form, hours: parseFloat(e.target.value) })} /></Field>
          <Field label="Price ($)"><input type="number" step="0.01" className="w-full" required value={form.price || ''} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} /></Field>
          <Field label="Description"><textarea className="w-full" rows={2} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Create Package</button>
        </form>
      </Modal>
    </div>
  );
}

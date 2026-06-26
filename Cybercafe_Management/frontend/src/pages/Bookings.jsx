import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader, StatusBadge, Modal, Field } from '../components/UI';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [stations, setStations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => { load(); loadOptions(); }, []);

  async function load() {
    setBookings(await api.bookings.list(filterDate));
  }

  async function loadOptions() {
    const [m, s] = await Promise.all([api.members.list(), api.stations.list()]);
    setMembers(m.filter(x => x.status === 'active'));
    setStations(s);
  }

  async function handleAdd(e) {
    e.preventDefault();
    await api.bookings.create({ ...form, station_id: form.station_id || null });
    setShowAdd(false);
    setForm({});
    load();
  }

  async function cancelBooking(id) {
    if (!confirm('Cancel this booking?')) return;
    await api.bookings.cancel(id);
    load();
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Bookings"
        subtitle="Schedule and manage PC reservations"
        action={
          <button onClick={() => { setShowAdd(true); setForm({}); }} className="btn btn-primary">
            <Plus size={16} /> New Booking
          </button>
        }
      />

      <div className="flex gap-3 mb-6">
        <input type="date" className="w-auto" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        <button onClick={load} className="btn btn-secondary">Filter</button>
        {filterDate && <button onClick={() => { setFilterDate(''); setTimeout(load, 0); }} className="btn btn-secondary">Clear</button>}
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Time</th><th>Member</th><th>Station</th><th>Status</th><th>Notes</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-slate-500 py-8">No bookings found</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id}>
                <td>{b.booking_date}</td>
                <td className="font-mono text-sm">{b.start_time} – {b.end_time}</td>
                <td>
                  <p>{b.member_name}</p>
                  <p className="text-xs text-slate-500">{b.member_code}</p>
                </td>
                <td>{b.station_name || 'Any available'}</td>
                <td><StatusBadge status={b.status} /></td>
                <td className="text-slate-400 text-sm">{b.notes || '-'}</td>
                <td>
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <button onClick={() => cancelBooking(b.id)} className="btn btn-danger btn-sm">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Booking" wide>
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Member">
              <select className="w-full" required value={form.member_id || ''} onChange={e => setForm({ ...form, member_id: e.target.value })}>
                <option value="">Select member...</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.full_name} ({m.member_code})</option>)}
              </select>
            </Field>
            <Field label="Station (optional)">
              <select className="w-full" value={form.station_id || ''} onChange={e => setForm({ ...form, station_id: e.target.value })}>
                <option value="">Any available</option>
                {stations.map(s => <option key={s.id} value={s.id}>{s.station_number} — {s.name}</option>)}
              </select>
            </Field>
            <Field label="Date"><input type="date" className="w-full" required value={form.booking_date || ''} onChange={e => setForm({ ...form, booking_date: e.target.value })} /></Field>
            <Field label="Start Time"><input type="time" className="w-full" required value={form.start_time || ''} onChange={e => setForm({ ...form, start_time: e.target.value })} /></Field>
            <Field label="End Time"><input type="time" className="w-full" required value={form.end_time || ''} onChange={e => setForm({ ...form, end_time: e.target.value })} /></Field>
          </div>
          <Field label="Notes"><textarea className="w-full" rows={2} value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
          <button type="submit" className="btn btn-primary w-full justify-center mt-2">Create Booking</button>
        </form>
      </Modal>
    </div>
  );
}

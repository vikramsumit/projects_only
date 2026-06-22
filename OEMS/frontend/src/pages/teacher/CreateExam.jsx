import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { Alert } from '../../components/State';
import api from '../../services/api';

const CreateExam = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', subject: '', description: '', durationMinutes: 30, isActive: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/exams', form);
      navigate(`/teacher/exams/${data._id}/questions`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Create Exam" subtitle="Add basic exam details first, then add MCQ questions." />
      <form onSubmit={submit} className="card max-w-2xl space-y-4">
        {error && <Alert>{error}</Alert>}
        <input className="input" placeholder="Exam title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input" type="number" min="1" placeholder="Duration minutes" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Active exam
        </label>
        <button className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Exam'}</button>
      </form>
    </>
  );
};

export default CreateExam;

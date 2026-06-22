import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Loading } from '../../components/State';
import api from '../../services/api';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/reports/summary').then(({ data }) => setSummary(data));
  }, []);

  if (!summary) return <Loading />;

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="A quick overview of users, exams, and attempts." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Total Users</p><p className="mt-2 text-3xl font-semibold">{summary.totalUsers}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Total Exams</p><p className="mt-2 text-3xl font-semibold">{summary.totalExams}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Total Attempts</p><p className="mt-2 text-3xl font-semibold">{summary.totalAttempts}</p></div>
      </div>
    </>
  );
};

export default AdminDashboard;

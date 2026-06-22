import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Loading } from '../../components/State';
import api from '../../services/api';

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams/my-exams')
      .then(({ data }) => setExams(data))
      .finally(() => setLoading(false));
  }, []);

  const active = exams.filter((exam) => exam.isActive).length;

  return (
    <>
      <PageHeader title="Teacher Dashboard" subtitle="Create exams, manage questions, and review submissions." />
      {loading ? <Loading /> : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card"><p className="text-sm text-slate-500">My Exams</p><p className="mt-2 text-3xl font-semibold">{exams.length}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Active Exams</p><p className="mt-2 text-3xl font-semibold">{active}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Inactive Exams</p><p className="mt-2 text-3xl font-semibold">{exams.length - active}</p></div>
        </div>
      )}
    </>
  );
};

export default TeacherDashboard;

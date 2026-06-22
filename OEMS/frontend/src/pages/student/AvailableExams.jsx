import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { Empty, Loading } from '../../components/State';
import api from '../../services/api';

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams/available')
      .then(({ data }) => setExams(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Available Exams" subtitle="Choose an active MCQ exam and submit your answers." />
      {loading ? <Loading /> : exams.length === 0 ? <Empty text="No active exams available." /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <div className="card" key={exam._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{exam.title}</h2>
                  <p className="text-sm text-slate-500">{exam.subject} • {exam.durationMinutes} minutes</p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Active</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{exam.description || 'No description provided.'}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">{exam.totalMarks} marks</span>
                <Link className="btn-primary" to={`/student/exams/${exam._id}`}>Attempt</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AvailableExams;

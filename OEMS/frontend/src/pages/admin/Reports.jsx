import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Empty, Loading } from '../../components/State';
import api from '../../services/api';

const Reports = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/reports/summary').then(({ data }) => setSummary(data));
  }, []);

  if (!summary) return <Loading />;

  return (
    <>
      <PageHeader title="Reports" subtitle="Simple counts and latest submissions." />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Users</p><p className="mt-2 text-3xl font-semibold">{summary.totalUsers}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Exams</p><p className="mt-2 text-3xl font-semibold">{summary.totalExams}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Attempts</p><p className="mt-2 text-3xl font-semibold">{summary.totalAttempts}</p></div>
      </div>
      {summary.recentSubmissions.length === 0 ? <Empty text="No recent submissions." /> : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="table-cell">Student</th><th className="table-cell">Exam</th><th className="table-cell">Score</th><th className="table-cell">Submitted</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {summary.recentSubmissions.map((item) => (
                <tr key={item._id}>
                  <td className="table-cell font-medium">{item.studentId?.name}</td>
                  <td className="table-cell">{item.examId?.title}</td>
                  <td className="table-cell">{item.score} / {item.totalMarks}</td>
                  <td className="table-cell">{new Date(item.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Reports;

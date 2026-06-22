import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Empty, Loading } from '../../components/State';
import api from '../../services/api';

const TeacherResults = () => {
  const [exams, setExams] = useState([]);
  const [selected, setSelected] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams/my-exams').then(({ data }) => {
      setExams(data);
      if (data[0]) setSelected(data[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/exams/${selected}/results`).then(({ data }) => setResults(data));
  }, [selected]);

  return (
    <>
      <PageHeader title="Results" subtitle="View submissions for your exams." />
      {loading ? <Loading /> : exams.length === 0 ? <Empty text="Create an exam first." /> : (
        <div className="space-y-4">
          <select className="input max-w-md" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {exams.map((exam) => <option key={exam._id} value={exam._id}>{exam.title}</option>)}
          </select>
          {results.length === 0 ? <Empty text="No submissions for this exam yet." /> : (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full min-w-[680px] text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr><th className="table-cell">Student</th><th className="table-cell">Email</th><th className="table-cell">Score</th><th className="table-cell">Submitted</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td className="table-cell font-medium">{result.studentId?.name}</td>
                      <td className="table-cell">{result.studentId?.email}</td>
                      <td className="table-cell">{result.score} / {result.totalMarks}</td>
                      <td className="table-cell">{new Date(result.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TeacherResults;

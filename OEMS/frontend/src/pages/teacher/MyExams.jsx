import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { Empty, Loading } from '../../components/State';
import api from '../../services/api';

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/exams/my-exams').then(({ data }) => setExams(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    await api.delete(`/exams/${id}`);
    load();
  };

  return (
    <>
      <PageHeader title="My Exams" subtitle="Edit exam status and manage questions." />
      {loading ? <Loading /> : exams.length === 0 ? <Empty text="No exams created yet." /> : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="table-cell">Title</th><th className="table-cell">Subject</th><th className="table-cell">Marks</th><th className="table-cell">Status</th><th className="table-cell">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td className="table-cell font-medium">{exam.title}</td>
                  <td className="table-cell">{exam.subject}</td>
                  <td className="table-cell">{exam.totalMarks}</td>
                  <td className="table-cell">{exam.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <Link className="btn-secondary" to={`/teacher/exams/${exam._id}/questions`}>Questions</Link>
                      <button className="btn-secondary" onClick={() => remove(exam._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MyExams;

import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Empty, Loading } from '../../components/State';
import api from '../../services/api';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/exams')
      .then(({ data }) => setExams(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Manage Exams" subtitle="All exams created by teachers." />
      {loading ? <Loading /> : exams.length === 0 ? <Empty text="No exams found." /> : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="table-cell">Title</th><th className="table-cell">Subject</th><th className="table-cell">Teacher</th><th className="table-cell">Marks</th><th className="table-cell">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td className="table-cell font-medium">{exam.title}</td>
                  <td className="table-cell">{exam.subject}</td>
                  <td className="table-cell">{exam.createdBy?.name}</td>
                  <td className="table-cell">{exam.totalMarks}</td>
                  <td className="table-cell">{exam.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ManageExams;

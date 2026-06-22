import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Empty, Loading } from '../../components/State';
import api from '../../services/api';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/results/my-results')
      .then(({ data }) => setResults(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="My Results" subtitle="Your submitted exam scores." />
      {loading ? <Loading /> : results.length === 0 ? <Empty text="No attempts submitted yet." /> : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="table-cell">Exam</th><th className="table-cell">Subject</th><th className="table-cell">Score</th><th className="table-cell">Submitted</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.map((result) => (
                <tr key={result._id}>
                  <td className="table-cell font-medium">{result.examId?.title}</td>
                  <td className="table-cell">{result.examId?.subject}</td>
                  <td className="table-cell">{result.score} / {result.totalMarks}</td>
                  <td className="table-cell">{new Date(result.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MyResults;

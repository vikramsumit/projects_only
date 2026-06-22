import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { Alert, Empty, Loading } from '../../components/State';
import api from '../../services/api';

const AttemptExam = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/exams/${id}`)
      .then(({ data }) => setData(data))
      .catch(() => setError('Unable to load exam'))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
          questionId,
          selectedOptionIndex: Number(selectedOptionIndex)
        }))
      };
      const { data } = await api.post(`/exams/${id}/submit`, payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!data) return <Empty text="Exam not found." />;

  return (
    <>
      <PageHeader title={data.exam.title} subtitle={`${data.exam.subject} • ${data.exam.totalMarks} marks`} />
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}
      {result ? (
        <div className="card max-w-xl">
          <h2 className="text-xl font-semibold">Submitted Successfully</h2>
          <p className="mt-2 text-slate-600">Score: <span className="font-semibold text-slate-950">{result.score}</span> / {result.totalMarks}</p>
          <p className="mt-1 text-sm text-slate-500">Status: {result.status}</p>
          <Link className="btn-primary mt-5" to="/student/results">View Result History</Link>
        </div>
      ) : data.questions.length === 0 ? <Empty text="This exam has no questions yet." /> : (
        <form onSubmit={submit} className="space-y-4">
          {data.questions.map((question, index) => (
            <div className="card" key={question._id}>
              <div className="flex justify-between gap-4">
                <h2 className="font-semibold">{index + 1}. {question.questionText}</h2>
                <span className="text-sm text-slate-500">{question.marks} mark(s)</span>
              </div>
              <div className="mt-4 grid gap-2">
                {question.options.map((option, optionIndex) => (
                  <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 p-3 text-sm hover:bg-slate-50">
                    <input
                      type="radio"
                      name={question._id}
                      value={optionIndex}
                      checked={answers[question._id] === String(optionIndex)}
                      onChange={(e) => setAnswers({ ...answers, [question._id]: e.target.value })}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Exam'}</button>
        </form>
      )}
    </>
  );
};

export default AttemptExam;

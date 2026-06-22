import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { Alert, Empty, Loading } from '../../components/State';
import api from '../../services/api';

const blank = { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, marks: 1 };

const ManageQuestions = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get(`/exams/${id}`).then(({ data }) => {
      setExam(data.exam);
      setQuestions(data.questions);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const setOption = (index, value) => {
    const options = [...form.options];
    options[index] = value;
    setForm({ ...form, options });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (editingId) {
      await api.put(`/questions/${editingId}`, form);
      setMessage('Question updated');
    } else {
      await api.post(`/exams/${id}/questions`, form);
      setMessage('Question added');
    }
    setForm(blank);
    setEditingId(null);
    load();
  };

  const edit = (question) => {
    setEditingId(question._id);
    setForm({
      questionText: question.questionText,
      options: question.options,
      correctOptionIndex: question.correctOptionIndex,
      marks: question.marks
    });
  };

  const remove = async (questionId) => {
    await api.delete(`/questions/${questionId}`);
    load();
  };

  if (loading) return <Loading />;

  return (
    <>
      <PageHeader title="Manage Questions" subtitle={exam ? `${exam.title} • ${exam.subject}` : ''} />
      <form onSubmit={submit} className="card mb-6 space-y-4">
        {message && <Alert type="success">{message}</Alert>}
        <textarea className="input min-h-20" placeholder="Question text" value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} required />
        <div className="grid gap-3 md:grid-cols-2">
          {form.options.map((option, index) => (
            <input key={index} className="input" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => setOption(index, e.target.value)} required />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <select className="input" value={form.correctOptionIndex} onChange={(e) => setForm({ ...form, correctOptionIndex: Number(e.target.value) })}>
            {form.options.map((_, index) => <option key={index} value={index}>Correct option {index + 1}</option>)}
          </select>
          <input className="input" type="number" min="1" value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} />
        </div>
        <div className="flex gap-2">
          <button className="btn-primary">{editingId ? 'Update Question' : 'Add Question'}</button>
          {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</button>}
        </div>
      </form>

      {questions.length === 0 ? <Empty text="No questions added yet." /> : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div className="card" key={question._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{index + 1}. {question.questionText}</h2>
                  <p className="mt-1 text-sm text-slate-500">Correct: option {question.correctOptionIndex + 1} • {question.marks} mark(s)</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => edit(question)}>Edit</button>
                  <button className="btn-secondary" onClick={() => remove(question._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ManageQuestions;

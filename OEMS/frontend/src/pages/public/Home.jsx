import { Link } from 'react-router-dom';
import { useAuth, dashboardPath } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">College project</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Online Examination Management System
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A practical exam platform for students, teachers, and admins with MCQ exams, automatic scoring, and simple reports.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to={user ? dashboardPath(user.role) : '/login'}>Open Dashboard</Link>
            <Link className="btn-secondary" to="/register">Student Register</Link>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-3">
            {['Create exam', 'Add MCQs', 'Attempt exam', 'Auto score', 'Review results'].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-white p-4 shadow-sm">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-sm font-semibold text-white">{index + 1}</span>
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

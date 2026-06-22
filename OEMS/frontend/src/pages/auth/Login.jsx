import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/State';
import { dashboardPath, useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      navigate(dashboardPath(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-slate-500">Use your student, teacher, or admin account.</p>
        </div>
        {error && <Alert>{error}</Alert>}
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        <p className="text-center text-sm text-slate-500">
          New student? <Link className="font-medium text-slate-900" to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

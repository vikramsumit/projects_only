import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,136,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="card w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyber-accent/10 border border-cyber-accent/30 mb-4">
            <ShieldCheck className="text-cyber-accent" size={32} />
          </div>
          <h1 className="text-2xl font-bold">CyberShield Cafe</h1>
          <p className="text-slate-400 text-sm mt-1">Secure Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-cyber-danger text-sm bg-cyber-danger/10 border border-cyber-danger/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-3">
            <Lock size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-cyber-border text-center text-xs text-slate-500">
          <p>Demo: admin / admin123</p>
          <p>Staff: staff / staff123</p>
        </div>
      </div>
    </div>
  );
}

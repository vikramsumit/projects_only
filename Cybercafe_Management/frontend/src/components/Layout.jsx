import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Monitor, Users, Clock, Calendar, Shield,
  BarChart3, Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/stations', icon: Monitor, label: 'Stations' },
  { to: '/sessions', icon: Clock, label: 'Sessions' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/security', icon: Shield, label: 'Security' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings', admin: true },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-cyber-surface border-r border-cyber-border flex flex-col shrink-0">
        <div className="p-5 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-cyber-accent" size={28} />
            <div>
              <h1 className="font-bold text-lg leading-tight">CyberShield</h1>
              <p className="text-xs text-slate-400">Cafe Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.filter(n => !n.admin || isAdmin).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30'
                    : 'text-slate-400 hover:text-white hover:bg-cyber-card'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-cyber-border">
          <div className="text-sm mb-2">
            <p className="font-medium">{user?.full_name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary w-full justify-center text-sm">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

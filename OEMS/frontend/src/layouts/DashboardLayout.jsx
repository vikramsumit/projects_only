import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  student: [
    ['Available Exams', '/student'],
    ['My Results', '/student/results']
  ],
  teacher: [
    ['Dashboard', '/teacher'],
    ['Create Exam', '/teacher/create'],
    ['My Exams', '/teacher/exams'],
    ['Results', '/teacher/results']
  ],
  admin: [
    ['Dashboard', '/admin'],
    ['Manage Users', '/admin/users'],
    ['Manage Exams', '/admin/exams'],
    ['Reports', '/admin/reports']
  ]
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
        <Link to="/" className="text-xl font-bold text-slate-950">OEMS</Link>
        <p className="mt-1 text-sm capitalize text-slate-500">{user.role} panel</p>
        <nav className="mt-8 space-y-1">
          {items.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === `/${user.role}`}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-950">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto md:hidden">
            {items.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                end={path === `/${user.role}`}
                className={({ isActive }) =>
                  `shrink-0 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

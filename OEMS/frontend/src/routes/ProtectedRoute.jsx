import { Navigate, Outlet } from 'react-router-dom';
import { dashboardPath, useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={dashboardPath(user.role)} replace />;

  return <Outlet />;
};

export default ProtectedRoute;

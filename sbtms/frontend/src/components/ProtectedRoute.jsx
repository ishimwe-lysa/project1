import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Loader />;
  if (!user) {
    // Determine login page based on allowed roles
    const loginPath = role && Array.isArray(role) 
      ? role.includes('admin') 
        ? '/admin/login' 
        : role.includes('manager') 
          ? '/manager/login' 
          : '/login'
      : role === 'admin'
        ? '/admin/login'
        : role === 'manager'
          ? '/manager/login'
          : '/login';
    return <Navigate to={loginPath} state={{ from: loc }} replace />;
  }
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) return <Navigate to="/" replace />;
  }
  return children;
}

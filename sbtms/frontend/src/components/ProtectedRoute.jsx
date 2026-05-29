import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Loader />;
  if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} state={{ from: loc }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

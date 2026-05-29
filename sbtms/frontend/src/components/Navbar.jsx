import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`;
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-brand-700 hover:text-brand-800 transition">🚌 SBTMS</Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkCls} end>Home</NavLink>
          <NavLink to="/buses" className={linkCls}>Buses</NavLink>
          {user?.role === 'passenger' && (
            <>
              <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>
              <NavLink to="/my-bookings" className={linkCls}>My Bookings</NavLink>
              <NavLink to="/profile" className={linkCls}>Profile</NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkCls}>Admin</NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary shadow-md hover:shadow-lg">Register</Link>
            </>
          )}
          {user && (
            <>
              <span className="hidden sm:inline text-sm text-slate-600">Hi, {user.name}</span>
              <button className="btn-outline shadow-sm hover:shadow" onClick={() => { logout(); nav('/'); }}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

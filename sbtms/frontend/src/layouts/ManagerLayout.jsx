import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ManagerLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const item = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm transition ${isActive ? 'bg-brand-600 text-white shadow-md' : 'text-slate-200 hover:bg-slate-700 hover:shadow'}`;
  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 flex flex-col">
        <h1 className="text-lg font-bold mb-6">🚌 SBTMS Manager</h1>
        <nav className="space-y-1 flex-1">
          <NavLink to="/manager" end className={item}>Dashboard</NavLink>
          <NavLink to="/manager/routes" className={item}>Routes</NavLink>
          <NavLink to="/manager/schedules" className={item}>Schedules</NavLink>
          <NavLink to="/manager/payments" className={item}>Payments</NavLink>
          <NavLink to="/manager/bookings" className={item}>Bookings</NavLink>
          <NavLink to="/manager/reports" className={item}>Reports</NavLink>
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2">{user?.email}</div>
          <button className="w-full btn-outline text-slate-800 bg-white hover:bg-slate-100 shadow-md" onClick={() => { logout(); nav('/'); }}>
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-x-auto"><Outlet /></main>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      await login(form.email, form.password);
      nav(loc.state?.from?.pathname || '/dashboard');
    } catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto card">
      <Link to="/" className="inline-flex items-center mb-4 text-sm text-slate-500 hover:text-brand-600 transition">
        <span className="mr-1">←</span> Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Passenger Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div><label className="label">Password</label><input className="input" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
        {err && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{err}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading?'Signing in…':'Sign in'}</button>
      </form>
      <div className="mt-6 pt-4 border-t space-y-2">
        <p className="text-sm text-slate-600">No account? <Link to="/register" className="text-brand-700 font-medium hover:underline">Register</Link></p>
        <p className="text-xs text-slate-500">Admin? <Link to="/admin/login" className="text-slate-600 hover:text-brand-600 underline">Admin login</Link></p>
      </div>
    </div>
  );
}

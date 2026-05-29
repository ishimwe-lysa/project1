import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ManagerLogin() {
  const { managerLogin } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: 'manager@sbtms.com', password: 'manager123' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await managerLogin(form.email, form.password); nav('/manager'); }
    catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <form onSubmit={submit} className="card max-w-md w-full bg-white/95 backdrop-blur-sm">
        <Link to="/" className="inline-flex items-center mb-4 text-sm text-slate-500 hover:text-brand-600 transition">
          <span className="mr-1">←</span> Back to Home
        </Link>
        <h1 className="text-2xl font-bold mb-1 text-slate-800">Manager Sign in</h1>
        <p className="text-sm text-slate-500 mb-6">SBTMS Management Portal</p>
        <div className="space-y-4">
          <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div><label className="label">Password</label><input className="input" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          {err && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{err}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy?'Signing in…':'Sign in'}</button>
        </div>
      </form>
    </div>
  );
}
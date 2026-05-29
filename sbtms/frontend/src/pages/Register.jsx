import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'' });
  const [err, setErr] = useState(''); const [loading,setLoading]=useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters');
    setLoading(true);
    try { await register(form); nav('/dashboard'); }
    catch (e) { setErr(e.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto card">
      <Link to="/" className="inline-flex items-center mb-4 text-sm text-slate-500 hover:text-brand-600 transition">
        <span className="mr-1">←</span> Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Create your account</h1>
      <form onSubmit={submit} className="space-y-4">
        {['name','email','password','phone','address'].map(f => (
          <div key={f}>
            <label className="label capitalize">{f}</label>
            {f === 'address' ? (
              <textarea className="input min-h-[80px] resize-none" value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})}/>
            ) : (
              <input className="input" type={f==='password'?'password':f==='email'?'email':'text'} required={['name','email','password'].includes(f)}
                value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} />
            )}
          </div>
        ))}
        {err && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{err}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading?'Creating…':'Register'}</button>
      </form>
      <p className="mt-6 pt-4 border-t text-sm text-slate-600">Have an account? <Link to="/login" className="text-brand-700 font-medium hover:underline">Login</Link></p>
    </div>
  );
}

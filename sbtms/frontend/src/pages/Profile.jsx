import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Profile() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { api.get('/users/profile').then(r=>setForm(r.data)); }, []);
  if (!form) return <Loader />;
  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/users/profile', form);
    setForm(data); setMsg('Saved!');
    setTimeout(()=>setMsg(''), 2000);
  };
  return (
    <div className="max-w-lg mx-auto card page-transition">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-3">
          {form?.name?.charAt(0) || 'U'}
        </div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
      </div>
      <form onSubmit={save} className="space-y-4">
        <div><label className="label">Name</label><input className="input" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div><label className="label">Email</label><input className="input" value={form.email||''} disabled/></div>
        <div><label className="label">Phone</label><input className="input" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
        <div><label className="label">Address</label><textarea className="input min-h-[80px] resize-none" value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})}/></div>
        {msg && <p className="text-green-600 text-sm bg-green-50 p-2 rounded">{msg}</p>}
        <button className="btn-primary w-full">Save changes</button>
      </form>
    </div>
  );
}

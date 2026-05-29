import { useEffect, useState } from 'react';
import api from '../../services/api';
import Loader from '../../components/Loader';

export default function CrudPage({ title, endpoint, fields, columns }) {
  const [list, setList] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const empty = Object.fromEntries(fields.map(f=>[f.name, f.default ?? '']));

  const load = () => api.get(endpoint).then(r=>setList(r.data));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [endpoint]);

  const openNew  = () => { setEditing('new'); setForm(empty); };
  const openEdit = (row) => { setEditing(row.id); setForm({ ...empty, ...row }); };

  const save = async (e) => {
    e.preventDefault();
    if (editing === 'new') await api.post(endpoint, form);
    else await api.put(`${endpoint}/${editing}`, form);
    setEditing(null); load();
  };
  const remove = async (id) => {
    if (!confirm('Delete this record?')) return;
    await api.delete(`${endpoint}/${id}`); load();
  };

  if (!list) return <Loader />;

  return (
    <div className="page-transition">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <button className="btn-primary shadow-md hover:shadow-lg" onClick={openNew}>+ New</button>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-brand-50 to-brand-100 text-left">
            <tr>{columns.map(c=> <th key={c.key} className="px-3 py-2 font-semibold text-slate-700">{c.label}</th>)}<th/></tr>
          </thead>
          <tbody>
            {list.map(row => (
              <tr key={row.id} className="border-t hover:bg-slate-50 transition">
                {columns.map(c => <td key={c.key} className="px-3 py-2">{c.render ? c.render(row) : row[c.key]}</td>)}
                <td className="px-3 py-2 whitespace-nowrap">
                  <button className="text-brand-700 mr-3 hover:underline" onClick={()=>openEdit(row)}>Edit</button>
                  <button className="btn-outline !px-2 !py-1 text-xs !text-red-600 border-red-300 hover:bg-red-50" onClick={()=>remove(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={columns.length+1} className="px-3 py-6 text-center text-slate-500">No records.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40 backdrop-blur-sm">
          <form onSubmit={save} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">{editing === 'new' ? `New ${title}` : `Edit ${title}`}</h2>
            <div className="grid grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.name} className={f.full?'col-span-2':''}>
                  <label className="label">{f.label}</label>
                  {f.type === 'select' ? (
                    <select className="input" value={form[f.name] ?? ''} onChange={e=>setForm({...form,[f.name]:e.target.value})}>
                      <option value="">—</option>
                      {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input className="input" type={f.type||'text'} required={f.required}
                      value={form[f.name] ?? ''} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-outline" onClick={()=>setEditing(null)}>Cancel</button>
              <button className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

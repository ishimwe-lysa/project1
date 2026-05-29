import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Buses() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    origin: params.get('origin') || '',
    destination: params.get('destination') || '',
    date: params.get('date') || '',
  });
  const [list, setList] = useState(null);

  const fetchList = async () => {
    setList(null);
    const q = new URLSearchParams(Object.entries(filters).filter(([,v])=>v));
    const { data } = await api.get('/schedules?' + q.toString());
    setList(data);
  };
  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [params]);

  const apply = (e) => { e.preventDefault();
    const q = new URLSearchParams(Object.entries(filters).filter(([,v])=>v));
    setParams(q);
  };

  return (
    <div className="page-transition">
      <form onSubmit={apply} className="card grid md:grid-cols-4 gap-3 bg-gradient-to-r from-white to-brand-50">
        <div><label className="label">From</label><input className="input" value={filters.origin}      onChange={e=>setFilters({...filters,origin:e.target.value})}/></div>
        <div><label className="label">To</label>  <input className="input" value={filters.destination} onChange={e=>setFilters({...filters,destination:e.target.value})}/></div>
        <div><label className="label">Date</label><input className="input" type="date" value={filters.date} onChange={e=>setFilters({...filters,date:e.target.value})}/></div>
        <div className="flex items-end"><button className="btn-primary w-full shadow-md hover:shadow-lg">Search</button></div>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800">Available buses</h2>
      {!list ? <Loader /> : list.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-500">No buses match your search.</p>
          <Link to="/" className="btn-outline inline-block mt-4">Back to Home</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(s => (
            <div key={s.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-800">{s.bus_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium">{s.bus_type}</span>
                </div>
                <div className="text-sm text-slate-600">{s.bus_number} · {s.total_seats} seats</div>
                <div className="mt-2 font-medium text-brand-700">{s.origin} → {s.destination}</div>
                <div className="text-xs text-slate-500">
                  Depart {new Date(s.departure_time).toLocaleString()} · Arrive {new Date(s.arrival_time).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-700">RWF {Number(s.fare).toFixed(0)}</div>
                <Link to={`/book/${s.id}`} className="btn-primary mt-2 inline-flex shadow-md hover:shadow-lg">Book now</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../../services/api';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/reports/summary').then(r=>setData(r.data)); }, []);
  if (!data) return <Loader />;
  const { counts, revenue, topRoutes } = data;
  const cards = [
    ['Passengers', counts.users], ['Buses', counts.buses], ['Routes', counts.routes],
    ['Schedules', counts.schedules], ['Active Bookings', counts.bookings], ['Revenue (RWF )', revenue.toFixed(0)],
  ];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(([l,v])=>(
          <div key={l} className="card bg-gradient-to-br from-white to-brand-50 border-l-4 border-brand-600">
            <div className="text-xs uppercase text-brand-700 font-semibold">{l}</div>
            <div className="text-3xl font-bold mt-1 text-slate-800">{v}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h2 className="font-semibold mb-4 text-brand-700">Top routes</h2>
        {topRoutes.length === 0 ? <p className="text-slate-500 text-sm">No bookings yet.</p> : (
          <ul className="divide-y">
            {topRoutes.map((r,i)=>(
              <li key={i} className="py-2 flex justify-between text-sm hover:bg-slate-50 rounded px-2 transition">
                <span className="text-slate-700">{r.origin} → {r.destination}</span>
                <span className="font-semibold text-brand-700">{r.bookings} bookings</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

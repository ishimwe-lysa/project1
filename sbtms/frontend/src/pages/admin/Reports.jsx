import { useEffect, useState } from 'react';
import api from '../../services/api';
import Loader from '../../components/Loader';

export default function Reports() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/reports/summary').then(r=>setData(r.data)); }, []);
  if (!data) return <Loader />;
  return (
    <div className="space-y-6 page-transition">
      <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.counts).map(([k,v]) => (
          <div className="card bg-gradient-to-br from-white to-brand-50 border-l-4 border-brand-600" key={k}>
            <div className="text-xs uppercase text-brand-700 font-semibold">{k}</div>
            <div className="text-3xl font-bold mt-1 text-slate-800">{v}</div>
          </div>
        ))}
        <div className="card bg-gradient-to-br from-white to-brand-50 border-l-4 border-brand-600">
          <div className="text-xs uppercase text-brand-700 font-semibold">Total revenue</div>
          <div className="text-3xl font-bold mt-1 text-slate-800">RWF {Number(data.revenue).toFixed(0)}</div>
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-4 text-brand-700">Top routes</h2>
        <table className="w-full text-sm">
          <thead className="text-left bg-gradient-to-r from-brand-50 to-brand-100"><tr><th className="px-3 py-2 font-semibold">Route</th><th className="px-3 py-2 font-semibold">Bookings</th></tr></thead>
          <tbody>
            {data.topRoutes.map((r,i)=>(
              <tr key={i} className="border-t hover:bg-slate-50 transition">
                <td className="px-3 py-2 text-slate-700">{r.origin} → {r.destination}</td>
                <td className="px-3 py-2 font-semibold text-brand-700">{r.bookings}</td>
              </tr>
            ))}
            {data.topRoutes.length === 0 && <tr><td colSpan={2} className="text-center py-6 text-slate-500">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

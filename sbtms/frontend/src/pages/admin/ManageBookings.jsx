import { useEffect, useState } from 'react';
import api from '../../services/api';
import Loader from '../../components/Loader';

export default function ManageBookings() {
  const [list, setList] = useState(null);
  const load = () => api.get('/bookings').then(r=>setList(r.data));
  useEffect(() => { load(); }, []);
  const cancel = async (id) => { if (!confirm('Cancel this booking?')) return; await api.delete(`/bookings/${id}`); load(); };
  if (!list) return <Loader />;
  return (
    <div className="page-transition">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Bookings</h1>
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-brand-50 to-brand-100 text-left">
            <tr>{['#','Ticket','Passenger','Route','Bus','Seat','Departure','Amount','Status',''].map(h=>(
              <th key={h} className="px-3 py-2 font-semibold text-slate-700">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id} className="border-t hover:bg-slate-50 transition">
                <td className="px-3 py-2">{b.id}</td>
                <td className="px-3 py-2 font-mono text-xs bg-brand-50 px-1 rounded">{b.ticket_code}</td>
                <td className="px-3 py-2">{b.user_name}<div className="text-xs text-slate-500">{b.email}</div></td>
                <td className="px-3 py-2 text-slate-700">{b.origin} → {b.destination}</td>
                <td className="px-3 py-2">{b.bus_number}</td>
                <td className="px-3 py-2"><span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">{b.seat_number}</span></td>
                <td className="px-3 py-2 text-xs">{new Date(b.departure_time).toLocaleString()}</td>
                <td className="px-3 py-2 font-semibold text-brand-700">RWF {Number(b.total_amount).toFixed(0)}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${b.status==='booked'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{b.status}</span></td>
                <td className="px-3 py-2">{b.status==='booked' && <button onClick={()=>cancel(b.id)} className="btn-outline !px-2 !py-1 text-xs !text-red-600 border-red-300 hover:bg-red-50">Cancel</button>}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={10} className="text-center py-6 text-slate-500">No bookings.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

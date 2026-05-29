import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(null);
  useEffect(() => { api.get('/bookings/my').then(r=>setBookings(r.data)); }, []);
  if (!bookings) return <Loader />;
  const active = bookings.filter(b=>b.status==='booked');
  return (
    <div className="space-y-8 page-transition">
      <div className="card bg-gradient-to-r from-brand-50 to-white border-l-4 border-brand-600">
        <h1 className="text-2xl font-bold">Welcome back, {user.name} 👋</h1>
        <p className="text-slate-600">Here's a quick look at your travel activity.</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <Stat label="Active bookings" value={active.length}/>
          <Stat label="Total trips" value={bookings.length}/>
          <Stat label="Spent (RWF )" value={bookings.reduce((s,b)=>s+Number(b.total_amount),0).toFixed(0)}/>
        </div>
        <div className="mt-6 flex gap-3"><Link to="/buses" className="btn-primary">Book a new trip</Link>
          <Link to="/my-bookings" className="btn-outline">View all bookings</Link></div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-brand-700">Recent bookings</h2>
        {bookings.length === 0 && <p className="text-sm text-slate-500">No bookings yet.</p>}
        <ul className="divide-y">
          {bookings.slice(0,5).map(b=>(
            <li key={b.id} className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 transition">
              <div>
                <div className="font-medium">{b.origin} → {b.destination}</div>
                <div className="text-xs text-slate-500">{new Date(b.departure_time).toLocaleString()} · Seat {b.seat_number} · {b.bus_number}</div>
              </div>
              <Link to={`/ticket/${b.id}`} className="text-brand-700 text-sm font-medium hover:underline">View ticket →</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
const Stat = ({label,value}) => (
  <div className="rounded-lg bg-brand-50 p-4 border border-brand-100">
    <div className="text-xs uppercase text-brand-700 font-semibold">{label}</div>
    <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
  </div>
);

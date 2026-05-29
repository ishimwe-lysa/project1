import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Ticket() {
  const { bookingId } = useParams();
  const [b, setB] = useState(null);
  useEffect(() => { api.get(`/bookings/${bookingId}`).then(r=>setB(r.data)); }, [bookingId]);
  if (!b) return <Loader />;
  return (
    <div className="max-w-xl mx-auto page-transition">
      <div className="card border-2 border-dashed border-brand-300 bg-gradient-to-br from-white to-brand-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase text-brand-700 font-semibold flex items-center gap-1">
              🎫 Digital Ticket
            </p>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">{b.origin} → {b.destination}</h1>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${b.status==='booked'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{b.status}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info k="Ticket Code" v={<span className="font-mono bg-brand-50 px-2 py-0.5 rounded">{b.ticket_code}</span>}/>
          <Info k="Passenger" v={b.user_name}/>
          <Info k="Bus" v={<span>{b.bus_name} <span className="text-slate-500">({b.bus_number})</span></span>}/>
          <Info k="Seat No." v={<span className="bg-brand-600 text-white px-2 py-0.5 rounded-full text-xs">{b.seat_number}</span>}/>
          <Info k="Departure" v={new Date(b.departure_time).toLocaleString()}/>
          <Info k="Arrival"   v={new Date(b.arrival_time).toLocaleString()}/>
          <Info k="Fare paid" v={<span className="text-brand-700 font-bold">RWF {Number(b.total_amount).toFixed(0)}</span>}/>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn-outline shadow-sm hover:shadow" onClick={()=>window.print()}>🖨️ Print</button>
          <Link to="/my-bookings" className="btn-primary shadow-md hover:shadow-lg">All my bookings</Link>
        </div>
      </div>
    </div>
  );
}
const Info = ({k,v}) => (<div><div className="text-slate-500 text-xs">{k}</div><div className="font-medium">{v}</div></div>);

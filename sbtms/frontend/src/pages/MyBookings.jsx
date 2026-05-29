import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function MyBookings() {
  const [list, setList] = useState(null);
  const load = () => api.get('/bookings/my').then(r=>setList(r.data));
  useEffect(() => { load(); }, []);
  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await api.delete(`/bookings/${id}`); load();
  };
  if (!list) return <Loader />;
  return (
    <div className="page-transition">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">My Bookings</h1>
      {list.length === 0 ? <div className="card text-center py-12">
        <p className="text-slate-500">You haven't booked any trips yet.</p>
        <Link to="/buses" className="btn-primary inline-block mt-4">Book your first trip</Link>
      </div> : (
        <div className="overflow-x-auto card p-0">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-brand-50 to-brand-100 text-left">
              <tr><Th>Ticket</Th><Th>Route</Th><Th>Bus</Th><Th>Seat</Th><Th>Departure</Th><Th>Amount</Th><Th>Status</Th><Th/></tr>
            </thead>
            <tbody>
              {list.map(b => (
                <tr key={b.id} className="border-t hover:bg-slate-50 transition">
                  <Td>{b.ticket_code}</Td>
                  <Td>{b.origin} → {b.destination}</Td>
                  <Td>{b.bus_number}</Td>
                  <Td>{b.seat_number}</Td>
                  <Td>{new Date(b.departure_time).toLocaleString()}</Td>
                  <Td className="font-semibold">RWF {Number(b.total_amount).toFixed(0)}</Td>
                  <Td><span className={`px-2 py-0.5 rounded-full text-xs ${b.status==='booked'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{b.status}</span></Td>
                  <Td>
                    <Link className="text-brand-700 mr-3 hover:underline" to={`/ticket/${b.id}`}>View</Link>
                    {b.status === 'booked' && <button onClick={()=>cancel(b.id)} className="btn-outline !px-2 !py-1 text-xs !text-red-600 border-red-300 hover:bg-red-50">Cancel</button>}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
const Th = ({children}) => <th className="px-3 py-2 font-semibold">{children}</th>;
const Td = ({children}) => <td className="px-3 py-2">{children}</td>;

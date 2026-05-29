import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Booking() {
  const { scheduleId } = useParams();
  const nav = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [seat, setSeat] = useState(null);
  const [method, setMethod] = useState('card');
  const [err, setErr] = useState(''); const [busy,setBusy]=useState(false);

  const load = async () => {
    const { data } = await api.get(`/schedules/${scheduleId}`);
    setSchedule(data);
  };
  useEffect(() => { load(); }, [scheduleId]);

  if (!schedule) return <Loader />;
  const booked = new Set(schedule.booked_seats);
  const seats = Array.from({ length: schedule.total_seats }, (_, i) => i + 1);

  const submit = async () => {
    if (!seat) return setErr('Please pick a seat');
    setBusy(true); setErr('');
    try {
      const { data } = await api.post('/bookings', { schedule_id: schedule.id, seat_number: seat, payment_method: method });
      nav(`/ticket/${data.booking.id}`);
    } catch (e) {
      setErr(e.response?.data?.message || 'Booking failed');
      load();
    } finally { setBusy(false); }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 page-transition">
      <div className="lg:col-span-2 card">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-800">{schedule.bus_name} <span className="text-sm text-slate-500">({schedule.bus_number})</span></h1>
          <span className="text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700 font-medium">{schedule.bus_type}</span>
        </div>
        <p className="text-slate-600">{schedule.origin} → {schedule.destination}</p>
        <p className="text-xs text-slate-500">Depart {new Date(schedule.departure_time).toLocaleString()}</p>

        <h2 className="mt-6 font-semibold text-brand-700">Select a seat</h2>
        <div className="mt-3 grid grid-cols-6 sm:grid-cols-10 gap-2">
          {seats.map(n => {
            const isBooked = booked.has(n);
            const isSelected = seat === n;
            return (
              <button key={n} disabled={isBooked} onClick={()=>setSeat(n)}
                className={`h-10 rounded-md text-sm font-medium border transition transform hover:scale-105
                  ${isBooked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                    isSelected ? 'bg-brand-600 text-white border-brand-600 shadow-md' :
                    'bg-white hover:bg-brand-50 border-slate-300 hover:border-brand-400'}`}>
                {n}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-slate-500">
          <span><span className="inline-block w-3 h-3 bg-white border border-slate-300 mr-1 align-middle rounded-sm"/>Available</span>
          <span><span className="inline-block w-3 h-3 bg-brand-600 mr-1 align-middle rounded-sm"/>Selected</span>
          <span><span className="inline-block w-3 h-3 bg-slate-200 mr-1 align-middle rounded-sm"/>Booked</span>
        </div>
      </div>

      <div className="card h-fit sticky top-24">
        <h2 className="font-semibold mb-3 text-brand-700">Summary</h2>
        <div className="text-sm text-slate-600 space-y-2 bg-slate-50 p-3 rounded-lg">
          <div>Route: <b className="text-slate-800">{schedule.origin} → {schedule.destination}</b></div>
          <div>Seat: <b className="text-slate-800">{seat || '—'}</b></div>
          <div className="text-lg font-bold text-brand-700">Fare: RWF {Number(schedule.fare).toFixed(0)}</div>
        </div>
        <label className="label mt-4">Payment method</label>
        <select className="input" value={method} onChange={e=>setMethod(e.target.value)}>
          <option value="card">Card</option><option value="upi">UPI</option>
          <option value="wallet">Wallet</option><option value="cash">Cash</option>
        </select>
        {err && <p className="text-red-600 text-sm mt-3 bg-red-50 p-2 rounded">{err}</p>}
        <button className="btn-primary w-full mt-4 shadow-md hover:shadow-lg" disabled={busy} onClick={submit}>
          {busy ? 'Processing…' : 'Confirm & Pay'}
        </button>
      </div>
    </div>
  );
}

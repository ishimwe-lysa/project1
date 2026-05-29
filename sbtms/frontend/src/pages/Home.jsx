import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const nav = useNavigate();
  const [q, setQ] = useState({ origin: '', destination: '', date: '' });
  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(q).filter(([,v]) => v));
    nav(`/buses?${params}`);
  };
  return (
    <div className="page-transition">
      <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white rounded-2xl p-10 md:p-16 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Travel smarter.<br/>Book your bus in seconds.</h1>
        <p className="mt-4 text-brand-50 max-w-xl">Search routes, pick your seat, pay and get a digital ticket — all in one place.</p>
        <form onSubmit={submit} className="mt-8 bg-white/95 backdrop-blur text-slate-800 rounded-xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-3 shadow-2xl">
          <div><label className="label">From</label><input className="input" value={q.origin} onChange={e=>setQ({...q,origin:e.target.value})} placeholder="Nyabugogo"/></div>
          <div><label className="label">To</label><input className="input" value={q.destination} onChange={e=>setQ({...q,destination:e.target.value})} placeholder="Remera"/></div>
          <div><label className="label">Date</label><input className="input" type="date" value={q.date} onChange={e=>setQ({...q,date:e.target.value})}/></div>
          <div className="flex items-end"><button className="btn-primary w-full shadow-lg hover:shadow-xl transform hover:scale-105">Search Buses</button></div>
        </form>
      </section>

      <section className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          ['Wide network','Hundreds of routes across the country.'],
          ['Pick your seat','Visual seat map prevents double bookings.'],
          ['Digital tickets','Instant ticket with unique code after payment.'],
        ].map(([t,d]) => (
          <div key={t} className="card text-center hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-md">🎯</div>
            <h3 className="text-lg font-semibold text-slate-800">{t}</h3>
            <p className="mt-2 text-slate-600 text-sm">{d}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 card flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-50 to-white">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Ready to ride?</h3>
          <p className="text-slate-600 text-sm">Create an account and book your first ticket in minutes.</p>
        </div>
        <Link to="/register" className="btn-primary shadow-lg hover:shadow-xl transform hover:scale-105">Get started</Link>
      </section>
    </div>
  );
}

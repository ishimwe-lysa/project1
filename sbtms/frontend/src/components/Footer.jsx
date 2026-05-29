export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 text-sm flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="text-white font-bold text-lg mb-2">🚌 SBTMS</div>
          <div>Smart Bus Ticketing & Transport Management System</div>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="hover:text-white transition">Home</a>
          <a href="/buses" className="hover:text-white transition">Buses</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

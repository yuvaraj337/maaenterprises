import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black text-[#00E5FF] tracking-tight font-display mb-2">404</h1>
      <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Page Not Found</h2>
      <p className="text-white/60 text-sm max-w-md mb-6">
        The requested page does not exist or has been relocated at MAA Enterprises — Northstar EV.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-black rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-lg"
      >
        Return to Showroom
      </Link>
    </div>
  );
}

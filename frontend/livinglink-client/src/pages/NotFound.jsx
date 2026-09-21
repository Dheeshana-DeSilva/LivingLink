import { Link } from "react-router-dom";
import { MapPin, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Giant number */}
        <div className="text-[9rem] sm:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 select-none mb-2">
          404
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-6">
          <MapPin size={30} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

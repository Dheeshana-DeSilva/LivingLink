import { Link } from "react-router-dom";
import { ShieldOff, Home, ArrowLeft, LogIn } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Giant number */}
        <div className="text-[9rem] sm:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 select-none mb-2">
          403
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-6">
          <ShieldOff size={30} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
          Access Denied
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto">
          You don't have permission to view this page. If you believe this is a
          mistake, please contact an administrator.
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

        <p className="mt-8 text-xs text-slate-600">
          Need admin access?{" "}
          <Link to="/login" className="text-blue-400 hover:underline inline-flex items-center gap-1">
            <LogIn size={11} /> Sign in with the correct account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;

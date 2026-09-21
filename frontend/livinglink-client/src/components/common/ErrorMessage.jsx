import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Standardised error banner with an optional retry callback.
 * Usage:
 *   <ErrorMessage message={error} onRetry={loadData} />
 */
const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  fullPage = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 ${
        fullPage ? "min-h-[60vh]" : "py-16"
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
        <AlertTriangle size={32} />
      </div>

      <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>

      <p className="text-sm text-red-300 max-w-md leading-relaxed mb-6">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-500/20"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

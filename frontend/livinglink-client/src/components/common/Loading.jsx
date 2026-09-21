import { Loader2 } from "lucide-react";

/**
 * Full-page or inline loading spinner with customisable message.
 * Usage: <Loading />  or  <Loading message="Finding matches..." />
 */
const Loading = ({ message = "Loading...", fullPage = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-slate-400 ${
        fullPage ? "min-h-[60vh]" : "py-16"
      }`}
    >
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;

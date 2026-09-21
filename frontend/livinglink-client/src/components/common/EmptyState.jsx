import { Inbox } from "lucide-react";

/**
 * Standardised empty-state placeholder.
 * Usage:
 *   <EmptyState
 *     icon={<Calendar size={48} />}
 *     title="No visits yet"
 *     description="You haven't scheduled any visits."
 *     action={<Link to="/accommodations">Browse Listings</Link>}
 *   />
 */
const EmptyState = ({
  icon,
  title = "Nothing here yet",
  description = "No items to display.",
  action,
  fullPage = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 ${
        fullPage ? "min-h-[60vh]" : "py-16"
      }`}
    >
      <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-6">
        {icon || <Inbox size={36} />}
      </div>

      <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;

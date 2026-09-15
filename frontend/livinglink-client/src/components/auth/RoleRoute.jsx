import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

/**
 * Wraps routes that require a specific role.
 * Should always be used inside a ProtectedRoute.
 *
 * Usage:
 *   <RoleRoute allowedRoles={["ADMIN", "LISTING_OWNER"]}>
 *     <SomePage />
 *   </RoleRoute>
 */
function RoleRoute({ children, allowedRoles = [] }) {
  const { role } = useSelector((state) => state.auth);

  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <ShieldX size={40} className="text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-slate-400 max-w-md mb-8">
          You don't have permission to view this page. This area is restricted
          to {allowedRoles.join(" / ")} accounts.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return children;
}

export default RoleRoute;

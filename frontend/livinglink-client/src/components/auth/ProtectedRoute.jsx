import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Wraps routes that require authentication.
 * Redirects to /login if the user is not logged in,
 * and passes the attempted URL via location state
 * so Login can redirect back after success.
 */
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;

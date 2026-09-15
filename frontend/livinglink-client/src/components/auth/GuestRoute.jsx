import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Wraps routes that should only be visible to guests (not logged in).
 * If the user is already authenticated, redirect them to the dashboard.
 *
 * Used on: /login, /register
 */
function GuestRoute({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user, token, role, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  if (!token && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userRole = role || user?.role;
  if (userRole !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

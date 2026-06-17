import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fullName, email, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          LivingLink Dashboard
        </h1>

        <p className="text-slate-300">Name: {fullName}</p>
        <p className="text-slate-300">Email: {email}</p>
        <p className="text-slate-300">Role: {role}</p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
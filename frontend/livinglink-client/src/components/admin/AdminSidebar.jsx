import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  Star,
  ArrowLeft,
  LogOut,
  Shield,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Accommodations", path: "/admin/accommodations", icon: Building },
    { label: "Visits", path: "/admin/visits", icon: Calendar },
    { label: "Reviews", path: "/admin/reviews", icon: Star },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 text-white p-6 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">
              LivingLink
            </h2>
            <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon size={18} className={active ? "text-white" : "text-slate-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Site</span>
        </Link>

        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

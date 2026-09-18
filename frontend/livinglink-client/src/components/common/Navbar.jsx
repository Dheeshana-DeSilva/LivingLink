import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, Home, Search, Users, Bell, User, LogOut, LayoutDashboard, Sliders, Calendar } from "lucide-react";
import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        isActive(to)
          ? "bg-blue-500/10 text-blue-400 font-medium"
          : "text-slate-300 hover:text-white hover:bg-slate-800/50"
      }`}
    >
      <Icon size={18} className={isActive(to) ? "text-blue-400" : "text-slate-400"} />
      {children}
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-slate-800 shadow-lg shadow-black/20"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
              <Home size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              LivingLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/listings" icon={Search}>Rooms</NavLink>
            <NavLink to="/matches" icon={Users}>Roommates</NavLink>
            
            {isLoggedIn && (
              <>
                <NavLink to="/preferences" icon={Sliders}>Preferences</NavLink>
                <NavLink to="/visits" icon={Calendar}>Visits</NavLink>
                <NavLink to="/notifications" icon={Bell}>Alerts</NavLink>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-2 pl-4 border-l border-slate-700/50">
                {role === "ADMIN" ? (
                  <NavLink to="/admin" icon={LayoutDashboard}>Admin</NavLink>
                ) : (
                  <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                )}
                <NavLink to="/profile" icon={User}>Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-700/50">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl transition-all duration-300 origin-top overflow-hidden ${
          mobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          <NavLink to="/" icon={Home}>Home</NavLink>
          <NavLink to="/listings" icon={Search}>Find Rooms</NavLink>
          <NavLink to="/matches" icon={Users}>Find Roommates</NavLink>
          
          {isLoggedIn ? (
            <>
              <div className="h-px bg-slate-800 my-2"></div>
              <NavLink to="/preferences" icon={Sliders}>Preferences</NavLink>
              <NavLink to="/visits" icon={Calendar}>Visits</NavLink>
              <NavLink to="/notifications" icon={Bell}>Notifications</NavLink>
              {role === "ADMIN" ? (
                <NavLink to="/admin" icon={LayoutDashboard}>Admin Dashboard</NavLink>
              ) : (
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
              )}
              <NavLink to="/profile" icon={User}>Profile</NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 mt-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <div className="h-px bg-slate-800 my-2"></div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link
                  to="/login"
                  className="flex justify-center px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="flex justify-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

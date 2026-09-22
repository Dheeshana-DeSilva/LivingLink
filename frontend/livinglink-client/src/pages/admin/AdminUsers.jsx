import { useEffect, useState } from "react";
import { Users, Search, RefreshCw, Shield, AlertCircle } from "lucide-react";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/admin/users");
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (adminErr) {
        // Also attempt /admin/users
        try {
          const fallbackRes = await api.get("/admin/users");
          setUsers(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } catch {
          // If no admin users endpoint is implemented yet in the backend, show empty with note
          setUsers([]);
          if (adminErr.response?.status !== 404) {
            setError(adminErr.response?.data?.message || "Failed to load users from backend.");
          }
        }
      }
    } catch (err) {
      console.error("Failed to load users", err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = (u.fullName || u.name || "").toLowerCase().includes(q);
    const emailMatch = (u.email || "").toLowerCase().includes(q);
    const roleMatch = (u.role || "").toLowerCase().includes(q);
    return nameMatch || emailMatch || roleMatch;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "LISTING_OWNER":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "ROOM_SEEKER":
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Account Management
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Users
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Inspect registered accounts, permissions, and identity profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table Content */}
      <div className="mt-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center px-6">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Users Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search
                ? "No registered accounts match your search filter."
                : "No user accounts have been retrieved from the user service."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm text-slate-300">
              <thead className="bg-slate-850/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      #{user.id}
                    </td>
                    <td className="py-4 px-6 font-medium text-white">
                      {user.fullName || user.name || "—"}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {user.email || "—"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role || "USER"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

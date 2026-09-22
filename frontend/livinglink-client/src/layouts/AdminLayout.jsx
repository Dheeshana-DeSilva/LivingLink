import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar hidden on mobile */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>
      
      <main className="flex-1 min-h-screen overflow-y-auto bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

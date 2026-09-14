import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-300 font-sans">
      <Navbar />
      
      {/* 
        The main content area grows to fill available space. 
        pt-16 accounts for the fixed Navbar height. 
      */}
      <main className="flex-grow pt-16 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;

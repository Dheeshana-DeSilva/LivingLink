import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Listings from "../pages/Listings";
import AddListing from "../pages/AddListing";
import Profile from "../pages/Profile";
import Preferences from "../pages/Preferences";
import Matches from "../pages/Matches";
import Notifications from "../pages/Notifications";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/add-listing" element={<AddListing />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/preferences" element={<Preferences />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}

export default AppRoutes;
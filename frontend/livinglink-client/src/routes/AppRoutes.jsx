import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Listings from "../pages/Listings";
import AddListing from "../pages/AddListing";
import Profile from "../pages/Profile";
import Preferences from "../pages/Preferences";
import Matches from "../pages/Matches";
import Notifications from "../pages/Notifications";
import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestRoute from "../components/auth/GuestRoute";
import RoleRoute from "../components/auth/RoleRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* ── Public routes ────────────────────────────── */}
        <Route path="/" element={<Home />} />

        {/* ── Guest-only routes (redirect to dashboard if logged in) ── */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* ── Protected routes (require login) ─────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <Preferences />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* ── Public browsing (listings are viewable by anyone) ─── */}
        <Route path="/listings" element={<Listings />} />

        {/* ── Role-restricted: Only LISTING_OWNER can create listings ── */}
        <Route
          path="/add-listing"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["LISTING_OWNER", "ADMIN"]}>
                <AddListing />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}

export default AppRoutes;
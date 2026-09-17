import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Accommodations from "../pages/Accommodations";
import AccommodationDetails from "../pages/AccommodationDetails";
import CreateAccommodation from "../pages/CreateAccommodation";
import EditAccommodation from "../pages/EditAccommodation";
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

        {/* ── Public browsing (listings and details) ─── */}
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/listings" element={<Accommodations />} />
        <Route path="/listings/:id" element={<AccommodationDetails />} />
        <Route path="/accommodations/:id" element={<AccommodationDetails />} />

        {/* ── Accommodation Management (Create & Edit) ─── */}
        <Route
          path="/accommodations/create"
          element={
            <ProtectedRoute>
              <CreateAccommodation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accommodations/:id/edit"
          element={
            <ProtectedRoute>
              <EditAccommodation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-listing"
          element={
            <ProtectedRoute>
              <CreateAccommodation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-listing/:id"
          element={
            <ProtectedRoute>
              <EditAccommodation />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}

export default AppRoutes;
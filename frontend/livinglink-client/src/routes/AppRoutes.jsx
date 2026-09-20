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
import Visits from "../pages/Visits";
import ScheduleVisit from "../pages/ScheduleVisit";
import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestRoute from "../components/auth/GuestRoute";
import RoleRoute from "../components/auth/RoleRoute";

import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAccommodations from "../pages/admin/AdminAccommodations";
import AdminVisits from "../pages/admin/AdminVisits";
import AdminReviews from "../pages/admin/AdminReviews";

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
        <Route
          path="/visits"
          element={
            <ProtectedRoute>
              <Visits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visits/schedule/:accommodationId"
          element={
            <ProtectedRoute>
              <ScheduleVisit />
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

      {/* ── Admin Portal routes (protected by AdminRoute & AdminLayout) ── */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/accommodations" element={<AdminAccommodations />} />
          <Route path="/admin/visits" element={<AdminVisits />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
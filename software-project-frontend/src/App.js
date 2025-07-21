import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import EventDetails from "./pages/EventDetails";
import UserBookings from "./pages/UserBookings";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventAnalytics from "./pages/EventAnalytics";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





// Dashboard pages (placeholders)
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserDashboard from "./pages/UserDashboard";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-5">Loading...</div>; // ✅ Wait for auth check
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
}


function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Router>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboards */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer"
              element={
                <ProtectedRoute allowedRoles={["Organizer"]}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <EventDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/bookings"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/create"
              element={
                <ProtectedRoute allowedRoles={["Organizer"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["Organizer", "Admin"]}>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/analytics"
              element={
                <ProtectedRoute allowedRoles={["Organizer"]}>
                  <EventAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["Admin", "User", "Organizer"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminEvents />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </div>
  );
}

export default App;

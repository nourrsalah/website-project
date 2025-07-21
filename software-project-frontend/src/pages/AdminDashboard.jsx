import React from "react";
import { Link } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";


function AdminDashboard() {
  return (
    <LayoutWrapper>
    <div className="container mt-5">
      <h2>Admin Dashboard 👮</h2>
      <div className="mt-4">
        <Link to="/admin/users" className="btn btn-primary btn-lg me-3">
          Manage Users
        </Link>
        <Link to="/admin/events" className="btn btn-secondary btn-lg">
          Review Events
        </Link>
      </div>
    </div>
    </LayoutWrapper>
  );
}

export default AdminDashboard;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // 👇 Determine the homepage based on the user's role
  const getHomePath = () => {
    if (!user) return "/login";
    if (user.role === "Admin") return "/admin";
    if (user.role === "Organizer") return "/organizer";
    return "/user";
  };

  return (
    <nav
  className="navbar navbar-expand-lg navbar-light bg-light"
  style={{ background: "linear-gradient(to right, #00b09b, #96c93d)" }}
>
  <div className="container-fluid">
    {/* 👇 Use getHomePath() to dynamically route the brand link */}
    <Link className="navbar-brand" to={getHomePath()}>
      Event Booking
    </Link>

    <div className="collapse navbar-collapse">
      <ul className="navbar-nav ml-auto">
        {user ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
            {user.role === "Admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin Dashboard
                </Link>
              </li>
            )}
            {user.role === "Organizer" && (
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/analytics">
                  Analytics
                </Link>
              </li>
            )}
            {user.role === "User" && (
              <li className="nav-item">
                <Link className="nav-link" to="/user/bookings">
                  My Bookings
                </Link>
              </li>
            )}
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  </div>
</nav>

  );
}

export default Navbar;
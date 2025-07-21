import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import api from "../services/api"; // 👈 Axios instance
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import LayoutWrapper from "../components/LayoutWrapper";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      login(res.data);
          toast.success("Login successful!");


      // Redirect based on role
      const role = res.data.role;
      if (role === "Admin") navigate("/admin");
      else if (role === "Organizer") navigate("/organizer");
      else navigate("/user");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <LayoutWrapper>
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-success w-100" type="submit">
          Login
        </button>
        {message && <p className="mt-3 text-danger">{message}</p>}

        <p className="mt-3 text-center">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
    </LayoutWrapper>
  );
}

export default Login;

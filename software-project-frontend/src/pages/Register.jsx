// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import LayoutWrapper from "../components/LayoutWrapper";


function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User", // default role
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      toast.success("Registration successful. Please log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
     toast.error(err.response?.data?.message || "Registration failed");
      console.error("🔴 Registration Error:", err);
    }
  };

  return (
    <LayoutWrapper>
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-3">Register</h3>
      <form onSubmit={handleRegister}>
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Role</label>
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="User">User</option>
            <option value="Organizer">Organizer</option>
          </select>
        </div>
        <button className="btn btn-success w-100" type="submit">
          Register
        </button>
        {message && <p className="mt-3 text-info">{message}</p>}
      </form>
    </div>
    </LayoutWrapper>
  );
}

export default Register;

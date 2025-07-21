import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";


function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await api.put("/forgetPassword", form);
      setMessage("Password updated! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <LayoutWrapper>
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-3">Reset Your Password 🔐</h3>
      <form onSubmit={handleReset}>
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
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-warning w-100" type="submit">
          Reset Password
        </button>
        {message && <p className="mt-3">{message}</p>}
      </form>
    </div>
    </LayoutWrapper>
  );
}

export default ForgotPassword;

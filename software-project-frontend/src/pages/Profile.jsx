import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import LayoutWrapper from "../components/LayoutWrapper";


function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setForm(f => ({ ...f, name: res.data.name, email: res.data.email }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    }
  };

  fetchProfile();
}, []); // ✅ no need to include form in dependency array


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/profile", form);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      
    }
  };

  return (
    <LayoutWrapper>
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h3>My Profile 🧍‍♀️</h3>
      <form onSubmit={handleUpdate}>
        <div className="form-group mb-3">
          <label>Name</label>
          <input
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
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <button className="btn btn-success w-100" type="submit">
          Update Profile
        </button>
        {message && <p className="mt-3">{message}</p>}
      </form>
    </div>
    </LayoutWrapper>
  );
}

export default Profile;

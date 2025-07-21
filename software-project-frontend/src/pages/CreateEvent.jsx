import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";


function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    image: "",
    ticketPrice: "",
    totalTickets: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", form);
      setMessage("Event created successfully");
      setTimeout(() => navigate("/organizer"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Event creation failed");
    }
  };

  return (
    <LayoutWrapper>
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h3>Create New Event</h3>
      <form onSubmit={handleCreate}>
        {["title", "description", "date", "location", "category", "image", "ticketPrice", "totalTickets"].map((field) => (
          <div className="form-group mb-3" key={field}>
            <label>{field}</label>
            <input
              type={field === "date" ? "datetime-local" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}
        <button className="btn btn-primary w-100" type="submit">
          Create Event
        </button>
        {message && <p className="mt-3">{message}</p>}
      </form>
    </div>
    </LayoutWrapper>
  );
}

export default CreateEvent;

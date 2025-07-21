import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import LayoutWrapper from "../components/LayoutWrapper";


function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setForm(res.data);
      } catch (err) {
        setMessage("Failed to load event.");
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, form);
      setMessage("Event updated successfully");
      setTimeout(() => navigate("/organizer"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setMessage("Event deleted successfully");
      setTimeout(() => navigate("/organizer"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  if (!form) return <p className="mt-5 text-center">Loading event...</p>;

  return (
    <LayoutWrapper>
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h3>Edit Event</h3>
      <form onSubmit={handleUpdate}>
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
          Update Event
        </button>
        <button className="btn btn-danger w-100 mt-2" type="button" onClick={handleDelete}>
          Delete Event
        </button>
        {message && <p className="mt-3">{message}</p>}
      </form>
    </div>
    </LayoutWrapper>
  );
}

export default EditEvent;

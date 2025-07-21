import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LayoutWrapper from "../components/LayoutWrapper";


function MyEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // ✅ Load events on mount
  useEffect(() => {
    api.get("/api/v1/events/organizer")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        toast.error("Failed to load your events");
        console.error(err);
      });
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
      toast.success("Event deleted!");
    } catch (err) {
      toast.error("Could not delete event");
    }
  };

  return (
    <LayoutWrapper>
    <div>
  <h2>🎟️ My Events</h2>
  <button
    className="btn btn-success mb-3"
    onClick={() => navigate(`/events/${evt._id}`)}
  >
    🔍 View
  </button>

  {events.length === 0 ? (
    <p>No events found.</p>
  ) : (
    <ul>
      {events.map((evt) => (
        <li key={evt._id}>
          <h3>{evt.title}</h3>
          <div className="btn-group mb-3" role="group">
            <button
              className="btn btn-info"
              onClick={() => navigate(`/events/${evt._id}`)}
            >
              🔍 View
            </button>
            <button
              className="btn btn-warning"
              onClick={() => navigate(`/my-events/edit/${evt._id}`)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(evt._id)}
            >
              🗑️ Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
</LayoutWrapper>

  );
}

export default MyEvents;

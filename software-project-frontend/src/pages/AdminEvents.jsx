import React, { useEffect, useState } from "react";
import api from "../services/api";
import LayoutWrapper from "../components/LayoutWrapper";


function AdminEvents() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/admin/all");
      setEvents(res.data);
    } catch (err) {
      console.error("Error loading events", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/events/${id}/status`, { status });
      fetchEvents();
    } catch (err) {
      alert("Failed to update event status");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <LayoutWrapper>
    <div className="container mt-5">
      <h3>All Events 📝</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Title</th><th>Organizer</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.organizer?.name || "N/A"}</td>
              <td>{e.status}</td>
              <td>
                {["approved", "pending", "declined"].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm mx-1 ${e.status === s ? "btn-secondary" : "btn-outline-primary"}`}
                    onClick={() => updateStatus(e._id, s)}
                  >
                    {s}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </LayoutWrapper>
  );
}

export default AdminEvents;

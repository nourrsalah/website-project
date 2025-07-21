import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";


function OrganizerDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get("/users/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load organizer events:", err);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <LayoutWrapper>
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Events 📆</h2>
        <Link to="/organizer/create" className="btn btn-success">
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={event.image || "https://via.placeholder.com/300x200"}
                  className="card-img-top"
                  alt={event.title}
                />
                <div className="card-body">
                  <h5>{event.title}</h5>
                  <p>{event.description}</p>
                  <p><strong>Status:</strong> {event.status}</p>
                  <Link to={`/organizer/edit/${event._id}`} className="btn btn-success w-100">
                    Edit Event
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </LayoutWrapper>
  );
}

export default OrganizerDashboard;

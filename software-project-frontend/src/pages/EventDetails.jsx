import React, { useEffect, useState, useContext } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import LayoutWrapper from "../components/LayoutWrapper";


function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize(); // for confetti sizing


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to load event:", err);
      }
    };

    fetchEvent();
  }, [id]);

  const bookTickets = async () => {
    if (!user || !user._id) {
      setMessage("You must be logged in to book tickets.");
      return;
    }

    try {
      await api.post("/bookings", {
        eventId: id,                         // ✅ matches backend
        ticketCount: Number(ticketCount),   // ✅ matches backend
      });

      setMessage("Booking confirmed!");
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  if (!event) return <p className="mt-5 text-center">Loading...</p>;


  return (
    <LayoutWrapper>
    <div className="container mt-5">
        {showConfetti && <Confetti width={width} height={height} />}
      {event.image && (
        <div className="text-center mb-4">
          <img
            src={event.image}
            alt={event.title}
            style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "10px" }}
          />
        </div>
      )}

      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p>
  <strong>Remaining:</strong>{" "}
  {event.remainingTickets === 0 ? (
    <span className="text-danger fw-bold">Sold Out</span>
  ) : (
    event.remainingTickets
  )}
</p>

      <div className="form-group mt-4" style={{ maxWidth: 300 }}>
        <label>Number of Tickets</label>
        <input
          type="number"
          min="1"
          max={event.remainingTickets}
          value={ticketCount}
          onChange={(e) => setTicketCount(e.target.value)}
          className="form-control"
        />
      </div>

      <button onClick={bookTickets} className="btn btn-success mt-3">
        Confirm Booking (EGP{event.ticketPrice * ticketCount})
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
    </LayoutWrapper>
  );
}

export default EventDetails;
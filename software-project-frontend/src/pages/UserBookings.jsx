import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import LayoutWrapper from "../components/LayoutWrapper";



function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/users/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking canceled successfully.");
      fetchBookings(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed.");
      
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <LayoutWrapper>
    <div className="container mt-5">
      <h2>My Bookings 🎟️</h2>
      {message && <p className="text-info">{message}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Event</th>
              <th>Tickets</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {bookings.map((b) => (
    <tr
      key={b._id}
      className={b.status === "canceled" || !b.event ? "table-secondary" : ""}
    >

                <td>{b.event && b.event.title ? b.event.title : "Event Deleted"}</td>
                <td>{b.ticketCount}</td>
                <td>EGP {b.totalPrice}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "confirmed" ? (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => cancelBooking(b._id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-muted">Canceled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
      </LayoutWrapper>
  );
}

export default UserBookings;

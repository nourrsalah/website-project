import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filteredEvents = [...events];

    if (search) {
      filteredEvents = filteredEvents.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredEvents = filteredEvents.filter((e) => e.category === category);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredEvents = filteredEvents.filter((e) => {
        const eventDate = new Date(e.date);
        return eventDate >= start && eventDate <= end;
      });
    }

    if (sortOrder === "asc") {
      filteredEvents.sort((a, b) => a.ticketPrice - b.ticketPrice);
    } else {
      filteredEvents.sort((a, b) => b.ticketPrice - a.ticketPrice);
    }

    setFiltered(filteredEvents);
  }, [search, category, sortOrder, startDate, endDate, events]);

  return (
    <div
      style={{
        backgroundImage: `url("https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backgroundBlendMode: "darken",
        color: "white",
        padding: "2rem",
      }}
    >
      <div className="container mt-5">
        <h2>Approved Events 🎉</h2>
  
        {/* 🔍 Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Tech</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Price ↑</option>
              <option value="desc">Price ↓</option>
            </select>
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-outline-warning w-100"
              onClick={() => {
                setSearch("");
                setCategory("");
                setSortOrder("asc");
                setStartDate("");
                setEndDate("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
  
        {/* 🎫 Event Cards */}
        <div className="row mt-4">
          {filtered.length === 0 ? (
            <p>No events found.</p>
          ) : (
            filtered.map((event) => (
              <div key={event._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img
                    src={event.image || "https://via.placeholder.com/300x200"}
                    className="card-img-top"
                    alt={event.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">{event.description}</p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Price:</strong> EGP {event.ticketPrice}
                    </p>
                    <Link
                      to={`/events/${event._id}`}
                      className="btn btn-primary w-100"
                    >
                      View & Book
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
  
}

export default UserDashboard;

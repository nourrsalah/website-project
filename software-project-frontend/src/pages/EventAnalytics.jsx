import React, { useEffect, useState } from "react";
import api from "../services/api";
import LayoutWrapper from "../components/LayoutWrapper";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const COLORS = ["#00C49F", "#FF8042"];

function EventAnalytics() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/events/analytics");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="container mt-5 text-center">
      <h2>My Event Analytics 📊</h2>
      {events.length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-5 mt-4">
          {events.map((event, idx) => {
            const chartData = [
              { name: "Sold", value: event.soldTickets },
              { name: "Remaining", value: event.totalTickets - event.soldTickets },
            ];
            return (
              <div key={idx}>
                <h5 className="mb-3">{event.title}</h5>
                <PieChart width={300} height={300}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EventAnalytics;
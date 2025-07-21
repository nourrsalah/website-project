import React from "react";
import { Routes, Route } from "react-router-dom";
import MyEvents from "../pages/MyEvents";
import CreateEvent from "../pages/CreateEvent";
import EventDetails from "../pages/EventDetails"; // ✅ CORRECT

function OrganizerRoutes() {
  return (
    <Routes>
      <Route path="/my-events" element={<MyEvents />} />
      <Route path="/my-events/new" element={<CreateEvent />} />
      <Route path="/my-events/edit/:id" element={<CreateEvent editMode ={true}/>} />
      <Route path="/events/:id" element={<EventDetails />} />
    </Routes>
  );
}

export default OrganizerRoutes;

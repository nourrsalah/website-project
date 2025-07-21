const express = require("express");
const eventController = require("../controllers/eventController");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const router = express.Router();

// ✅ Extract the admin controller explicitly
const { getAllEventsForAdmin } = eventController;

// Get all events (public route)
router.get("/", eventController.getAllEvents);

// This version is filtered (approved only) and requires admin role (already existed)
router.get("/all", authenticationMiddleware, authorizationMiddleware(["Admin"]), eventController.getAllEvents);

// ✅ FIXED: Get all events (admin only, all statuses)
router.get('/admin/all', authenticationMiddleware, authorizationMiddleware(["Admin"]), getAllEventsForAdmin);

// Get event analytics (only accessible by the event organizer)
router.get("/analytics", authenticationMiddleware, authorizationMiddleware(['Organizer']), eventController.getEventAnalytics);

// Get a specific event (public route)
router.get("/:id", eventController.getEvent);

// Create a new event (only accessible by admin and event organizer)
router.post("/", authenticationMiddleware, authorizationMiddleware(['Admin', 'Organizer']), eventController.createEvent);

// Update an event (only accessible by admin and the event organizer)
router.put("/:id", authenticationMiddleware, authorizationMiddleware(["Organizer", "Admin"]), eventController.updateEvent);

// Delete an event (only accessible by admin and the event organizer)
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(["Organizer", "Admin"]), eventController.deleteEvent);



// Update event status (only accessible by admin)
router.put("/:id/status", authenticationMiddleware, authorizationMiddleware(['Admin']), eventController.updateEventStatus);

// ⚠️ You had these two routes again at the end (duplicate)
// They are already defined above, so you can safely remove these if desired:
// router.get("/:id", eventController.getEvent);
// router.post("/", authenticationMiddleware, authorizationMiddleware(["Organizer"]), eventController.createEvent);

module.exports = router;

const express = require("express");
const bookingController = require("../controllers/bookingController");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const router = express.Router();

// Create a booking
router.post("/", authenticationMiddleware, authorizationMiddleware(['User']), bookingController.createBooking);

// Get all bookings for logged-in user
router.get("/", authenticationMiddleware, authorizationMiddleware(['User', 'Admin']), bookingController.getBookings);

// Get a specific booking
router.get("/:id", authenticationMiddleware, authorizationMiddleware(['User', 'Admin']), bookingController.getBookingById);

// Cancel a booking
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(['User', 'Admin']), bookingController.cancelBooking);

module.exports = router;

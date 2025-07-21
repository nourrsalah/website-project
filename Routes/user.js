const express = require("express");
const userController = require("../controllers/userController");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

const router = express.Router();

// ✅ Public routes already handled in auth.js and app.js

// ✅ Authenticated user routes
router.get("/profile", authenticationMiddleware, authorizationMiddleware(['User', 'Admin','Organizer']), userController.getProfile);
router.put("/profile", authenticationMiddleware, authorizationMiddleware(['User', 'Admin','Organizer']), userController.updateProfile);

// ✅ Standard User only - Get their bookings
router.get("/bookings", authenticationMiddleware, authorizationMiddleware(['User']), userController.getUserBookings);

// ✅ Organizer Routes
router.get("/events", authenticationMiddleware, authorizationMiddleware(['Organizer']), userController.getUserEvents);
router.get("/events/analytics", authenticationMiddleware, authorizationMiddleware(['Organizer']), userController.getEventAnalytics);

// ✅ Admin-only routes
router.get("/", authenticationMiddleware, authorizationMiddleware(['Admin']), userController.getAllUsers);
router.get("/:id", authenticationMiddleware, authorizationMiddleware(['Admin']), userController.getUser);
router.put("/:id", authenticationMiddleware, authorizationMiddleware(['Admin', 'User']), userController.updateUser);
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(['Admin']), userController.deleteUser);

module.exports = router;
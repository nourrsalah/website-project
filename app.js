const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
 origin: process.env.ORIGIN || "http://localhost:3000",
// fallback for local frontend
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));

// Routes
const authRouter = require("./Routes/auth");
const userRouter = require("./Routes/user");
const bookingRouter = require("./Routes/booking");
const eventRouter = require("./Routes/event");

const authenticationMiddleware = require("./Middleware/authenticationMiddleware");

// ❗ Public routes
app.use("/api/v1", authRouter); // register, login
app.put("/api/v1/forgetPassword", require("./controllers/userController").forgetPassword); // public

// ✅ Apply authentication only after public routes
app.use(authenticationMiddleware);

// ✅ Protected routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/bookings", bookingRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


module.exports = app;
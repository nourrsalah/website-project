const Booking = require('../models/Booking');
const Event = require('../models/Event');

const bookingController = {
  // @desc    Create a new booking
  createBooking: async (req, res) => {
    try {
      const { eventId, ticketCount } = req.body;

      // ✅ Get user ID from middleware
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!eventId || !ticketCount) {
        return res.status(400).json({ message: "Event ID and ticket count are required" });
      }

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.remainingTickets < ticketCount) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }

      const calculatedPrice = event.ticketPrice * ticketCount;

      const booking = await Booking.create({
        event: eventId,
        user: userId, // ✅ attached from token
        ticketCount,
        totalPrice: calculatedPrice,
      });

      event.remainingTickets -= ticketCount;
      await event.save();

      res.status(201).json(booking);
    } catch (err) {
      console.error("Booking error:", err);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  },

  // @desc    Get all bookings for the logged-in user
  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user._id })
        .populate("event", "title location");
  
      console.log("📦 Booking debug:");
      bookings.forEach(b => {
        console.log("→ booking.event:", b.event); // should NOT be null
      });
  
      res.status(200).json(bookings);
    } catch (err) {
      console.error("❌ Error:", err);
      res.status(500).json({ message: err.message });
    }
  },   
  

  // @desc    Get a specific booking by ID
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate('event');
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: Not your booking' });
      }

      res.status(200).json(booking);
    } catch (error) {
      console.error("❌ Get booking error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // @desc    Cancel a booking
  cancelBooking: async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: not your booking' });
    }

    if (booking.status === 'canceled') {
      return res.status(400).json({ message: 'Booking already canceled' });
    }

    // Mark as canceled
    booking.status = 'canceled';
    await booking.save();

    // Restore tickets to event.remainingTickets
    const event = await Event.findById(booking.event);
    if (event) {
      event.remainingTickets += booking.ticketCount;
      await event.save();
    }

    return res.json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    console.error("❌ Cancel booking error:", error);
    res.status(500).json({ message: 'Server error' });
  }
},

};

module.exports = bookingController;

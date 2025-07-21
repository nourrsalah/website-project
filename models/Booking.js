const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketCount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'canceled'], default: 'confirmed' },
}, { timestamps: true });

// ✅ This prevents OverwriteModelError:
module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

const Event = require('../models/Event');

const eventController = {
  // @desc    Create a new event
  createEvent: async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        location,
        category,
        image,
        ticketPrice,
        totalTickets,
      } = req.body;

      if (!title || !date || !location || !ticketPrice || !totalTickets) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const event = await Event.create({
        title,
        description,
        date,
        location,
        category,
        image,
        ticketPrice,
        totalTickets,
        remainingTickets: totalTickets,
        organizer: req.user.id, // ✅ From JWT
      });

      return res.status(201).json(event);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc    Get all approved events
 getAllEvents: async (req, res) => {
  try {
    const { search, category, startDate, endDate, sort } = req.query;

    const query = { status: "approved" };

    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sortOption = sort === "asc"
      ? { ticketPrice: 1 }
      : sort === "desc"
      ? { ticketPrice: -1 }
      : {};

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .sort(sortOption);

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},

  // @desc    Get all events (admin only)
getAllEventsForAdmin: async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const events = await Event.find().populate('organizer', 'name email');
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},

  // @desc    Get a specific event by ID
  getEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id).populate('organizer', 'name email');
      if (!event) return res.status(404).json({ message: 'Event not found' });
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },


  // @desc    Update an event
  updateEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Only allow organizer or admin
      if (
        req.user.role !== 'Admin' &&
        event.organizer.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      // Update fields
      Object.assign(event, req.body);
      const updatedEvent = await event.save();
  
      return res.status(200).json(updatedEvent);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc    Delete an event
  deleteEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      // Authorization check
      if (
        req.user.role !== 'Admin' &&
        event.organizer.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await Event.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc    Get event analytics
  getEventAnalytics: async (req, res) => {
    try {
      const events = await Event.find({ organizer: req.user._id });
     const analytics = events.map(event => {
  const sold = event.totalTickets - event.remainingTickets;
  const percent = (sold / event.totalTickets) * 100;
  return {
    title: event.title,
    soldTickets: sold,
    totalTickets: event.totalTickets,
    percentage: Math.round(percent),
  };
});
      return res.json(analytics);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc    Update event status
  updateEventStatus: async (req, res) => {
    const { status } = req.body;
    try {
      if (!['approved', 'pending', 'declined'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });

      event.status = status;
      await event.save();
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = eventController;

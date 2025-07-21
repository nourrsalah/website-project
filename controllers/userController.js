const User = require('../models/user');
const Booking = require('../models/Booking'); // 👈 ADD THIS LINE
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: false, // set to true in production if using HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ✅ Register User
const registerUser = async (req, res) => {
  console.log("📦 Register Body Received:", req.body); // 👈 ADD THIS
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'User',
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set cookie here
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    setTokenCookie(res, token);
return res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Alias for profile
const getProfile = getCurrentUser;

// ✅ Get user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update profile (for logged-in user)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    const token = jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin or user updates any user
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isAdmin = req.user.role === 'Admin';
    const isOwner = user._id.equals(req.user._id);

    // Allow only Admin to change roles
    if (isAdmin) {
      if (req.body.role) user.role = req.body.role;
    }

    // Allow both Admin and Owner to update profile info
    if (isAdmin || isOwner) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;

      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedUser = await user.save();

      const responsePayload = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      };

      // Only send a new token if the updated user is the one logged in
      if (isOwner) {
        const token = jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });
        setTokenCookie(res, token);
        responsePayload.token = token;
      }

      return res.json(responsePayload);
    }

    return res.status(403).json({ message: 'Unauthorized' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Forget Password (Public)
const forgetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    const analytics = {
      totalEvents: events.length,
      totalTicketsSold: 0,
      totalRevenue: 0,
    };

    for (const event of events) {
      const bookings = await Booking.find({ event: event._id });

      const ticketsSold = bookings.reduce((sum, b) => sum + b.ticketCount, 0);
      const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

      analytics.totalTicketsSold += ticketsSold;
      analytics.totalRevenue += revenue;
    }

    res.status(200).json(analytics);
  } catch (error) {
    console.error("❌ Event analytics error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  getUser,
  updateUser,
  deleteUser,
  forgetPassword,
  getProfile,
  getUserBookings,
  updateProfile,
  getUserEvents,
  getEventAnalytics
};
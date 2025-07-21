const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = process.env.JWT_SECRET;

module.exports = async function authenticationMiddleware(req, res, next) {
  const cookies = req.cookies;

  if (!cookies || !cookies.token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(cookies.token, secretKey);

    // ✅ Find full user object from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach the full user with _id and role
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

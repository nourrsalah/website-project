module.exports = function authorizationMiddleware(roles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log("✅ Current user role:", userRole);
    console.log("⚠️  Allowed roles:", roles);

    if (!roles.includes(userRole)) {
      return res.status(403).json("unauthorized access");
    }

    next();
  };
};

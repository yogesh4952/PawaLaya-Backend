const authorizeRoles = (roles) => (req, res, next) => {
  console.log(req.user); // Check if req.user is populated

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated.',
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied! Insufficient permissions.',
    });
  }
  next();
};

export default authorizeRoles;

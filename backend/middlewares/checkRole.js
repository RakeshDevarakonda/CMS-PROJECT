export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.role)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }
      next();
    };
  };
  

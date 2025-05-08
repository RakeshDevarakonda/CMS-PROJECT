import User from "../models/user-model.js";

export const isActive = async (req, res, next) => {
  try {
    if (!req.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Missing user ID." });
    }

    const user = await User.findById(req.id);

    if (user?.isActive) {
      return next();
    }

    return res.status(403).json({
      message:
        "Your account is not active or has been restricted. Please try again later.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error checking user status.",
      error: error.message,
    });
  }
};

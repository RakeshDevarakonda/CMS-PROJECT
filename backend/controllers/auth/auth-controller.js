import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import User from "../../models/user-model.js";
import { throwError } from "../../utils/throw-error.js";
import { updateAdminAnalytics } from "../../utils/admin-analytics.js";

// Reusable function to validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const signupController = async (req, res, next) => {
  let { username, email, password, role, confirmPassword } = req.body;

  console.log(req.body);

  username = username?.trim();
  email = email?.trim();
  password = password?.trim();
  confirmPassword = confirmPassword?.trim();

  // Field validations
  if (!username || !email || !password || !confirmPassword || !role) {
    return throwError(400, "All fields are required");
  }

  if (username && username.length < 3) {
    return throwError(400, "Username must be atleast 3 characters");
  }

  if (username && username.length > 15) {
    return throwError(400, "Username maximun of 15 characters");
  }
  if (!isValidEmail(email)) {
    return throwError(400, "Please enter a valid email");
  }

  if (password.length < 6) {
    return throwError(400, "Password must be at least 6 characters long");
  }

  if (password !== confirmPassword) {
    return throwError(400, "Passwords do not match");
  }

  try {
    const existingUser = await User.find({ email });

    if (existingUser.length > 0) {
      return throwError(409, "Email already in use");
    }

    const checkUsername = await User.find({ name: username });

    if (username === checkUsername.name) {
      return throwError(400, "username already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role !== "admin") {
      await updateAdminAnalytics(null, null, role);
    }

    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      isActive: true,
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    console.error("Signup error:", error);
    return next(error); // Forward to error handling middleware
  }
};

export const signinController = async (req, res, next) => {
  let { email, password } = req.body;
  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    return throwError(400, "Email and password are required");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return throwError(404, "Email not registered");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return throwError(401, "Invalid password");
    }

    const token = Jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true", // boolean from string
      sameSite: process.env.COOKIE_SAMESITE || "Lax", // fallback to "Lax"
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Sign-in successful",
      payload: {
        id: user._id,
        username: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.log(error);
    console.error("Sign-in error:", error);
    return next(error); // Forward to error handling middleware
  }
};

export const checkUserLoginController = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "You are Unauthorized" });
  }

  try {
    const payload = Jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Authenticated",
      payload: {
        id: user._id,
        email: user.email,
        username: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const logoutController = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE || "Lax",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

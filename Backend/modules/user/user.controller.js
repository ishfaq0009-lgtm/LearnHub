import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ADMIN REGISTRATION
export async function registration(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const adminExists = await User.exists({ role: "Admin" });

    if (adminExists) {
      return res.status(409).json({
        success: false,
        message: "An administrator already exists. Please login.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = await User.exists({
      email: normalizedEmail,
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "Admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully. Please login.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An administrator already exists or this email is registered.",
      });
    }

    next(error);
  }
}

// ADMIN LOGIN
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      role: "Admin",
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }

    const token = createToken(user);

    res.cookie("learnhub_token", token, cookieOptions());

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// CHECK ADMIN
export async function checkAdmin(req, res) {
  return res.json({
    success: true,
    admin: req.admin,
  });
}

// LOGOUT
export async function logout(_req, res) {
  res.clearCookie("learnhub_token", {
    ...cookieOptions(),
    maxAge: undefined,
  });

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
}
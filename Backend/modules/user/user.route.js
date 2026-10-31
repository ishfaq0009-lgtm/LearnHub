import express from "express";
import {
  registration,
  login,
  checkAdmin,
  logout,
} from "./user.controller.js";

import { requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Admin registration
router.post("/userRegistr", registration);


router.post("/login", login);


router.post("/logout", logout);

// Check logged-in admin
router.get("/me", requireAdmin, checkAdmin);
router.post("/AdminChek", requireAdmin, checkAdmin);

export default router;
import express from "express";
import { requireAdmin } from "../../shared/middleware/auth.middleware.js";
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessages,
  updateContactReadStatus,
} from "./contact.controller.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/admin/messages", requireAdmin, getContactMessages);
router.patch("/admin/messages/:id/read", requireAdmin, updateContactReadStatus);
router.delete("/admin/messages/:id", requireAdmin, deleteContactMessage);

export default router;

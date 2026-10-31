import mongoose from "mongoose";
import ContactMessage from "./contact.model.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createContactMessage(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const subject = String(req.body.subject || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please complete all required fields." });
    }
    if (name.length > 80 || email.length > 254 || phone.length > 30 || subject.length > 120 || message.length > 3000) {
      return res.status(400).json({ success: false, message: "One or more fields are longer than allowed." });
    }
    if (message.length < 10) {
      return res.status(400).json({ success: false, message: "Please write a message with at least 10 characters." });
    }
    if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    await ContactMessage.create({ name, email, phone, subject, message });
    return res.status(201).json({
      success: true,
      message: "Thank you for contacting LearnHub. Your message has been received.",
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactMessages(req, res, next) {
  try {
    const { status = "all", search = "", page = "1", limit = "20" } = req.query;
    const filter = {};
    if (status === "read") filter.isRead = true;
    if (status === "unread") filter.isRead = false;

    const term = String(search).trim();
    if (term) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
        { subject: { $regex: escaped, $options: "i" } },
      ];
    }

    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20));
    const [messages, total, unread] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize).lean(),
      ContactMessage.countDocuments(filter),
      ContactMessage.countDocuments({ isRead: false }),
    ]);

    return res.json({
      success: true,
      messages,
      unread,
      pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactReadStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID." });
    }
    const isRead = req.body.isRead === true;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true, runValidators: true },
    ).lean();
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true, message: "Message status updated.", contactMessage: message });
  } catch (error) {
    next(error);
  }
}

export async function deleteContactMessage(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID." });
    }
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true, message: "Contact message deleted." });
  } catch (error) {
    next(error);
  }
}

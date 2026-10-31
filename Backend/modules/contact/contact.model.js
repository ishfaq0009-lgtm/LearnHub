import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

contactSchema.index({ createdAt: -1 });
contactSchema.index({ isRead: 1, createdAt: -1 });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactSchema);
export default ContactMessage;

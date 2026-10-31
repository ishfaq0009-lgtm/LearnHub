import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "All Levels"], default: "Beginner" },
  duration: { type: String, trim: true, default: "Self-paced" },
  price: { type: Number, min: 0, default: 0 },
  instructor: { type: String, trim: true, default: "LearnHub Team" },
  shortDescription: { type: String, required: true, trim: true, maxlength: 220 },
  description: { type: String, trim: true, default: "" },
  thumbnail: { type: String, trim: true, default: "" },
  curriculum: { type: [lessonSchema], default: [] },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["Published", "Draft"], default: "Published" },
}, { timestamps: true });

courseSchema.index({ title: "text", shortDescription: "text", description: "text", category: "text" });
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;

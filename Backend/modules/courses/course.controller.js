import Course from "./course.model.js";
import { cloudinary, configured as cloudinaryConfigured } from "../../shared/config/cloudinary.config.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseCurriculum(value) {
  if (Array.isArray(value)) return value.map((item) => ({ title: String(item.title || item).trim() })).filter((item) => item.title);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parseCurriculum(parsed);
    } catch { /* Plain newline-separated lesson titles are also supported. */ }
    return value.split(/\r?\n/).map((title) => ({ title: title.trim() })).filter((item) => item.title);
  }
  return [];
}

async function getImageUrl(file) {
  if (!file) return null;
  if (!cloudinaryConfigured) {
    const error = new Error("Image upload needs Cloudinary settings in Backend/.env. You can use an image URL instead.");
    error.status = 400;
    throw error;
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "learnhub/courses", resource_type: "image" },
      (error, result) => error ? reject(error) : resolve(result.secure_url)
    );
    stream.end(file.buffer);
  });
}

function coursePayload(body) {
  return {
    title: body.title?.trim(),
    category: body.category?.trim(),
    level: body.level || "Beginner",
    duration: body.duration?.trim() || "Self-paced",
    price: Number(body.price || 0),
    instructor: body.instructor?.trim() || "LearnHub Team",
    shortDescription: body.shortDescription?.trim(),
    description: body.description?.trim() || "",
    thumbnail: body.thumbnail?.trim() || "",
    curriculum: parseCurriculum(body.curriculum),
    featured: body.featured === true || body.featured === "true",
    status: body.status === "Draft" ? "Draft" : "Published",
  };
}

export async function getCourses(req, res, next) {
  try {
    const { search = "", category = "All", level = "All", featured, page = 1, limit = 24 } = req.query;
    const filter = { status: "Published" };
    if (category !== "All") filter.category = category;
    if (level !== "All") filter.level = level;
    if (featured === "true") filter.featured = true;
    if (search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
        { shortDescription: { $regex: safeSearch, $options: "i" } },
      ];
    }
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(60, Math.max(1, Number.parseInt(limit, 10) || 24));
    const [courses, total] = await Promise.all([
      Course.find(filter).sort({ featured: -1, createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
      Course.countDocuments(filter),
    ]);
    res.json({ success: true, courses, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } });
  } catch (error) { next(error); }
}

export async function getCourseById(req, res, next) {
  try {
    const course = await Course.findOne({ _id: req.params.id, status: "Published" }).lean();
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, course });
  } catch (error) { next(error); }
}

export async function getAdminCourses(_req, res, next) {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, courses });
  } catch (error) { next(error); }
}

export async function createCourse(req, res, next) {
  try {
    const data = coursePayload(req.body);
    if (!data.title || !data.category || !data.shortDescription) {
      return res.status(400).json({ success: false, message: "Title, category and short description are required." });
    }
    const uploadedUrl = await getImageUrl(req.file);
    if (uploadedUrl) data.thumbnail = uploadedUrl;
    const course = await Course.create(data);
    res.status(201).json({ success: true, message: "Course created successfully.", course });
  } catch (error) { next(error); }
}

export async function updateCourse(req, res, next) {
  try {
    const data = coursePayload(req.body);
    if (!data.title || !data.category || !data.shortDescription) {
      return res.status(400).json({ success: false, message: "Title, category and short description are required." });
    }
    const uploadedUrl = await getImageUrl(req.file);
    if (uploadedUrl) data.thumbnail = uploadedUrl;
    const course = await Course.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course updated successfully.", course });
  } catch (error) { next(error); }
}

export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course deleted successfully." });
  } catch (error) { next(error); }
}

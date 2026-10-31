import express from "express";
import { requireAdmin } from "../../shared/middleware/auth.middleware.js";
import upload from "../../shared/middleware/upload.middleware.js";
import { getCourses, getCourseById, getAdminCourses, createCourse, updateCourse, deleteCourse } from "./course.controller.js";

const router = express.Router();
router.get("/", getCourses);
router.get("/admin/all", requireAdmin, getAdminCourses);
router.post("/", requireAdmin, upload.single("thumbnailFile"), createCourse);
router.put("/:id", requireAdmin, upload.single("thumbnailFile"), updateCourse);
router.delete("/:id", requireAdmin, deleteCourse);
router.get("/:id", getCourseById);
export default router;

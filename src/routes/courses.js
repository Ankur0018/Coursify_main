const express = require("express");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const { auth, requireRole } = require("../middlewares/auth");
const { courseSchema, courseUpdateSchema } = require("../utils/validation");

const router = express.Router();

// All courses (public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json({ courses });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Instructor: get own courses — must be before /:id
router.get("/mine", auth, requireRole("instructor"), async (req, res) => {
  try {
    const courses = await Course.find({ creatorId: req.user._id }).sort({ createdAt: -1 });
    res.json({ courses });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Single course (public)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ course });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Instructor: create course
router.post("/", auth, requireRole("instructor"), async (req, res) => {
  const result = courseSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Validation failed", errors: result.error.flatten().fieldErrors });
  }

  const { title, description, price, imageUrl } = result.data;

  try {
    const course = await Course.create({ title, description, price, imageUrl: imageUrl || "", creatorId: req.user._id });
    res.status(201).json({ message: "Course created", course });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Instructor: update own course
router.put("/:id", auth, requireRole("instructor"), async (req, res) => {
  const result = courseUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Validation failed", errors: result.error.flatten().fieldErrors });
  }

  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, creatorId: req.user._id },
      { $set: result.data },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found or unauthorized" });
    res.json({ message: "Course updated", course });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Instructor: delete own course
router.delete("/:id", auth, requireRole("instructor"), async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, creatorId: req.user._id });
    if (!course) return res.status(404).json({ message: "Course not found or unauthorized" });
    res.json({ message: "Course deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const { auth, requireRole } = require("../middlewares/auth");

const router = express.Router();

// Student: purchase a course
router.post("/", auth, requireRole("student"), async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ message: "Course ID is required" });

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await Purchase.findOne({ userId: req.user._id, courseId });
    if (existing) return res.status(409).json({ message: "Already enrolled in this course" });

    const purchase = await Purchase.create({ userId: req.user._id, courseId });
    res.status(201).json({ message: "Enrolled successfully", purchase });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Student: get all purchases
router.get("/", auth, requireRole("student"), async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id })
      .populate("courseId")
      .sort({ createdAt: -1 });
    res.json({ purchases });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

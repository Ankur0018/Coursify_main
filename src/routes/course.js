const express = require("express");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

router.get("/preview", async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/purchase", userAuth, async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const alreadyPurchased = await Purchase.findOne({ userId: req.user._id, courseId });
    if (alreadyPurchased) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    const purchase = await Purchase.create({ userId: req.user._id, courseId });

    res.status(201).json({ message: "Course purchased successfully", purchase });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ course });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const { signupSchema, loginSchema, courseSchema, courseUpdateSchema } = require("../utils/validation");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

const COOKIE_OPTIONS = (isProduction) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

router.post("/signup", async (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { firstName, lastName, email, password } = result.data;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ firstName, lastName, email, password: hashedPassword });

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { email, password } = result.data;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await admin.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = admin.getJWT();
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("adminToken", token, COOKIE_OPTIONS(isProduction));

    res.json({
      message: "Login successful",
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logged out successfully" });
});

router.get("/profile", adminAuth, (req, res) => {
  res.json({ admin: req.admin });
});

router.get("/courses", adminAuth, async (req, res) => {
  try {
    const courses = await Course.find({ creatorId: req.admin._id }).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/course", adminAuth, async (req, res) => {
  const result = courseSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { title, description, price, imageUrl } = result.data;

  try {
    const course = await Course.create({
      title,
      description,
      price,
      imageUrl: imageUrl || "",
      creatorId: req.admin._id,
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/course", adminAuth, async (req, res) => {
  const result = courseUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { courseId, ...updateData } = result.data;

  try {
    const course = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: req.admin._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/course/:courseId", adminAuth, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.courseId,
      creatorId: req.admin._id,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

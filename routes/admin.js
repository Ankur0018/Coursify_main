const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const z = require("zod");
const { adminModel, courseModel } = require("../db");
const { admin_Secret, NODE_ENV } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

const adminSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});
adminRouter.post("/signup", async (req, res) => {
  const parsedResult = adminSchema.safeParse(req.body);
  if (!parsedResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsedResult.error.flatten() });
  }

  const { email, firstName, lastName, password } = req.body;

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    res.status(201).json({ message: "SignUp successfull" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id.toString() }, admin_Secret, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, price, imageUrl } = req.body;
  try {
    const course = await courseModel.create({
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
      creatorId: adminId,
    });

    res.json({
      message: "Course created",
      courseId: course._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const { title, description, price, imageUrl, courseId } = req.body;

  try {
    const response = await courseModel.findOneAndUpdate(
      { _id: courseId, creatorId: adminId }, // Find the document
      { $set: { title, description, price, imageUrl } }, // Update fields
      { new: true, runValidators: true } // Return updated document
    );
    if (!response) {
      return res
        .status(404)
        .json({ error: "Course not found or unauthorized" });
    }

    res.json({
      message: "Course updated",
      courseId: response,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.get("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  try {
    const courses = await courseModel.find({ creatorId: adminId });
    res.json({
      message: "Course updated",
      courses,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  adminRouter: adminRouter,
};

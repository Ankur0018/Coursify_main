const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, userModel, courseModel } = require("../db");
const { user_Secret, NODE_ENV } = require("../config");
const bcrypt = require("bcrypt");
const z = require("zod");
const userRouter = Router();

const userSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});

userRouter.post("/signup", async (req, res) => {
  const parsedResult = userSchema.safeParse(req.body);
  if (!parsedResult) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsedResult.error.flatten() });
  }
  const { email, firstName, lastName, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    res.status(201).json({ message: "SignUp successfull" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, user_Secret, { expiresIn: "1h" });

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

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userID;

  try {
    const purchases = await purchaseModel.find({
      userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i < purchases.length; i++) {
      purchasedCourseIds.push(purchases[i].courseId);
    }

    const coursesData = await courseModel.find({
      _id: { $in: purchasedCourseIds },
    });

    res.json({
      purchases,
      coursesData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  userRouter,
};

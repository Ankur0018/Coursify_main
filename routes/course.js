const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.body;

  try {
    await purchaseModel.create({
      userId,
      courseId,
    });

    res.json({
      message: "You have successfully bought the course",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});

    res.json({
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  courseRouter,
};

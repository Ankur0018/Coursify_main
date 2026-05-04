require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const coursesRouter = require("./routes/courses");
const purchasesRouter = require("./routes/purchases");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/purchases", purchasesRouter);

// Serve React app for all non-API GET routes
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(__dirname, "../public/index.html"));
  }
  next();
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`)))
  .catch((err) => {
    console.error("Database connection failed ❌", err);
    process.exit(1);
  });

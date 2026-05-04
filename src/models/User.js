const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor"], default: "student" },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const secret = process.env.JWT_SECRET || process.env.USER_SECRET;
  return jwt.sign({ id: this._id }, secret, { expiresIn: "7d" });
};

userSchema.methods.validatePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

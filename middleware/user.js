const jwt = require("jsonwebtoken");
const { user_Secret } = require("../config");

function userMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please SignIn" });
  }
  const decoded = jwt.verify(token, user_Secret);

  if (!decoded) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  req.userId = decoded.id;
  next();
}

module.exports = {
  userMiddleware,
};

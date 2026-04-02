const jwt = require("jsonwebtoken");
const { admin_Secret } = require("../config");

function adminMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please SignIn" });
  }
  const decoded = jwt.verify(token, admin_Secret);

  if (!decoded) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  req.userId = decoded.id;
  next();
}

module.exports = {
  adminMiddleware,
};

const dotenv = require("dotenv");
require("dotenv").config();

const admin_Secret = process.env.ADMIN_SECRET;
const user_Secret = process.env.USER_SECRET;
const NODE_ENV = process.env.NODE_ENV;
module.exports = {
  user_Secret,
  admin_Secret,
  NODE_ENV,
};

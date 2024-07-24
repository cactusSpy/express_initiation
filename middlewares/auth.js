const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.service");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw new Error("No token provided");
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    console.log("Decoded token:", decoded);

    const user = await User.get(decoded.userId);
    console.log("Decoded user:", user);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next(new UnauthorizedError(error.message || error));
  }
};

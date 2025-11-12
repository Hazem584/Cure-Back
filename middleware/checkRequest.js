const jwt = require("jsonwebtoken");

const checkReq = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Bad Request not Authorized" });
  }
  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
module.exports = checkReq
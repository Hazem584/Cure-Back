const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; 
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; 
  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    req.user = decoded; 
    next(); 
  } catch (error) {
        console.error("Auth Error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token." });

  }
};

module.exports = verifyToken;

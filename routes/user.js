const express = require("express");
const router = express.Router();
const  getAllUsers = require("../controllers/users/get_allUsers");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
router.get("/", verifyToken, checkRole("admin", "user"), getAllUsers);

module.exports = router;

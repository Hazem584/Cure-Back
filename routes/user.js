const express = require("express");
const router = express.Router();
const getAllUsers = require("../controllers/users/get_allUsers");
const usersControllers = require("../controllers/usersControllers");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const checkReq = require("../middleware/checkRequest");
const upload = require("../middleware/uploadAvatar"); 
const User = require("../models/user");
router.get("/", verifyToken, checkRole("admin", "user"), getAllUsers);

router.get(
  "/get_one_user",
  checkReq,
  usersControllers.get_one_user
);

router.put(
  "/update_user",
  checkReq,
  upload.single("avatar"), 
  usersControllers.update_user
);

router.get(
  "/delete_user",
  checkReq,
  usersControllers.delete_user
);

module.exports = router;

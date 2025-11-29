const express = require("express");
const router = express.Router();
const getAllUsers = require("../controllers/users/get_allUsers");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const checkReq = require("../middleware/checkRequest");
const usersControllers = require("../controllers/usersControllers");
const User = require("../models/users_test");
router.get("/", verifyToken, checkRole("admin", "user"), getAllUsers);

//this rout just for testing
// router.get("/add_user", async (req, res) => {
//   const new_user = new User({
//     name: "aliali",
//     phone: 123456789,
//     age: 22,
//     email: "aliali@gamil.com",
//   });
//   try {
//     await new_user.save();
//     res.status(200).json("success");
//   } catch (err) {
//     console.log(err);
//     res.status(500).json("failed");
//   }
// });

//user/get_one_user/:id
router.get("/get_one_user/:id", checkReq, usersControllers.get_one_user);
//user/update_user/:id
router.post("/update_user/:id", checkReq, usersControllers.update_user);
//user/delete_user/:id
router.post("/delete_user/:id", checkReq, usersControllers.delete_user);
module.exports = router;

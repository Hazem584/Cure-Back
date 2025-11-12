const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers")

//user/get_one_user/:id
router.get("/get_one_user/:id", usersControllers.get_one_user)
//user/update_user/:id
router.post("/update_user/:id", usersControllers.update_user)
//user/delete_user/:id
router.post("/delete_user/:id", usersControllers.delete_user)
module.exports = router
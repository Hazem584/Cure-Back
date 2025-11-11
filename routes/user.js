const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers")


router.get("/get_one_user/:id", usersControllers.get_one_user)

module.exports = router
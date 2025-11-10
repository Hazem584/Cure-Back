const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

router.post("/", appointmentsController.createAppointment);

router.get("/available", appointmentsController.getAvailableSlots);

module.exports = router;

const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const verifyToken = require("../middleware/verifyToken");
const {
  getAppointments,
  canceled,
} = require("../controllers/userAppointmentController");

router.post("/", verifyToken, appointmentsController.createAppointment);

router.get("/available", appointmentsController.getAvailableSlots);
router
  .get("/getAppointments", verifyToken, getAppointments)
  .patch("/cancelAppointments", verifyToken, canceled);

module.exports = router;

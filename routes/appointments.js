const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const {
  getAppointments,
  deleted,
} = require("../controllers/userAppointmentController");

router.post("/", appointmentsController.createAppointment);

router.get("/available", appointmentsController.getAvailableSlots);
router
  .get("/getAppointments", getAppointments)
  .delete("/deleteAppointments", deleted);

module.exports = router;

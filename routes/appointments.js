const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const verifyToken = require("../middleware/verifyToken");
const {
  getAppointments,
  deleted,
} = require("../controllers/userAppointmentController");

router.post("/", appointmentsController.createAppointment);

router.get("/available", appointmentsController.getAvailableSlots);
router
  .get("/getAppointments", verifyToken, getAppointments)
  .delete("/deleteAppointments", verifyToken, deleted);

module.exports = router;

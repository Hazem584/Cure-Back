const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const {
  getAppointments,
  deleted,
} = require("../controllers/userAppointmentController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, appointmentsController.createAppointment);

router.get("/available", appointmentsController.getAvailableSlots);
router
  .get("/getAppointments", getAppointments)
  .delete("/deleteAppointments", deleted);

module.exports = router;

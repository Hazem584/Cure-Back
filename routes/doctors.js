const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const {
  editDoctor,
  deleteDoctor,
} = require("../controllers/dashboardController");

// GET /api/v1/doctors/:id/reviews
router.get("/:id/reviews", doctorController.getDoctorReviews);

// GET /api/v1/doctors/:id
router.get("/:id", doctorController.getDoctorById);

// POST /api/v1/doctors
router.post("/", doctorController.createDoctor);

router.put("/:id", editDoctor).delete("/:id", deleteDoctor);

module.exports = router;

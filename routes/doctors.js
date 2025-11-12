const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
// GET /api/v1/doctors
router.get("/", doctorController.getAllDoctors);

// GET /api/v1/doctors/:id/reviews
router.get("/:id/reviews", doctorController.getDoctorReviews);

// POST /api/v1/doctors/:id/reviews
router.post("/:id/reviews", doctorController.createDoctorReview);

// GET /api/v1/doctors/:id
router.get("/:id", doctorController.getDoctorById);

// POST /api/v1/doctors
router.post("/", doctorController.createDoctor);

module.exports = router;

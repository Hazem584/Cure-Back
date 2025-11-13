const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const checkRole = require("../middleware/checkRole");
const {
  editDoctor,
  deleteDoctor,
} = require("../controllers/dashboardController");
const verifyToken = require("../middleware/verifyToken");

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

router
  .put("/:id", verifyToken, checkRole("admin"), editDoctor)
  .delete("/", verifyToken, checkRole("admin"), deleteDoctor);

module.exports = router;

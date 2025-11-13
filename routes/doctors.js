const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const {
  editDoctor,
  deleteDoctor,
} = require("../controllers/dashboardController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

// GET /api/v1/doctors
router.get("/", doctorController.getAllDoctors);

// GET /api/v1/doctors/:id/reviews
router.get("/:id/reviews", verifyToken, doctorController.getDoctorReviews);

// POST /api/v1/doctors/:id/reviews
router.post(
  "/:id/reviews",
  verifyToken,
  checkRole("user", "admin"),
  doctorController.createDoctorReview
);

// GET /api/v1/doctors/:id
router.get("/:id", doctorController.getDoctorById);

// POST /api/v1/doctors
router.post(
  "/",
  verifyToken,
  checkRole("admin"),
  doctorController.createDoctor
);

router.patch("/:id", editDoctor).delete("/:id", deleteDoctor);

module.exports = router;

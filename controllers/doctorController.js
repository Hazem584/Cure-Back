const mongoose = require("mongoose");
const Doctor = require("../models/doctor_model");
const Review = require("../models/review_model");

createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;
    if (
      !doctorData.name ||
      !doctorData.specialty ||
      !doctorData.phone ||
      !doctorData.email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, specialty, phone, email",
      });
    }

    const existingDoctor = await Doctor.findOne({ email: doctorData.email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error creating doctor",
      error: error.message,
    });
  }
};

getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).select("-__v");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor",
      error: error.message,
    });
  }
};

getDoctorReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id",
      });
    }

    const doctor = await Doctor.findById(id).select(
      "name specialty image rating experience location consultationPrice"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const reviews = await Review.find({ doctorId: id })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const distribution = {
      fiveStars: reviews.filter((r) => r.rating >= 4.5).length,
      fourStars: reviews.filter((r) => r.rating >= 3.5 && r.rating < 4.5)
        .length,
      threeStars: reviews.filter((r) => r.rating >= 2.5 && r.rating < 3.5)
        .length,
      twoStars: reviews.filter((r) => r.rating >= 1.5 && r.rating < 2.5).length,
      oneStar: reviews.filter((r) => r.rating < 1.5).length,
    };

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialty: doctor.specialty,
          image: doctor.image,
          rating: doctor.rating,
          experience: doctor.experience,
          consultationPrice: doctor.consultationPrice,
          location: doctor.location,
        },
        ratingSummary: {
          average: Number(averageRating.toFixed(1)),
          count: totalReviews,
          distribution,
        },
        reviews: reviews.map((review) => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          visitType: review.visitType,
          createdAt: review.createdAt,
          patient: review.userId
            ? {
                id: review.userId._id,
                name: review.userId.name,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching doctor reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor reviews",
      error: error.message,
    });
  }
};

module.exports = {
  getDoctorById,
  getDoctorReviews,
  createDoctor,
};

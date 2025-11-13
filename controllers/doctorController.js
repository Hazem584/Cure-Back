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
getAllDoctors = async (req, res) => {
  try {
    const { specialty, city, search } = req.query;

    const filter = { isActive: true };

    if (specialty) {
      filter.specialty = specialty;
    }

    if (city) {
      filter["location.city"] = city;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(filter)
      .select("-__v")
      .sort({ "rating.average": -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
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
createDoctorReview = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const {
      rating,
      comment = "",
      visitType = "clinic",
      appointmentId,
    } = req.body;

    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id",
      });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    if (visitType && !["clinic", "online"].includes(visitType)) {
      return res.status(400).json({
        success: false,
        message: "visitType must be either clinic or online",
      });
    }

    const doctor = await Doctor.findById(doctorId).select("rating");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const existingReview = await Review.findOne({ doctorId, userId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this doctor",
      });
    }

    const review = await Review.create({
      doctorId,
      userId,
      rating,
      comment,
      visitType,
      appointmentId: appointmentId || undefined,
    });

    const currentAverage = doctor.rating?.average || 0;
    const currentCount = doctor.rating?.count || 0;
    const newCount = currentCount + 1;
    const newAverage = (
      (currentAverage * currentCount + rating) /
      newCount
    ).toFixed(1);

    doctor.rating.average = Number(newAverage);
    doctor.rating.count = newCount;
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        visitType: review.visitType,
        appointmentId: review.appointmentId || null,
        doctorId: review.doctorId,
        userId: review.userId,
        createdAt: review.createdAt,
      },
      ratingSummary: {
        average: doctor.rating.average,
        count: doctor.rating.count,
      },
    });
  } catch (error) {
    console.error("Error creating doctor review:", error);
    res.status(500).json({
      success: false,
      message: "Error creating doctor review",
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
  getAllDoctors,
  getDoctorById,
  getDoctorReviews,
  createDoctor,
  createDoctorReview,
};

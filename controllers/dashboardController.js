const mongoose = require("mongoose");
const Doctor = require("../models/doctor_model");
const editDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      specialty,
      image,
      phone,
      email,
      location,
      consultationPrice,
      experience,
      bio,
      education,
      languages,
      workingHours,
      isActive,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID format",
        status: 400,
      });
    }
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
        status: 404,
      });
    }
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        name,
        specialty,
        image,
        phone,
        email,
        location,
        consultationPrice,
        experience,
        bio,
        education,
        languages,
        workingHours,
        isActive,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Doctor updated successfully",
      status: 200,
      doctor: updatedDoctor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
      status: 500,
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID format",
        status: 400,
      });
    }
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
        status: 404,
      });
    }
    await doctor.deleteOne();
    return res.status(200).json({
      message: "Doctor deleted successfully",
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
      status: 500,
    });
  }
};

module.exports = { editDoctor, deleteDoctor };

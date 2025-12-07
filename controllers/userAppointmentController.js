const appointment = require("../models/appointments_model");
const mongoose = require("mongoose");

const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointment.find({ userId });
    if (!appointments || appointments.length == 0) {
      res.status(200).json({
        message: "no appointments exist",
        data: [],
      });
    } else {
      res.status(200).json({
        message: "all appointments",
        data: appointments,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const canceled = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment id",
      });
    }

    const appointmentDoc = await appointment.findOne({
      _id: appointmentId,
      userId,
    });

    if (!appointmentDoc) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointmentDoc.status = "cancelled";
    await appointmentDoc.save();

    return res.status(200).json({
      message: "Appointment has been cancelled successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { getAppointments, canceled };

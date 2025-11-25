const Appointment = require("../models/appointments_model");
const { formatAppointmentResponse } = require("../utils/appointmentFormatter");

const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ userId })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .populate({
        path: "doctorId",
        select: "name specialty image location phone",
      });

    const formattedAppointments = appointments.map((appointmentDoc) =>
      formatAppointmentResponse(appointmentDoc)
    );

    if (!appointments || appointments.length == 0) {
      return res.status(400).json({
        message: "no appointments exist",
        data: [],
      });
    } else {
      res.status(200).json({
        message: "all appointments",
        data: formattedAppointments,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    const check = await Appointment.findOne({ _id: appointmentId, userId });
    if (check) {
      await check.deleteOne();
      return res.status(200).json({
        message: "appointment has been deleted successfully",
      });
    } else {
      res.status(400).json({ message: "appointment not found" });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { getAppointments, deleted };

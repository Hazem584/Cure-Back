const appointment = require("../models/appointments_model");
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
const deleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    const check = await appointment.findOne({ _id: appointmentId, userId });
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

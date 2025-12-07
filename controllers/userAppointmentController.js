const appointment = require("../models/appointments_model");
const mongoose = require("mongoose");
const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointment
      .find({ userId })
      .populate({
        path: "doctorId",
        select: "name specialty image location consultationPrice",
      })
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    const formattedAppointments = appointments.map((app) => {
      const doctor = app.doctorId;

      return {
        id: app._id,
        status: app.status,
        appointmentDate: app.appointmentDate,
        appointmentTime: app.appointmentTime,
        paymentMethod: app.paymentMethod,
        notes: app.notes,
        price: app.price,
        patientName: app.patientName,
        patientPhone: app.patientPhone,

        doctor: doctor
          ? {
              id: doctor._id,
              name: doctor.name,
              specialty: doctor.specialty,
              image: doctor.image,
              address: doctor.location?.address,
              city: doctor.location?.city,
              consultationPrice: doctor.consultationPrice,
            }
          : null,
      };
    });

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        message: "no appointments exist",
        data: [],
      });
    } else {
      return res.status(200).json({
        message: "all appointments",
        data: formattedAppointments,
      });
    }
  } catch (err) {
    return res.status(500).json({
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

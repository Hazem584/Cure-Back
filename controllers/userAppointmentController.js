const Appointment = require("../models/appointments_model");

const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ userId })
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

    if (!appointments || appointments.length == 0) {
      res.status(200).json({
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

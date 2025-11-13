const Appointment = require("../models/appointments_model");
const Doctor = require("../models/doctor_model");

createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      paymentMethod,
      patientName,
      patientPhone,
      notes,
    } = req.body;

    const userId = req.user.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    const newAppointment = new Appointment({
      userId,
      doctorId,
      appointmentDate,
      appointmentTime,
      paymentMethod: paymentMethod || "clinic",
      patientName,
      patientPhone,
      notes,
      price: doctor.consultationPrice,
      status: "Upcoming",
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide doctorId and date (YYYY-MM-DD) as query parameters.",
      });
    }

    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: new Date(date),
      status: { $ne: "cancelled" },
    }).select("appointmentTime");

    const bookedTimes = bookedAppointments.map((app) => app.appointmentTime);
    const allSlots = [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
    ];

    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    res.status(200).json({
      success: true,
      date,
      availableSlots,
      bookedSlots: bookedTimes,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAvailableSlots,
};

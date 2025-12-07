const Appointment = require("../models/appointments_model");

const CHECK_INTERVAL_MS = 60 * 60 * 1000;

async function completePastAppointments() {
  const now = new Date();
  await Appointment.updateMany(
    { status: "Upcoming", appointmentDate: { $lte: now } },
    { $set: { status: "completed" } }
  );
}

function startAppointmentStatusUpdater() {
  completePastAppointments().catch((err) =>
    console.error("Error completing past appointments:", err)
  );
  setInterval(() => {
    completePastAppointments().catch((err) =>
      console.error("Error completing past appointments:", err)
    );
  }, CHECK_INTERVAL_MS);
}

module.exports = startAppointmentStatusUpdater;

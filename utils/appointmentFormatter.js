const buildAddressString = (location = {}) => {
  const parts = [location.address, location.city].filter(Boolean);
  return parts.join(", ") || null;
};

const extractDoctor = (doctorDoc) => {
  if (!doctorDoc || !doctorDoc._id) {
    return null;
  }

  return {
    id: doctorDoc._id,
    name: doctorDoc.name,
    specialty: doctorDoc.specialty,
    image: doctorDoc.image,
    address: buildAddressString(doctorDoc.location),
    location: doctorDoc.location || null,
    phone: doctorDoc.phone,
  };
};

const resolveDoctorDoc = (appointmentDoc, doctorOverride) => {
  if (doctorOverride && doctorOverride._id) {
    return doctorOverride;
  }

  if (
    appointmentDoc &&
    appointmentDoc.doctorId &&
    appointmentDoc.doctorId._id
  ) {
    return appointmentDoc.doctorId;
  }

  return null;
};

const formatAppointmentResponse = (appointmentDoc, doctorOverride = null) => {
  if (!appointmentDoc) {
    return null;
  }

  const doctorDoc = resolveDoctorDoc(appointmentDoc, doctorOverride);

  return {
    id: appointmentDoc._id,
    userId: appointmentDoc.userId,
    doctorId: appointmentDoc.doctorId?._id || appointmentDoc.doctorId,
    appointmentDate: appointmentDoc.appointmentDate,
    appointmentTime: appointmentDoc.appointmentTime,
    status: appointmentDoc.status,
    paymentMethod: appointmentDoc.paymentMethod,
    patientName: appointmentDoc.patientName,
    patientPhone: appointmentDoc.patientPhone,
    notes: appointmentDoc.notes,
    price: appointmentDoc.price,
    createdAt: appointmentDoc.createdAt,
    updatedAt: appointmentDoc.updatedAt,
    doctor: extractDoctor(doctorDoc),
  };
};

module.exports = {
  formatAppointmentResponse,
};

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    consultationPrice: {
      type: Number,
      required: true,
    },
    consultationType: {
      type: String,
      default: "In-clinic",
    },
    experience: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    bio: {
      type: String,
      default: "",
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    workingHours: {
      monday: {
        start: String,
        end: String,
        available: { type: Boolean, default: true },
      },
      tuesday: {
        start: String,
        end: String,
        available: { type: Boolean, default: true },
      },
      wednesday: {
        start: String,
        end: String,
        available: { type: Boolean, default: true },
      },
      thursday: {
        start: String,
        end: String,
        available: { type: Boolean, default: true },
      },
      friday: {
        start: String,
        end: String,
        available: { type: Boolean, default: true },
      },
      saturday: {
        start: String,
        end: String,
        available: { type: Boolean, default: false },
      },
      sunday: {
        start: String,
        end: String,
        available: { type: Boolean, default: false },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

doctorSchema.index({ name: "text", specialty: "text" });
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ "location.city": 1 });

module.exports = mongoose.model("Doctor", doctorSchema);

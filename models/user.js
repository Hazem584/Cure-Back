const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },

    avatarUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;

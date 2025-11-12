const express = require("express");
const User = require("../../models/user");

const getAllUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === "admin") {
      users = await User.find().select("-password");
    } else {
      const user = await User.findById(req.user.id).select("-password");
      users = user ? [user] : [];
    }

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Get Users Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = getAllUsers;
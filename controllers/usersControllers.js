const mongoose = require("mongoose");
const User = require("../models/user");

const get_one_user = async (req, res) => {
  const user_id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ 
      code: 400,
      message: "Invalid user ID format" 
    });
  }
  try {
    const found_user = await User.findById(user_id).select('-password -__v -_id -createdAt -updatedAt');;
    if (found_user) {
      return res.status(200).json({
        code: 200,
        data: found_user,
      });
    }

    return res.status(404).json({
      code: 404,
      message: "User not found",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
}

const update_user = async (req, res) => {
  const user_id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ 
      code: 400,
      message: "Invalid user ID format" 
    });
  }

  try {
    const updateData = { ...req.body };

    // if (req.file) {
    //   updateData.avatarUrl = `/uploads/${req.file.filename}`;
    // }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v -_id -createdAt -updatedAt');

    if (!updatedUser) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    return res.status(200).json({
      code: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Error updating user",
      error: err.message,
    });
  }
}

const delete_user = async (req, res) => {
  const user_id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      code: 400,
      message: "Invalid user ID format",
    });
  }

  try {
    const deleted_user = await User.findByIdAndDelete(user_id);

    if (!deleted_user) {
      return res.status(404).json({
        code: 404,
        message: "User_not_exist"
      });
    }

    return res.status(200).json({
      code: 200,
      message: "User deleted successfully",
      data: deleted_user,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Error deleting user",
      error: err.message,
    });
  }
}

module.exports = { get_one_user, update_user, delete_user };

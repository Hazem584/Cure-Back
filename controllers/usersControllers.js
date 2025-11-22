const mongoose = require("mongoose");
const User = require("../models/users_test");

const get_one_user = async (req, res) => {
  const user_id = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(user_id)) {
       return res.status(400).json({ 
        code:400,
        message: "Invalid user ID format" 
    });
     }

  try {
    const found_user = await User.findById(user_id);

    if (found_user) {
      res.status(200).json({
        code: 200,
        data: found_user,
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
}

const update_user = async (req,res) =>{
     const user_id = req.params.id;
     if (!mongoose.Types.ObjectId.isValid(user_id)) {
       return res.status(400).json({ 
        code:400,
        message: "Invalid user ID format" 
    });
     }

     try {
       const updatedUser = await User.findByIdAndUpdate(user_id, req.body, {
         new: true,
         runValidators: true,
       });

       if (!updatedUser) {
         return res.status(404).json({ message: "User not found" });
       }

       res.status(200).json({
         code: 200,
         message: "User updated successfully",
         data: updatedUser,
       });
     } catch (err) {
       res.status(500).json({
         code: 500,
         message: "Error updating user",
         error: err.message,
       });
     }
}

const delete_user = async (req, res)=>{
  const user_id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      code: 400,
      message: "Invalid user ID format",
    });
  }
  try{

    const deleted_user = await User.findByIdAndDelete(user_id);
    console.log(deleted_user);
    if(!deleted_user){
        res.status(404).json({
            code:404,
            message:"User_not_exist"
        })
    }
    else{
        res.status(200).json({
            code:200,
            message:"User deleted Success",
            data:deleted_user,
    })
    }


  }catch(err){
    res.status(500).json({
        code:500,
        message:"Error deleting user",
        error: err.message
    })
  }
}
module.exports = { get_one_user, update_user, delete_user }
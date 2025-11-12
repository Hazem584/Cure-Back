const mongoose = require("mongoose")

const user = new mongoose.Schema(
{
    name:{
    required: true,
    type: String
    },
    phone:{
        required:true,
        type: Number
    },
    age:{
        required: true,
        type: Number
    }
,
    email:{
        required: true,
        type: String
    }},
    { timestamps:true }    
)
module.exports = mongoose.model("test_users", user)
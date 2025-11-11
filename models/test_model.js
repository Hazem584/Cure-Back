const mongoose = require("mongoose")

const TestModel = new mongoose.Schema(
{name:{
    required: true,
    type: String
}
,
price:{
    required: true,
    type: Number
}},
{ timestamps:true }    
)
module.exports = mongoose.model("Test", TestModel)
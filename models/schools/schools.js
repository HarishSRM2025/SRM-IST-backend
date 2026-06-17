const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
    institutionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Institution",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    
},{timestamps:true})

module.exports = mongoose.model("School",schoolSchema);


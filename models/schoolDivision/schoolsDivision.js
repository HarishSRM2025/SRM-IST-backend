const mongoose = require("mongoose");

const SchoolDivisionSchema = new mongoose.Schema({
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"School",
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

module.exports = mongoose.model("SchoolDivision",SchoolDivisionSchema);


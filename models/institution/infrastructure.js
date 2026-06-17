const mongoose = require("mongoose");

const infrastructureSchema = new mongoose.Schema({
    institutionId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Institution'
    },
    infraName:{
        type:String,
        required:true
    },
    infraDesc:{
        type:String,
        required:true
    },
    infraImage:{
        type:String,
        required:true
    },
    equipment:[
        {
            type:String,
        }
    ],
    capacity:{
        type:Number,
    }
}, { timestamps: true });

module.exports = mongoose.model("Infrastructure",infrastructureSchema);

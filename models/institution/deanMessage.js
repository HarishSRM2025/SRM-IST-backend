const mongoose = require('mongoose')

const deanMessageSchema = new mongoose.Schema({
    institutionId:{
        type:String,
        required:true,
        ref:'Institution',
    },
    deanName:{
        type:String,
        required:true
    },
    deanImage:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
}, { timestamps: true });

module.exports = mongoose.model('DeanMessage',deanMessageSchema)
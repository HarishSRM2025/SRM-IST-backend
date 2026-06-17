const mongoose = require('mongoose')

const institutionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    vision:{
        type:String,
        required:true
    },
    mission:{
        type:String,
        required:true
    }
}, { timestamps: true });

module.exports = mongoose.model('Institution',institutionSchema)    
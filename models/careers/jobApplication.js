const express = require('express')
const mongoose = require('mongoose')

const jobApplicationSchema = new mongoose.Schema({
    positionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Careers'
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    coverLetter:{
        type:String,
        required:false
    }
    
},{timestamps:true})

module.exports = mongoose.model('JobApplication', jobApplicationSchema);

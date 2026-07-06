const mongoose = require('mongoose');

const careersSchema = new mongoose.Schema({
  title: {
    type: String,   
    required: true,
    },
  description:{
    type: String,
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
    },
location: { 
    type: String,
    required: true,
 },
type: {
    type: String,
    required: true,     
},
Institute: {
    type: String,
    required: true,
},
}, { timestamps: true });

const Careers = mongoose.model('Careers', careersSchema);

module.exports = Careers;
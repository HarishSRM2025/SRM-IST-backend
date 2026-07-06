const mongoose = require('mongoose');

const studentTestimonialSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  videoId:{
    type: String,
    required: true,
  },
  
}, {timestamps: true});

module.exports = mongoose.model('studentTestimonial', studentTestimonialSchema);

const StudentTestimonial = require("../../models/students/studentsTestimonial");

exports.createStudentTestimonial = async(req,res)=>{
    try {
        const {name,role,videoId} = req.body;
        if(!name || !role || !videoId){
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        const studentTestimonial = new StudentTestimonial({name,role,videoId});
        await studentTestimonial.save();
        res.status(201).json({success:true,message:"Student Testimonial created successfully",studentTestimonial});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

exports.getAllStudentTestimonials = async(req,res)=>{
    try {
        const studentTestimonials = await StudentTestimonial.find();
        res.status(200).json({success:true,studentTestimonials});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

exports.updateStudentTestimonial = async(req,res)=>{
    try {
        const {id,name,role,videoId} = req.body;
        if(!id){
            return res.status(400).json({success:false,message:"Id is required"});
        }
        const studentTestimonial = await StudentTestimonial.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json({success:true,message:"Student Testimonial updated successfully",studentTestimonial});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

exports.deleteStudentTestimonial = async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success:false,message:"Id is required"});
        }
        const studentTestimonial = await StudentTestimonial.findByIdAndDelete(id);
        res.status(200).json({success:true,message:"Student Testimonial deleted successfully",studentTestimonial});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

exports.getStudentTestimonialById = async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success:false,message:"Id is required"});
        }
        const studentTestimonial = await StudentTestimonial.findById(id);
        res.status(200).json({success:true,studentTestimonial});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}


const express = require("express");

const router = express.Router();

const {createStudentTestimonial,getAllStudentTestimonials,updateStudentTestimonial,deleteStudentTestimonial,getStudentTestimonialById} = require("../controller/student/studentTestimonial");

router.post("/create",createStudentTestimonial);
router.get("/getAll",getAllStudentTestimonials);
router.put("/update",updateStudentTestimonial);
router.delete("/delete/:id",deleteStudentTestimonial);
router.get("/getById/:id",getStudentTestimonialById);

module.exports = router;
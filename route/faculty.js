const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const Faculty = require("../controller/faculty/faculty");
const FacultyResearch = require("../controller/faculty/facultyResearch");
const FacultyExperience = require("../controller/faculty/facultyExperience");
const { requireCoordinatorScope } = require("../middleware/coordinatorScope");

// Faculty Personal Detail
router.use(requireCoordinatorScope);
router.post("/addfaculty", upload.single("facultyImage"), Faculty.addFaculty);
router.get("/getfaculty", Faculty.getFaculty);
router.get("/getfacultybyschool/:school", Faculty.getFacultyBySchool);
router.get("/getfacultybyinstitution/:institution", Faculty.getFacultyByInstitution);
router.get("/getfacultybyid/:id", Faculty.getFacultyById);
router.put("/updatefaculty/:id", upload.single("facultyImage"), Faculty.updateFaculty);
router.delete("/deletefaculty/:id", Faculty.deleteFaculty);

// Faculty Achievements
router.post("/addfacultyresearch", FacultyResearch.addFacultyResearch);
router.get("/getfacultyresearch", FacultyResearch.getFacultyResearch);
router.get("/getfacultyresearchbyid/:id", FacultyResearch.getFacultyResearchById);
router.get("/getfacultyresearchbyfaculty/:facultyId", FacultyResearch.getFacultyResearchByFacultyId);
router.put("/updatefacultyresearch/:id", FacultyResearch.updateFacultyResearch);
router.delete("/deletefacultyresearch/:id", FacultyResearch.deleteFacultyResearch);

// Faculty Experience
router.post("/addfacultyexperience", FacultyExperience.addFacultyExperience);
router.get("/getfacultyexperience", FacultyExperience.getFacultyExperience);
router.get("/getfacultyexperiencebyid/:id", FacultyExperience.facultyExperienceById);
router.get("/getfacultyexperiencebyfaculty/:facultyId", FacultyExperience.getFacultyExperienceByFacultyId);
router.put("/updatefacultyexperience/:id", FacultyExperience.updateFacultyExperience);
router.delete("/deletefacultyexperience/:id", FacultyExperience.deleteFacultyExperience);

module.exports = router;

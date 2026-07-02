const Faculty = require("../../models/faculty/faculty");

exports.addFaculty = async (req, res) => {
    try {
        const { facultyName, facultyEmail, facultyGender, institution, school, schoolDivision, subjects, designation, facultyExperience, areaOfInterest, educationDetails } = req.body;
        if (!facultyName || !facultyEmail || !facultyGender || (!school && !institution) || !subjects || !designation || !facultyExperience || !areaOfInterest || !educationDetails) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (await Faculty.findOne({ facultyEmail })) {
            return res.status(400).json({ message: "Faculty with this email already exists" });
        }
        let facultyImage = '';
        if (req.file) {
            facultyImage = req.file.path;
        }
        // Parse subjects if it arrives as a JSON string (from FormData)
        let parsedSubjects = subjects;
        if (typeof subjects === 'string') {
            try { parsedSubjects = JSON.parse(subjects); } catch (e) { parsedSubjects = []; }
        }
        // Parse educationDetails if it arrives as a JSON string (from FormData)
        let parsedEducationDetails = educationDetails;
        if (typeof educationDetails === 'string') {
            try { parsedEducationDetails = JSON.parse(educationDetails); } catch (e) { parsedEducationDetails = []; }
        }
        const hasInstitution = institution && institution !== "null" && institution !== "";
        const faculty = new Faculty({
            facultyName,
            facultyEmail,
            facultyImage,
            facultyGender,
            institution: hasInstitution ? institution : undefined,
            school: !hasInstitution && school ? school : undefined,
            schoolDivision: !hasInstitution && schoolDivision ? schoolDivision : undefined,
            subjects: parsedSubjects,
            educationDetails: parsedEducationDetails,
            designation,
            facultyExperience,
            areaOfInterest
        });
        await faculty.save();
        res.status(201).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find();
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getFacultyBySchool = async (req, res) => {
    try {
        const faculty = await Faculty.find({ school: req.params.school });
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getFacultyById = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.updateFaculty = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.facultyImage = req.file.path;
        }
        // Parse subjects if it arrives as a JSON string (from FormData)
        if (typeof updateData.subjects === 'string') {
            try { updateData.subjects = JSON.parse(updateData.subjects); } catch (e) { /* keep as-is */ }
        }
        // Parse educationDetails if it arrives as a JSON string (from FormData)
        if (typeof updateData.educationDetails === 'string') {
            try { updateData.educationDetails = JSON.parse(updateData.educationDetails); } catch (e) { /* keep as-is */ }
        }
        const hasInstitution = updateData.institution && updateData.institution !== "null" && updateData.institution !== "";
        if (hasInstitution) {
            updateData.school = null;
            updateData.schoolDivision = null;
        } else {
            updateData.institution = null;
            if (updateData.school === "" || updateData.school === "null") {
                updateData.school = null;
            }
            if (updateData.schoolDivision === "" || updateData.schoolDivision === "null") {
                updateData.schoolDivision = null;
            }
        }
        const faculty = await Faculty.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndDelete(req.params.id);
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getFacultyByInstitution = async (req, res) => {
    try {
        const faculty = await Faculty.find({ institution: req.params.institution });
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
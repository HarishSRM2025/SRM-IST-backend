const fs = require("fs");
const path = require("path");
const Faculty = require("../../models/faculty/faculty");

exports.addFaculty = async (req, res) => {
    try {
        const { facultyName, facultyEmail, facultyGender, school, schoolDivision, subjects, designation, facultyExperience, areaOfInterest, educationDetails } = req.body;
        if (!facultyName || !facultyEmail || !facultyGender || !school || !subjects || !designation || !facultyExperience || !areaOfInterest || !educationDetails) {
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
        const faculty = new Faculty({
            facultyName,
            facultyEmail,
            facultyImage,
            facultyGender,
            school,
            schoolDivision: schoolDivision || undefined,
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
        const faculty = await Faculty.findById(req.params.id);

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        const updateData = { ...req.body };

        // If a new image is uploaded
        if (req.file) {

            // Delete old image
            if (faculty.facultyImage) {
                const oldImagePath = path.join(process.cwd(), faculty.facultyImage);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updateData.facultyImage = req.file.path;
        }

        // Parse subjects
        if (typeof updateData.subjects === "string") {
            try {
                updateData.subjects = JSON.parse(updateData.subjects);
            } catch (e) {}
        }

        // Parse educationDetails
        if (typeof updateData.educationDetails === "string") {
            try {
                updateData.educationDetails = JSON.parse(updateData.educationDetails);
            } catch (e) {}
        }

        const updatedFaculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedFaculty);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        // Delete profile image
        if (faculty.facultyImage) {
            const imagePath = path.join(process.cwd(), faculty.facultyImage);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Faculty.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Faculty deleted successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFacultyDirectory = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const school = req.query.school;
        const department = req.query.department;

        const filter = {};

        if (school) {
            filter.school = school;
        }

        if (department) {
            filter.schoolDivision = department;
        }

        const totalItems = await Faculty.countDocuments(filter);

        const faculty = await Faculty.find(filter)
            .sort({ facultyName: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Department Wise Counts
        const departmentCounts = await Faculty.aggregate([
            ...(school ? [{
                $match: {
                    school: school
                }
            }] : []),

            {
                $group: {
                    _id: "$schoolDivision",
                    totalFaculty: {
                        $sum: 1
                    }
                }
            }
        ]);

        res.status(200).json({
            faculty,

            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                totalItems,
                itemsPerPage: limit
            },

            departmentCounts
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
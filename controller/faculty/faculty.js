const Faculty = require("../../models/faculty/faculty");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");
const School = require("../../models/schools/schools");
const SchoolDivision = require("../../models/schoolDivision/schoolsDivision");

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
            facultyImage = "public/uploads/" + req.file.filename;
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
        if (req.coordinator) {
            if (req.coordinator.mappingLevel === 'institute' && String(institution) !== String(req.coordinator.instituteId)) {
                return res.status(403).json({ message: "Forbidden" });
            }
            if (req.coordinator.mappingLevel === 'school') {
                const schoolDoc = await School.findById(school);
                if (!schoolDoc || String(schoolDoc.institutionId) !== String(req.coordinator.instituteId) || String(school) !== String(req.coordinator.schoolId)) {
                    return res.status(403).json({ message: "Forbidden" });
                }
            }
            if (req.coordinator.mappingLevel === 'division') {
                const divisionDoc = await SchoolDivision.findById(schoolDivision);
                if (!divisionDoc || String(divisionDoc._id) !== String(req.coordinator.divisionId)) {
                    return res.status(403).json({ message: "Forbidden" });
                }
            }
        }
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
async function buildFacultyCoordinatorFilter(coordinator) {
    if (!coordinator) return {};
    if (coordinator.mappingLevel === 'institute') {
        const schoolIds = await School.find({ institutionId: coordinator.instituteId }).distinct('_id');
        const divisionIds = await SchoolDivision.find({ schoolId: { $in: schoolIds } }).distinct('_id');
        return {
            $or: [
                { institution: coordinator.instituteId },
                { school: { $in: schoolIds } },
                { schoolDivision: { $in: divisionIds } }
            ]
        };
    }
    if (coordinator.mappingLevel === 'school') {
        const divisionIds = await SchoolDivision.find({ schoolId: coordinator.schoolId }).distinct('_id');
        return {
            $or: [
                { school: coordinator.schoolId },
                { schoolDivision: { $in: divisionIds } }
            ]
        };
    }
    if (coordinator.mappingLevel === 'division') {
        return { schoolDivision: coordinator.divisionId };
    }
    return {};
}

exports.getFaculty = async (req, res) => {
    try {
        const filter = await buildFacultyCoordinatorFilter(req.coordinator);
        const faculty = await Faculty.find(filter);
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getFacultyBySchool = async (req, res) => {
    try {
        if (req.coordinator && req.coordinator.mappingLevel === 'division' && String(req.params.school) !== String(req.coordinator.schoolId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const faculty = await Faculty.find({ school: req.params.school });
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getFacultyByInstitution = async (req, res) => {
    try {
        if (req.coordinator && String(req.params.institution) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const faculty = await Faculty.find({ institution: req.params.institution });
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
        if (req.coordinator) {
            if (req.coordinator.mappingLevel === 'institute' && String(updateData.institution || faculty.institution) !== String(req.coordinator.instituteId)) return res.status(403).json({ message: "Forbidden" });
            if (req.coordinator.mappingLevel === 'school' && String(updateData.school || faculty.school) !== String(req.coordinator.schoolId)) return res.status(403).json({ message: "Forbidden" });
            if (req.coordinator.mappingLevel === 'division' && String(updateData.schoolDivision || faculty.schoolDivision) !== String(req.coordinator.divisionId)) return res.status(403).json({ message: "Forbidden" });
        }

        // Sanitize ObjectId fields to prevent casting errors
        if ('institution' in updateData || 'school' in updateData || 'schoolDivision' in updateData) {
            const hasInstitution = updateData.institution && updateData.institution !== "null" && updateData.institution !== "";
            if (hasInstitution) {
                updateData.institution = updateData.institution;
                updateData.school = null;
                updateData.schoolDivision = null;
            } else {
                updateData.institution = null;
                updateData.school = updateData.school && updateData.school !== "null" && updateData.school !== "" ? updateData.school : null;
                updateData.schoolDivision = updateData.schoolDivision && updateData.schoolDivision !== "null" && updateData.schoolDivision !== "" ? updateData.schoolDivision : null;
            }
        }

        // If a new image is uploaded
        if (req.file) {

            // Delete old image
            if (faculty.facultyImage) {
                const cleanRel = faculty.facultyImage.replace(/\\/g, '/');
                const oldRel = cleanRel.startsWith('public/')
                    ? cleanRel
                    : cleanRel.startsWith('uploads/')
                        ? `public/${cleanRel}`
                        : `public/uploads/${cleanRel}`;
                const oldImagePath = path.join(__dirname, "../../", oldRel);

                if (fs.existsSync(oldImagePath)) {
                    try { fs.unlinkSync(oldImagePath); } catch (e) {}
                }
            }

            updateData.facultyImage = "public/uploads/" + req.file.filename;
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

        deleteUploadedFiles(faculty.facultyImage);

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

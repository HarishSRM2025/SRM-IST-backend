const facultyExperience = require('../../models/faculty/facultyExperience');
const Faculty = require('../../models/faculty/faculty');
const School = require('../../models/schools/schools');
const SchoolDivision = require('../../models/schoolDivision/schoolsDivision');

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

async function canAccessFaculty(req, facultyId) {
    if (!req.coordinator || !facultyId) return true;
    const filter = await buildFacultyCoordinatorFilter(req.coordinator);
    filter._id = facultyId;
    const faculty = await Faculty.findOne(filter);
    return Boolean(faculty);
}

const addFacultyExperience = async (req, res) => {
    try {
        const { facultyId, industryExperience } = req.body;
        if (!(await canAccessFaculty(req, facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const newExperience = new facultyExperience({
            facultyId,
            industryExperience
        });
        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFacultyExperience = async (req, res) => {
    try {
        let filter = {};
        if (req.coordinator) {
            const facultyFilter = await buildFacultyCoordinatorFilter(req.coordinator);
            const facultyIds = await Faculty.find(facultyFilter).distinct('_id');
            filter = { facultyId: { $in: facultyIds } };
        }
        const experience = await facultyExperience.find(filter);
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateFacultyExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { facultyId, industryExperience } = req.body;
        if (!(await canAccessFaculty(req, facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const existing = await facultyExperience.findById(id);
        if (req.coordinator && !(await canAccessFaculty(req, existing?.facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updatedExperience = await facultyExperience.findByIdAndUpdate(id, { facultyId, industryExperience }, { new: true });
        if (!updatedExperience) {
            return res.status(404).json({ message: "Faculty experience not found" });
        }       res.status(200).json(updatedExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }   
};

const deleteFacultyExperience = async (req, res) => {   
    try {
        const { id } = req.params;
        const existing = await facultyExperience.findById(id);
        if (req.coordinator && !(await canAccessFaculty(req, existing?.facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const deletedExperience = await facultyExperience.findByIdAndDelete(id);
        if (!deletedExperience) {
            return res.status(404).json({ message: "Faculty experience not found" });
        }

        res.status(200).json({ message: "Faculty experience deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFacultyExperienceByFacultyId = async (req, res) => {
    try {
        const { facultyId } = req.params;
        if (!(await canAccessFaculty(req, facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const experience = await facultyExperience.find({ facultyId });   
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const facultyExperienceById = async (req, res) => {
    try {
        const { id } = req.params;
        const experience = await facultyExperience.findById(id);
        if (!experience) {
            return res.status(404).json({ message: "Faculty experience not found" });
        }
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addFacultyExperience,
    getFacultyExperience,   
    updateFacultyExperience,
    deleteFacultyExperience,
    getFacultyExperienceByFacultyId,
    facultyExperienceById
};

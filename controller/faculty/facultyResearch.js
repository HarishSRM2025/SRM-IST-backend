const FacultyResearch = require("../../models/faculty/facultyResearch");
const Faculty = require("../../models/faculty/faculty");
const School = require("../../models/schools/schools");
const SchoolDivision = require("../../models/schoolDivision/schoolsDivision");

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

async function facultyFilterForCoordinator(req) {
    if (!req.coordinator) return {};
    const facultyFilter = await buildFacultyCoordinatorFilter(req.coordinator);
    const facultyIds = await Faculty.find(facultyFilter).distinct('_id');
    return { facultyId: { $in: facultyIds } };
}

exports.addFacultyResearch = async (req, res) => {
    try {
        const { facultyId,awards_and_achievements,publications,patents,grants,conferences,workshop,fundedProject } = req.body;
        if (!(await canAccessFaculty(req, facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        // if (!facultyId || !awards_and_achievements || !publications || !patents || !grants || !conferences || !workshop || !fundedProject) {
        //     return res.status(400).json({ message: "All fields are required" });
        // }
        const facultyResearch = new FacultyResearch({
            facultyId,
            awards_and_achievements,
            publications,
            patents,
            grants,
            conferences,
            workshop,
            fundedProject
        });
        await facultyResearch.save();
        res.status(201).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getFacultyResearch = async (req, res) => {
    try {
        const filter = await facultyFilterForCoordinator(req);
        const facultyResearch = Object.keys(filter).length ? await FacultyResearch.find(filter) : await FacultyResearch.find();
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getFacultyResearchById = async (req, res) => {
    try {
        const facultyResearch = await FacultyResearch.findById(req.params.id);
        if (req.coordinator && !(await canAccessFaculty(req, facultyResearch?.facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getFacultyResearchByFacultyId = async (req, res) => {
    try {
        if (req.coordinator && !(await canAccessFaculty(req, req.params.facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const facultyResearch = await FacultyResearch.findOne({ facultyId: req.params.facultyId });
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.updateFacultyResearch = async (req, res) => {
    try {
        const { facultyId,awards_and_achievements,publications,patents,grants,conferences,workshop,fundedProject } = req.body;
        if (!(await canAccessFaculty(req, facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!facultyId || !awards_and_achievements || !publications || !patents || !grants || !conferences || !workshop || !fundedProject) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existing = await FacultyResearch.findById(req.params.id);
        if (req.coordinator && !(await canAccessFaculty(req, existing?.facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const facultyResearch = await FacultyResearch.findByIdAndUpdate(req.params.id, {
            facultyId,
            awards_and_achievements,
            publications,
            patents,
            grants,
            conferences,
            workshop,
            fundedProject
        }, { new: true });
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.deleteFacultyResearch = async (req, res) => {
    try {
        const existing = await FacultyResearch.findById(req.params.id);
        if (req.coordinator && !(await canAccessFaculty(req, existing?.facultyId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const facultyResearch = await FacultyResearch.findByIdAndDelete(req.params.id);
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   

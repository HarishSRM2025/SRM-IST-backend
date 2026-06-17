const FacultyResearch = require("../../models/faculty/facultyResearch");

exports.addFacultyResearch = async (req, res) => {
    try {
        const { facultyId,awards_and_achievements,publications,patents,grants,conferences,workshop,fundedProject } = req.body;
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
        const facultyResearch = await FacultyResearch.find();
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getFacultyResearchById = async (req, res) => {
    try {
        const facultyResearch = await FacultyResearch.findById(req.params.id);
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getFacultyResearchByFacultyId = async (req, res) => {
    try {
        const facultyResearch = await FacultyResearch.findOne({ facultyId: req.params.facultyId });
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.updateFacultyResearch = async (req, res) => {
    try {
        const { facultyId,awards_and_achievements,publications,patents,grants,conferences,workshop,fundedProject } = req.body;
        if (!facultyId || !awards_and_achievements || !publications || !patents || !grants || !conferences || !workshop || !fundedProject) {
            return res.status(400).json({ message: "All fields are required" });
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
        const facultyResearch = await FacultyResearch.findByIdAndDelete(req.params.id);
        res.status(200).json(facultyResearch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   
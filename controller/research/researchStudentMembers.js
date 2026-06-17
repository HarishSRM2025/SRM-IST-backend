const ResearchStudentMembers = require("../../models/research/researchStudentMembers");

exports.addResearchStudentMembers = async (req, res) => {
    try {
        const researchStudentMembers = new ResearchStudentMembers(req.body);
        await researchStudentMembers.save();
        res.status(201).json(researchStudentMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateResearchStudentMembers = async (req, res) => {
    try {
        const researchStudentMembers = await ResearchStudentMembers.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(researchStudentMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteResearchStudentMembers = async (req, res) => {
    try {
        const researchStudentMembers = await ResearchStudentMembers.findByIdAndDelete(req.params.id);
        res.status(200).json(researchStudentMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getResearchStudentMembers = async (req, res) => {
    try {
        const researchStudentMembers = await ResearchStudentMembers.find();
        res.status(200).json(researchStudentMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getResearchStudentMembersById = async (req, res) => {
    try {
        const researchStudentMembers = await ResearchStudentMembers.findById(req.params.id);
        res.status(200).json(researchStudentMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
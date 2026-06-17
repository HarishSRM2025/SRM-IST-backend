const ResearchFacultyMembers = require('../../models/research/researchFacultyMembers')

// Create a new research faculty member
exports.createResearchFacultyMember = async (req, res) => {
    try {
        const {researchCenterId,facultyId} = req.body;
        const researchFacultyMember = new ResearchFacultyMembers({
            researchCenterId,
            facultyId
        });
        await researchFacultyMember.save();
        res.status(201).json(researchFacultyMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllResearchFacultyMembers = async (req, res) => {
    try {
        const members = await ResearchFacultyMembers.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResearchFacultyMemberById = async (req, res) => {
    try {
        const researchFacultyMember = await ResearchFacultyMembers.findById(req.params.id);
        if (!researchFacultyMember) {
            return res.status(404).json({ message: 'Research faculty member not found' });
        }
        res.status(200).json(researchFacultyMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateResearchFacultyMember = async (req, res) => {
    try {
        const {researchCenterId,facultyId} = req.body;
        const researchFacultyMember = await ResearchFacultyMembers.findByIdAndUpdate(
            req.params.id,
            { researchCenterId, facultyId },
            { new: true }
        );
        if (!researchFacultyMember) {
            return res.status(404).json({ message: 'Research faculty member not found' });
        }
        res.status(200).json(researchFacultyMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteResearchFacultyMember = async (req, res) => {
    try {
        const researchFacultyMember = await ResearchFacultyMembers.findByIdAndDelete(req.params.id);
        if (!researchFacultyMember) {
            return res.status(404).json({ message: 'Research faculty member not found' });
        }
        res.status(200).json({ message: 'Research faculty member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
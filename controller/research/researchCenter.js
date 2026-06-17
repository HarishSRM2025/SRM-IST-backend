const ResearchCenter = require('../../models/research/researchCenter');

// Create a new research center
exports.createResearchCenter = async (req, res) => {
    try {
        const { centerName, centerMission, centerRolesResponsibility, publicationAndProjectOutcomes, studentTrainingAndDevelopment } = req.body;
        const researchCenter = new ResearchCenter({
            centerName,
            centerMission,
            centerRolesResponsibility,
            publicationAndProjectOutcomes,
            studentTrainingAndDevelopment
        });
        await researchCenter.save();
        res.status(201).json(researchCenter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllResearchCenters = async (req, res) => {
    try {
        const researchCenters = await ResearchCenter.find();    
        res.status(200).json(researchCenters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};      

exports.getResearchCenterById = async (req, res) => {
    try {
        const researchCenter = await ResearchCenter.findById(req.params.id);
        if (!researchCenter) {
            return res.status(404).json({ message: 'Research center not found' });
        }
        res.status(200).json(researchCenter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};      

exports.updateResearchCenter = async (req, res) => {    
    try {
        const { centerName, centerMission, centerRolesResponsibility, publicationAndProjectOutcomes, studentTrainingAndDevelopment } = req.body;
        const researchCenter = await ResearchCenter.findByIdAndUpdate(
            req.params.id,
            {
                centerName,
                centerMission,
                centerRolesResponsibility,
                publicationAndProjectOutcomes,
                studentTrainingAndDevelopment
            },
            { new: true }
        );
        if (!researchCenter) {
            return res.status(404).json({ message: 'Research center not found' });
        }
        res.status(200).json(researchCenter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};      

exports.deleteResearchCenter = async (req, res) => {
    try {
        const researchCenter = await ResearchCenter.findByIdAndDelete(req.params.id);
        if (!researchCenter) {
            return res.status(404).json({ message: 'Research center not found' });
        }
        res.status(200).json({ message: 'Research center deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
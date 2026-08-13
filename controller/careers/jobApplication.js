const JobApplication = require('../../models/careers/jobApplication')
const deleteUploadedFiles = require('../../utils/deleteUploadedFiles')

exports.addJobApplication = async (req, res) => {
    try {
        const { positionId, name, email, phone, coverLetter } = req.body;
        if (!positionId || !name || !email || !phone || !req.file) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const jobApplication = new JobApplication({
            positionId,
            name,
            email,
            phone,
            resume: req.file.filename || req.file.path,
            coverLetter
        });
        await jobApplication.save();
        res.status(201).json({ message: "Job application added successfully", jobApplication });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getJobApplications = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find().populate('positionId').sort({ createdAt: -1 });
        res.status(200).json({ jobApplications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getJobApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const jobApplication = await JobApplication.findById(id).populate('positionId');
        res.status(200).json({ jobApplication });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteJobApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const jobApplication = await JobApplication.findById(id);
        if (!jobApplication) {
            return res.status(404).json({ message: "Job application not found" });
        }

        deleteUploadedFiles(jobApplication.resume);
        await JobApplication.findByIdAndDelete(id);

        res.status(200).json({ message: "Job application deleted successfully", jobApplication });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getApplicationsByPosition = async (req, res) => {
    try {
        const { positionId } = req.params;
        const jobApplications = await JobApplication.find({ positionId }).populate('positionId').sort({ createdAt: -1 });
        res.status(200).json({ jobApplications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

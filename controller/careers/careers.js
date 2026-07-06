const Careers = require('../../models/careers/careers');

exports.addCareer = async (req, res) => {
    try {
        const { title, description, eligibility, location, type, Institute } = req.body;    
        if (!title || !description || !eligibility || !location || !type || !Institute) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const career = new Careers({
            title,
            description,
            eligibility,
            location,
            type,
            Institute
        });
        await career.save();
        res.status(201).json({ message: "Career added successfully", career });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCareers = async (req, res) => {
    try {
        const careers = await Careers.find().sort({ createdAt: -1 });
        res.status(200).json({ careers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCareer = async (req, res) => {
    try {
        const { id } = req.params;
        const career = await Careers.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Career updated successfully", career });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCareer = async (req, res) => {
    try {
        const { id } = req.params;
        const career = await Careers.findByIdAndDelete(id);
        res.status(200).json({ message: "Career deleted successfully", career });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCareerById = async (req, res) => {
    try {
        const { id } = req.params;
        const career = await Careers.findById(id);
        res.status(200).json({ career });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCareersByInstitute = async (req, res) => {
    try {
        const { Institute } = req.params;
        const careers = await Careers.find({ Institute }).sort({ createdAt: -1 });
        res.status(200).json({ careers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

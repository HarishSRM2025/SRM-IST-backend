const EventsAndActivities = require("../../models/schools/eventsAndActivities");

const toBoolean = (value) => value === true || value === "true" || value === "on" || value === "1";

exports.createEventsAndActivities = async (req, res) => {
    try {
        const {
            school,
            name,
            description,
            eventDateTime,
            location,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement
        } = req.body;

        let eventImage = [];
        if (req.files && req.files.length > 0) {
            eventImage = req.files.map(f => f.filename);
        } else if (req.file) {
            eventImage = [req.file.filename];
        }
        if (eventImage.length === 0) {
            eventImage = undefined;
        }

        const newRecord = await EventsAndActivities.create({
            school,
            name,
            description,
            eventDateTime,
            location,
            eventImage,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement: toBoolean(announcement)
        });

        res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Events and Activities" });
    }
};

exports.getAllEventsAndActivities = async (req, res) => {
    try {
        const list = await EventsAndActivities.find().populate("school");
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Events and Activities" });
    }
};

exports.getEventsAndActivitiesById = async (req, res) => {
    try {
        const record = await EventsAndActivities.findById(req.params.id).populate("school");
        if (!record) {
            return res.status(404).json({ message: "Events and Activities not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Events and Activities" });
    }
};

exports.updateEventsAndActivities = async (req, res) => {
    try {
        const {
            school,
            name,
            description,
            eventDateTime,
            location,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement
        } = req.body;

        const updateData = {
            school,
            name,
            description,
            eventDateTime,
            location,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement: toBoolean(announcement)
        };

        // Support multiple images on update
        let eventImage = [];
        if (req.files && req.files.length > 0) {
            eventImage = req.files.map(f => f.filename);
        } else if (req.file) {
            eventImage = [req.file.filename];
        } else if (req.body.eventImage) {
            eventImage = Array.isArray(req.body.eventImage) ? req.body.eventImage : [req.body.eventImage];
        }
        if (eventImage.length > 0) {
            updateData.eventImage = eventImage;
        }

        const updatedRecord = await EventsAndActivities.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedRecord) {
            return res.status(404).json({ message: "Events and Activities not found" });
        }

        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Events and Activities" });
    }
};

exports.deleteEventsAndActivities = async (req, res) => {
    try {
        const deletedRecord = await EventsAndActivities.findByIdAndDelete(req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({ message: "Events and Activities not found" });
        }
        res.status(200).json({ message: "Events and Activities deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting Events and Activities" });
    }
};

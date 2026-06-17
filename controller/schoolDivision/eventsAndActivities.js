const SchoolDivisionEventsAndActivities = require("../../models/schoolDivision/eventsAndActivities")

const toBoolean = (value) => value === true || value === "true" || value === "on" || value === "1";

exports.createEventsAndActivities = async (req, res) => {
    try {
        const {
            schoolDivisionId,
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

        // Support multiple images
        let eventImage = [];
        if (req.files && req.files.length > 0) {
            eventImage = req.files.map(f => f.filename);
        } else if (req.file) {
            eventImage = [req.file.filename];
        }
        if (eventImage.length === 0) {
            eventImage = undefined;
        }

        const newRecord = await SchoolDivisionEventsAndActivities.create({
            schoolDivisionId,
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
        const list = await SchoolDivisionEventsAndActivities.find().populate("schoolDivisionId");
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Events and Activities" });
    }
};

exports.getEventsAndActivitiesById = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await SchoolDivisionEventsAndActivities.findById(id).populate("schoolDivisionId");
        if (!event) {
            return res.status(404).json({ message: "Events and Activities not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Events and Activities" });
    }
};

exports.updateEventsAndActivitiesById = async (req, res) => {
    try {
        const {id} = req.params;
        const {schoolDivisionId, name, description, eventDateTime, location, type, conductedBy, co_ordinator, resourcePerson, resourcePersonDesignation, status, announcement} = req.body;
        const updateData = {
            schoolDivisionId,
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
        } else if (req.body.eventImage) {
            // client may send a single filename string
            eventImage = Array.isArray(req.body.eventImage) ? req.body.eventImage : [req.body.eventImage];
        }
        if (eventImage.length > 0) {
            updateData.eventImage = eventImage;
        }

        const event = await SchoolDivisionEventsAndActivities.findByIdAndUpdate(id, updateData, {new: true});
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Events and Activities" });
    }
};

exports.deleteEventsAndActivitiesById = async (req, res) => {
    try {
        const {id} = req.params;
        await SchoolDivisionEventsAndActivities.findByIdAndDelete(id);
        res.status(200).json({message: "Events and Activities deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting Events and Activities" });
    }
};

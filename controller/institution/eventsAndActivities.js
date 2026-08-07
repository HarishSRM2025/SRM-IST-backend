const InstitutionEventsAndActivities = require("../../models/institution/eventsAndActivities")
const fs = require("fs");
const path = require("path");
const toBoolean = (value) => value === true || value === "true" || value === "on" || value === "1";

exports.createEventsAndActivities = async (req, res) => {
    try {
        const {
            institutionId,
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

        // Support multiple images: collect filenames from req.files (array) or fallback to single file
        let eventImage = [];
        if (req.files && req.files.length > 0) {
            eventImage = req.files.map(f => f.filename);
        } else if (req.file) {
            eventImage = [req.file.filename];
        }
        // If no images provided, keep undefined (optional)
        if (eventImage.length === 0) {
            eventImage = undefined;
        }

        const newRecord = await InstitutionEventsAndActivities.create({
            institutionId,
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
        const filter = req.coordinator ? { institutionId: req.coordinator.instituteId } : {};
        const list = await InstitutionEventsAndActivities.find(filter).populate("institutionId");
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Events and Activities" });
    }
};

exports.getEventsAndActivitiesById = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await InstitutionEventsAndActivities.findById(id).populate("institutionId");
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
        const { id } = req.params;

        const {
            institutionId,
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

        // Get existing event
        const existingEvent = await InstitutionEventsAndActivities.findById(id);

        if (!existingEvent) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const updateData = {
            institutionId,
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

            // Delete old images
            if (existingEvent.eventImage && existingEvent.eventImage.length > 0) {

                existingEvent.eventImage.forEach((image) => {

                    const oldImagePath = path.join(
                        process.cwd(),
                        "public/uploads",
                        image
                    );

                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }

                });
            }

            // Add new images
            eventImage = req.files.map(file => file.filename);

        } else if (req.file) {

            // Delete old images
            if (existingEvent.eventImage && existingEvent.eventImage.length > 0) {

                existingEvent.eventImage.forEach((image) => {

                    const oldImagePath = path.join(
                        process.cwd(),
                        "public/uploads",
                        image
                    );

                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }

                });
            }

            eventImage = [req.file.filename];

        } else if (req.body.eventImage) {

            eventImage = Array.isArray(req.body.eventImage)
                ? req.body.eventImage
                : [req.body.eventImage];
        }


        if (eventImage.length > 0) {
            updateData.eventImage = eventImage;
        }


        const event = await InstitutionEventsAndActivities.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json(event);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating Events and Activities"
        });
    }
};


exports.deleteEventsAndActivitiesById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get event first
        const event = await InstitutionEventsAndActivities.findById(id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }


        // Delete all images
        if (event.eventImage && event.eventImage.length > 0) {

            event.eventImage.forEach((image) => {

                const imagePath = path.join(
                    process.cwd(),
                    "public/uploads",
                    image
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }

            });

        }


        // Delete database record
        await InstitutionEventsAndActivities.findByIdAndDelete(id);


        res.status(200).json({
            message: "Events and Activities deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error deleting Events and Activities"
        });
    }
};

// Get recent 3 events for home page
exports.getRecentEventsAndActivities = async (req, res) => {
  try {
    const recent = await InstitutionEventsAndActivities.find()
      .sort({ eventDateTime: -1 })
      .limit(3)
      .populate('institutionId');
    res.status(200).json(recent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recent Events and Activities" });
  }
};

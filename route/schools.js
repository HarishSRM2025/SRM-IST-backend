const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool } = require('../controller/schools/schools');
const { addHODMessage, getHODMessage, getHODMessageById, updateHODMessage, deleteHODMessage } = require('../controller/schools/hodMessage');
const { createProgramme, getAllProgrammes, getProgrammeById, updateProgramme, deleteProgramme } = require('../controller/schools/programmes');
const { createEventsAndActivities, getAllEventsAndActivities, getEventsAndActivitiesById, updateEventsAndActivities, deleteEventsAndActivities } = require('../controller/schools/eventsAndActivities');
const { createAchievement, getAllAchievements, getAchievementById, updateAchievement, deleteAchievement } = require('../controller/schools/achievements');

// Schools
router.post('/create', createSchool);
router.get('/getall', getAllSchools);
router.get('/get/:id', getSchoolById);
router.put('/update/:id', updateSchool);
router.delete('/delete/:id', deleteSchool);

// HOD Message
router.post('/hod-message/add', upload.single("hodImage"), addHODMessage);
router.get('/hod-message/getall', getHODMessage);
router.get('/hod-message/get/:id', getHODMessageById);
router.put('/hod-message/update/:id', upload.single("hodImage"), updateHODMessage);
router.delete('/hod-message/delete/:id', deleteHODMessage);

// Programmes
router.post('/programmes/add', createProgramme);
router.get('/programmes/getall', getAllProgrammes);
router.get('/programmes/get/:id', getProgrammeById);
router.put('/programmes/update/:id', updateProgramme);

// Achievements
router.post('/achievements/add', upload.single("achievementImage"), createAchievement);
router.get('/achievements/getall', getAllAchievements);
router.get('/achievements/get/:id', getAchievementById);
router.put('/achievements/update/:id', upload.single("achievementImage"), updateAchievement);
router.delete('/achievements/delete/:id', deleteAchievement);

// Events & Activities
router.post('/events-and-activities/add', upload.array("eventImage"), createEventsAndActivities);
router.get('/events-and-activities/getall', getAllEventsAndActivities);
router.get('/events-and-activities/get/:id', getEventsAndActivitiesById);
router.put('/events-and-activities/update/:id', upload.array("eventImage"), updateEventsAndActivities);
router.delete('/events-and-activities/delete/:id', deleteEventsAndActivities);



module.exports = router;
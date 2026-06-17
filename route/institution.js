const express = require('express')
const router = express.Router()
const { createIntitution, getAllIntitutions, getIntitutionById, updateIntitution, deleteIntitution } = require('../controller/institution/institution')
const { createDeanMessage, getAllDeanMessages, getDeanMessageById, updateDeanMessage, deleteDeanMessage } = require('../controller/institution/deanMessage')
const { createInfrastructure, getInfrastructure, updateInfrastructure, deleteInfrastructure } = require('../controller/institution/infrastructure');
const { createGalleryAndResource, getAllGalleryAndResources, getGalleryAndResourceById, updateGalleryAndResource, deleteGalleryAndResource } = require('../controller/institution/galleryAndResource');
const { createInstituteStats, getAllInstituteStats, getInstituteStatsById, updateInstituteStatsById, deleteInstituteStatsById } = require('../controller/institution/instituteStats');
const { createEventsAndActivities, getAllEventsAndActivities, getEventsAndActivitiesById, updateEventsAndActivitiesById, deleteEventsAndActivitiesById, getRecentEventsAndActivities } = require('../controller/institution/eventsAndActivities');
const { createProgramme, getAllProgrammes, getProgrammeById, updateProgramme, deleteProgramme } = require('../controller/institution/programmes');
const upload = require('../middleware/multer');

// institution
router.post('/create', createIntitution)
router.get('/getall', getAllIntitutions)
router.get('/getone/:id', getIntitutionById)
router.put('/update/:id', updateIntitution)
router.delete('/delete/:id', deleteIntitution)

// dean message
router.post('/dean-message/create', upload.single('deanImage'), createDeanMessage)
router.get('/dean-message/getall', getAllDeanMessages)
router.get('/dean-message/getone/:id', getDeanMessageById)
router.put('/dean-message/update/:id', upload.single('deanImage'), updateDeanMessage)
router.delete('/dean-message/delete/:id', deleteDeanMessage)

// institution stats
router.post('/stats/create', createInstituteStats)
router.get('/stats/getall', getAllInstituteStats)
router.get('/stats/getone/:id', getInstituteStatsById)
router.put('/stats/update/:id', updateInstituteStatsById)
router.delete('/stats/delete/:id', deleteInstituteStatsById)

// infrastructure
router.post('/infrastructure/create', upload.single('infraImage'), createInfrastructure)
router.get('/infrastructure/getall', getInfrastructure)
router.put('/infrastructure/update/:id', upload.single('infraImage'), updateInfrastructure)
router.delete('/infrastructure/delete/:id', deleteInfrastructure)

// gallery and resource
router.post('/gallery-resource/create', upload.fields([{ name: 'galleryImage', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), createGalleryAndResource)
router.get('/gallery-resource/getall', getAllGalleryAndResources)
router.get('/gallery-resource/getone/:id', getGalleryAndResourceById)
router.put('/gallery-resource/update/:id', upload.fields([{ name: 'galleryImage', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), updateGalleryAndResource)
router.delete('/gallery-resource/delete/:id', deleteGalleryAndResource)

// events and activities
router.post('/events-and-activities/create', upload.array('eventImage'), createEventsAndActivities)
router.get('/events-and-activities/getall', getAllEventsAndActivities)
router.get('/events-and-activities/recent', getRecentEventsAndActivities)
router.get('/events-and-activities/getone/:id', getEventsAndActivitiesById)
router.put('/events-and-activities/update/:id', upload.array('eventImage'), updateEventsAndActivitiesById)
router.delete('/events-and-activities/delete/:id', deleteEventsAndActivitiesById)

// Programes Offered
router.post('/programmes/create', createProgramme)
router.get('/programmes/getall', getAllProgrammes)
router.get('/programmes/getone/:id', getProgrammeById)
router.put('/programmes/update/:id', updateProgramme)
router.delete('/programmes/delete/:id', deleteProgramme)

module.exports = router
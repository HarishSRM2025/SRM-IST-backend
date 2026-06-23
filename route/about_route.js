const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");

const {
    createAccreditation,
    getAllAccreditations,
    getAccreditationById,
    updateAccreditation,
    deleteAccreditation
} = require('../controller/about/accreditation');

const {
    createRanking,
    getAllRankings,
    getRankingById,
    updateRanking,
    deleteRanking
} = require('../controller/about/ranking');

const {
    createLeadership,
    getAllLeadership,
    getLeadershipById,
    updateLeadership,
    deleteLeadership
} = require('../controller/about/leadership');

// Accreditation
router.post('/accreditation/add', upload.single("image"), createAccreditation);
router.get('/accreditation/getall', getAllAccreditations);
router.get('/accreditation/get/:id', getAccreditationById);
router.put('/accreditation/update/:id', upload.single("image"), updateAccreditation);
router.delete('/accreditation/delete/:id', deleteAccreditation);

// Ranking
router.post('/ranking/add', createRanking);
router.get('/ranking/getall', getAllRankings);
router.get('/ranking/get/:id', getRankingById);
router.put('/ranking/update/:id', updateRanking);
router.delete('/ranking/delete/:id', deleteRanking);

// Leadership
// Shared across the "Leaders In Home", "Academic Heads", "Administrative Heads"
// and "Leadership Message" admin tabs via ?category= and ?displayInHome= query filters.
router.post('/leadership/add', upload.single("image"), createLeadership);
router.get('/leadership/getall', getAllLeadership);
router.get('/leadership/get/:id', getLeadershipById);
router.put('/leadership/update/:id', upload.single("image"), updateLeadership);
router.delete('/leadership/delete/:id', deleteLeadership);

module.exports = router;

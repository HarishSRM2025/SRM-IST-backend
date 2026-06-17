const mongoosh = require('mongoose');

const researchCenterSchema = new mongoosh.Schema({
    centerName: {
        type: String,
        required: true 
    },
    centerMission:{
        type: String,
    },
    centerRolesResponsibility: {
        type: String,
    },
    publicationAndProjectOutcomes: {
        type: String,
    },
    studentTrainingAndDevelopment: {
        type: String,
    }
});

module.exports = mongoosh.model('ResearchCenter', researchCenterSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['superadmin','admin','user','coordinator'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    mappingLevel: {
        type: String,
        enum: ['institute', 'school', 'division', null],
        default: null,
    },
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        default: null,
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        default: null,
    },
    divisionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolDivision',
        default: null,
    },
    lastLoginAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

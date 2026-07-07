const express = require('express')
// xcsdfsdf
// Database Connection
const connectDataBase = require('./config/connectDB')

// Route Imports
const institutionRoutes = require('./route/institution')
const schoolRoutes = require('./route/schools')
const facultyRoutes = require('./route/faculty')
const researchCenterRoutes = require('./route/research')
const schoolDivisionRoutes = require('./route/schoolDivision')
const sliderRoutes = require('./route/slider')
const aboutRoutes = require('./route/about_route')
const studentRoutes = require('./route/students')
const authRoutes = require('./route/auth')
const careersRoutes = require('./route/careers')

// Package Imports
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

connectDataBase();
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, 'public')))


app.use('/api/institution', institutionRoutes)
app.use('/api/schools', schoolRoutes)
app.use('/api/faculty', facultyRoutes)
app.use('/api/research', researchCenterRoutes)
app.use('/api/school-division', schoolDivisionRoutes)
app.use('/api/slider', sliderRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/careers', careersRoutes)

// Global Error Handler (e.g., for Multer file type or size limits)
app.use((err, req, res, next) => {
    if (err instanceof require('multer').MulterError) {
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    if (err) {
        return res.status(400).json({ success: false, message: err.message || 'An unexpected error occurred' });
    }
    next();
});



app.listen(4000, () => {
    console.log("loading on" + " http://localhost:3000")
})

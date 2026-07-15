const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const connectDataBase = () => {
    const dbUrl = process.env.DB_URL

    if (!dbUrl) {
        console.error('DB_URL is not defined. Check backend/.env')
        return
    }

    mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 10000 })
        .then(() => {
            console.log('Database Connected')
        })
        .catch((err) => {
            console.error('Error connecting to database:', err)
        })
}

module.exports = connectDataBase
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')

const envPaths = [
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
]

for (const envPath of envPaths) {
  dotenv.config({ path: envPath, override: false })
}

const connectDataBase = () => {
    const dbUrl = process.env.DB_URL

    if (!dbUrl) {
        console.error('DB_URL is not defined. Add it to backend/.env or the repo root .env')
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

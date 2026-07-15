const mongoose = require('mongoose')

const connectDataBase = ()=>{
    mongoose.connect(`${process.env.DB_URL}`)
    .then(()=>{
        console.log('Database Connected')
    })
    .catch((err)=>{
        console.error('Error connecting to database:', err)
    })
}

module.exports= connectDataBase
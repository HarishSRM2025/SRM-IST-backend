const mongoose = require('mongoose')

const connectDataBase = ()=>{
    mongoose.connect('mongodb+srv://webteam:webteam2025@cluster0.je6ss7h.mongodb.net/ist2025')
    .then(()=>{
        console.log('Database Connected')
    })
}

module.exports= connectDataBase
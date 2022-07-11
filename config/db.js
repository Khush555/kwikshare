const mongoose = require('mongoose')
require('dotenv').config();
function connectDB(){  
mongoose.connect(process.env.MONGO_CONNECTION_URL,(err)=>{
    if(!err)
    console.log('Database connected');
    else console.log('Connection Failed');
})
}
module.exports = connectDB;
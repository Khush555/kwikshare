const mongoose = require('mongoose')
require('dotenv').config();
function connectDB(){
mongoose.connect('mongodb+srv://Khush:Q2rPblDYED6Qnzve@cluster0.gedgs.mongodb.net/?retryWrites=true&w=majority',(err)=>{
    if(!err)
    console.log('Database connected');
    else console.log('Connection Failed');
})
}
module.exports = connectDB;
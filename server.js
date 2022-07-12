const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const connectDB= require('./config/db');
app.use(express.static('public'));
app.use(express.json());
connectDB();

//cors
const corsOptions = {
    origin: ["http://127.0.0.1:3000","https://khush555.github.io"]
    
}
app.use(cors(corsOptions));
//Template engine
app.set('views',path.join(__dirname, '/views'));
app.set('view engine','ejs');
//Routes initialise
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));
app.listen(PORT, console.log(`Listening on port ${PORT}.`));

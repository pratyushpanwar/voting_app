const mongoose =require('mongoose');
require('dotenv').config();

//MongoDB connection URL

const mongoURL = process.env.MONGODB_URL_LOCAL;
//const mongoURL = process.env.MONGODB_URL;

//setup mongoDB connection

//mongoose.connect(mongoURL)
mongoose.connect(mongoURL)

//get default connection

const db=mongoose.connection;

//event listner setup
db.on('connected', ()=>{
    console.log('connected to mongoDB server');
});

db.on('error', (err)=>{
    console.error('mongoDB connection Error:',err);
});

db.on('disconnected', () =>{
    console.log('mongoDB disconnected');
});

//exporting

module.exports= db; 
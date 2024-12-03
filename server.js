const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
// Middleware for parsing JSON
app.use(bodyParser.json()); // req.body 
const PORT = process.env.PORT || 3000;


// Import router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use routers
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);



// Start server

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
const awsIot = require("aws-iot-device-sdk");

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = 4000;

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,       
}
app.use(cors(corsOptions));



// API route Catchers
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        message: 'This is the backend test',
        port: PORT,
    });
});

app.get('/test', (req, res) => {
    res.json({ 
        message: 'Server is working!',
    });
});





// Api Catch-all safe
app.get('*', (req, res) => {
  res.json({
    message: 'Unknown API route',
    path: req.originalUrl,
    method: req.method
  });
});




server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 PLC server running on port ${PORT}`);
});

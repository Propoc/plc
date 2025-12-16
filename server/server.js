const awsIot = require("aws-iot-device-sdk");

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);


//EC2 de ngnix var 4000e fix anasını siksinler onun
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



// --------------------------------------------------
// SSE stream catch
// --------------------------------------------------
let clients = [];
const SUBSCRIPTIONS = ["tmsig-1/data"];

const generateUniqueId = () => {
    const now = new Date();
    // Format: YYYYMMDD
    const datePart = now.toISOString().substring(0, 10).replace(/-/g, ''); 
    // Format: HHMM
    const timePart = now.toTimeString().substring(0, 5).replace(/:/g, ''); 
    // Random 4-digit hex string
    const randomPart = Math.random().toString(16).substring(2, 6).toUpperCase(); 
    
    return `client-${datePart}-${timePart}-${randomPart}`;
};


app.get("/stream", (req, res) => {
  const topics = (req.query.topics || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);


  const clientId = generateUniqueId(); 

  res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
  });


  res.write(`: id: ${clientId} established\n\n`); 

  const client = { res, topics, id: clientId };
  clients.push(client);
  console.log(`🌐 SSE client connected: ID ${clientId} for topics:`, topics);

  req.on("close", () => {
      clients = clients.filter(c => c !== client);
      console.log(`❌ SSE client disconnected: ID ${clientId}`); 
  });
});

function broadcast(topic, json) {
  const payload = `data: ${JSON.stringify({
    topic,
    timestamp: Date.now(),
    data: json
  })}\n\n`;

  clients.forEach(client => {
    if (client.topics.includes(topic)) {
      client.res.write(payload);
    }
  });
}


// --------------------------------------------------
// AWS IOT
// --------------------------------------------------

const clientIdD = `pc-backend-1-${Date.now()}`;
const device = awsIot.device({
  keyPath: path.join(__dirname, "device-private.pem"),
  certPath: path.join(__dirname, "device-cert.pem"),
  caPath: path.join(__dirname, "AmazonRootCA1.pem"),
  clientId: clientIdD,
  host: "a33p897p55tbkg-ats.iot.eu-central-1.amazonaws.com",
  protocol: "mqtts",
  port: 8883
});

device.on("connect", () => {
  console.log("🟢 Connected to AWS IoT");
  SUBSCRIPTIONS.forEach(topic => {
    device.subscribe(topic);
    console.log("📡 Subscribed:", topic);
  });
});

device.on("message", (topic, payload) => {
  try {
    const json = JSON.parse(payload.toString());
    broadcast(topic, json);
  } catch {
    console.log("A Message recieved but JSON parsing went wrong");
  }
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

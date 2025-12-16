const awsIot = require("aws-iot-device-sdk");

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = 3456;

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,       
}
app.use(cors(corsOptions));

// Request logger (simplified)
app.use((req, res, next) => {
    if (!req.url.startsWith('/socket.io/')) {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    }
    next();
});

// Static file serving
app.use(express.static(path.join(__dirname, '../build')));

// API route
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        message: 'Card Game Server',
        port: PORT,
        socketio: 'enabled'
    });
});

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});


// --------------------------------------------------
// SSE CLIENTS
// --------------------------------------------------
let clients = [];
const SUBSCRIPTIONS = ["tmsig-1/data"];

// --------------------------------------------------
// SSE STREAM
// --------------------------------------------------
app.get("/stream", (req, res) => {
  const topics = (req.query.topics || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  const client = { res, topics };
  clients.push(client);

  console.log("🌐 SSE client connected:", topics);

  req.on("close", () => {
    clients = clients.filter(c => c !== client);
    console.log("❌ SSE client disconnected");
  });
});

// --------------------------------------------------
// BROADCAST
// --------------------------------------------------
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
const device = awsIot.device({
  keyPath: "./device-private.pem",
  certPath: "./device-cert.pem",
  caPath: "./AmazonRootCA1.pem",
  clientId: "pc-backend-1",
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
    console.log("❌ JSON parse error");
  }
});


// --------------------------------------------------
// START SERVER (IDENTICAL PATTERN)
// --------------------------------------------------
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 PLC server running on port ${PORT}`);
});

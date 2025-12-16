const awsIot = require("aws-iot-device-sdk");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let clients = []; // connected SSE clients: { res, topics[] }

// --------------------------------------------------
// 1. FIXED TOPIC SUBSCRIPTIONS
// --------------------------------------------------
const SUBSCRIPTIONS = [
  "tmsig-1/data",
];

// --------------------------------------------------
// SSE real-time stream
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
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
  });

  console.log("🌐 Client connected with topics:", topics);

  const client = { res, topics };
  clients.push(client);

  req.on("close", () => {
    console.log("❌ Client disconnected");
    clients = clients.filter(c => c !== client);
  });
});

// --------------------------------------------------
// Broadcast only to matching SSE clients
// --------------------------------------------------
function broadcast(topic, json) {
  const message = {
    topic,
    timestamp: Date.now(),
    data: json
  };

  const payload = `data: ${JSON.stringify(message)}\n\n`;

  clients.forEach(client => {
    if (client.topics.includes(topic)) {
      client.res.write(payload);
    }
  });
}

// --------------------------------------------------
// MQTT CONNECT
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
  console.log("🟢 Connected to AWS IoT!");

  // Subscribe to ALL topics in array
  SUBSCRIPTIONS.forEach(topic => {
    device.subscribe(topic);
    console.log("📡 Subscribed to:", topic);
  });
});

// --------------------------------------------------
// MQTT Message Handling
// --------------------------------------------------
device.on("message", (topic, payload) => {
  console.log(`\n📥 MQTT message from ${topic}:`, payload.toString());

  try {
    const json = JSON.parse(payload.toString());
    broadcast(topic, json);
    console.log(`✔ Broadcast to clients subscribed to ${topic}`);
  } catch (e) {
    console.log("❌ JSON parse error");
  }
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------
app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});

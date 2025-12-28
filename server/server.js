const awsIot = require("aws-iot-device-sdk");

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require("fs/promises");

const app = express();
const server = http.createServer(app);


// 0 dan yapıcaksan ngnixi kurup o defaulttan ekleme yapmak lazım 1 amplify dan domaini kabul ettirtmek için CNAME vericeksin + gitmesi gereken CNAME, rule yazıcaksın diğer www. için proxy gerekli
//Domain name registrar NS ten -> Clouldflare backendi EC2 deki VM e ordan nginx ordan kod , Frontend Clouldflare -> amplify
//ssh -i .\cardpair.pem ubuntu@63.179.188.199  vscodeu yönetici aç yoksa açmıyor

// git fetch origin main              (server update)
// git reset --hard origin/main 
// pm2 restart server.js   

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

app.post("/write", express.json(), async (req, res) => {
  try {
    const { address, value } = req.body;

    // frontend sends raw strings
    if (
      typeof address !== "string" ||
      typeof value !== "string" ||
      !/^\d+$/.test(address) ||
      !/^\d+$/.test(value)
    ) {
      return res.status(400).json({ error: "Invalid address or value" });
    }

    // EXACT content that will go into test.txt
    const content = `${address}/${value}/`;

    // ---- RAW LOGGING (before write) ----
    console.log("🧾 [RAW STRING]");
    console.log(content);


    const dir = "/srv/ftp/upload";
    const file = `${dir}/test.txt`;
    const tmp = `${file}.tmp`;

    // atomic write (PLC-safe)
    await fs.writeFile(tmp, content, "utf8");
    await fs.rename(tmp, file);

    console.log(`✍️ Wrote test.txt → ${content}`);

    res.json({ ok: true, content });
  } catch (err) {
    console.error("❌ Write failed:", err);
    res.status(500).json({ error: "Write failed" });
  }
});


let clients = [];
const activeTopicCounts = {}; // { "topicName": number_of_clients }

const generateUniqueId = () => {
    const now = new Date();
    const datePart = now.toISOString().substring(0, 10).replace(/-/g, ''); 
    const timePart = now.toTimeString().substring(0, 5).replace(/:/g, ''); 
    const randomPart = Math.random().toString(16).substring(2, 6).toUpperCase(); 
    
    return `client-${datePart}-${timePart}-${randomPart}`;
};

// Logic to manage AWS IoT Subscriptions dynamically
function handleNewSubscriptions(topics) {
    topics.forEach(topic => {
        if (!activeTopicCounts[topic]) {
            activeTopicCounts[topic] = 1;
            device.subscribe(topic);
            console.log(`📡 AWS Subscribed (New): ${topic}`);
        } else {
            activeTopicCounts[topic]++;
        }
    });
}

function handleRemovedSubscriptions(topics) {
    topics.forEach(topic => {
        if (activeTopicCounts[topic]) {
            activeTopicCounts[topic]--;
            if (activeTopicCounts[topic] === 0) {
                delete activeTopicCounts[topic];
                device.unsubscribe(topic);
                console.log(`🔕 AWS Unsubscribed (Idle): ${topic}`);
            }
        }
    });
}


// --------------------------------------------------
// SSE stream catch
// --------------------------------------------------

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
  handleNewSubscriptions(topics);

  req.on("close", () => {
      handleRemovedSubscriptions(client.topics);
      clients = clients.filter(c => c !== client);
      console.log(`❌ SSE client disconnected: ID ${clientId}`); 
  });
});

function broadcast(topic, json) {  // data: {"topic":"tmsig-1/data","timestamp":1766084012437,"data":{"T1":80}} 
  const payload = `data: ${JSON.stringify({
    timestamp: Date.now(),
    data: json
  })}\n\n`;
  clients.forEach(client => {
    if (client.topics.includes(topic)) {
      client.res.write(payload);
      console.log(`[SSE] Sent to Client #${client.id} | Topic: ${topic} | Payload: ${payload}`);
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
});

device.on("message", (topic, payload) => {
  try {
    const json = JSON.parse(payload.toString());
    broadcast(topic, json);
  } catch {
    console.log("⚠️ A Message recieved but JSON parsing went wrong");
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

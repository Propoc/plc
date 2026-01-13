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
// pm2 restart api 

//EC2 de ngnix var 4000e fix anasını siksinler onun
const PORT = 4000;

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));



// API route Catchers
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        message: 'This is the backend test',
        port: PORT,
    });
});


let clients = [];
const activeTopicCounts = {}; // { "topicName": number_of_clients }
const lastAlarmState = {};

const generateUniqueId = () => {
    const now = new Date();
    const datePart = now.toISOString().substring(0, 10).replace(/-/g, ''); 
    const timePart = now.toTimeString().substring(0, 5).replace(/:/g, ''); 
    const randomPart = Math.random().toString(16).substring(2, 6).toUpperCase(); 
    
    return `client-${datePart}-${timePart}-${randomPart}`;
};

// Logic to manage AWS IoT Subscriptions dynamically
function handleNewSubscription(topic) {
  if (!activeTopicCounts[topic]) {
    activeTopicCounts[topic] = 1;
    device.subscribe(topic);
    console.log(`📡 AWS Subscribed (New): ${topic}`);
  } else {
    activeTopicCounts[topic]++;
  }
}

function handleRemovedSubscription(topic) {
  if (activeTopicCounts[topic]) {
    activeTopicCounts[topic]--;

    if (activeTopicCounts[topic] === 0) {
      delete activeTopicCounts[topic];
      device.unsubscribe(topic);
      console.log(`🔕 AWS Unsubscribed (Idle): ${topic}`);
    }
  }
}


// --------------------------------------------------
// SSE stream catch
// --------------------------------------------------

app.get("/stream", (req, res) => {

  const topic = (req.query.topic)
  const clientId = generateUniqueId(); 

  res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
  });


  res.write(`: id: ${clientId} established\n\n`); 

  const client = { res, topic, id: clientId };
  clients.push(client);
  console.log(`🌐 SSE client connected: ID ${clientId} for topic:`, topic);
  handleNewSubscription(topic);

  alarmBroadcast(topic);


  req.on("close", () => {
      handleRemovedSubscription(client.topic);
      clients = clients.filter(c => c !== client);
      console.log(`❌ SSE client disconnected: ID ${clientId}`); 
  });
});


async function broadcast(topic, json) {
  const payload = `data: ${JSON.stringify({
    timestamp: Date.now(),
    data: json
  })}\n\n`;

  if (String(json.R1) === "1") {
    const baseTopic = topic.split("/")[0];
    console.log(`🧹 Executing reset-safe for topic: ${topic}`);
    await writePlcFile(baseTopic, "0/0/");
  }

  clients.forEach(client => {
    if (client.topic === topic) {
      client.res.write(payload);
      console.log(`[SSE]  Sent to Client #${client.id} | Topic: ${topic} | Payload: ${payload}`);
    }
  
  });

  await logAlarms(Date.now(), json, topic);
  await alarmBroadcast(topic);
}


async function logAlarms(timestamp, data, topic) {
  if (!data || typeof data !== "object") return;

  const parts = topic.replace(/^\/+/, "").split("/");
  const baseTopic = parts[0];
  const slave = parts[1];

  if (!lastAlarmState[baseTopic]) {
    lastAlarmState[baseTopic] = {};
  }
  const topicState = lastAlarmState[baseTopic];

  const triggeredAlarms = [];

  Object.keys(data).forEach(key => {
    if (!key.startsWith("A")) return;

    const current = Number(data[key]) === 1 ? 1 : 0;
    const previous = topicState[key] ?? 0;

    // EDGE: 0 -> 1
    if (current === 1 && previous === 0) {
      triggeredAlarms.push(key);
    }

    topicState[key] = current;
  });

  if (triggeredAlarms.length === 0) return;

  const logEntry = JSON.stringify({
    timestamp,
    slave,
    alarms: triggeredAlarms
  }) + "\n";

  const logPath = path.join(__dirname, `${baseTopic}_log.txt`);

  try {

    await fs.appendFile(logPath, logEntry);
  } catch (err) {
    console.error("[Alarm] Failed to write:", err);
  }
}


async function alarmBroadcast(topic) {

  const parts = topic.replace(/^\/+/, "").split("/");
  const baseTopic = parts[0];
  const slave = parts[1];

  const logPath = path.join(__dirname, `${baseTopic}_log.txt`);

  let fileContent;
  fileContent = await fs.readFile(logPath, "utf8");


  const alarms = fileContent
    .split("\n")
    .filter(Boolean)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(entry => entry && entry.slave === slave);
   
  const payload = `data: ${JSON.stringify({
    alarm: true,
    timestamp: Date.now(),
    alarms
  })}\n\n`;

  clients.forEach(client => {
    if (client.topic === topic) {
      client.res.write(payload);
      console.log(`[SSE] [Alarm] Sent to Client #${client.id} | Topic: ${topic} | Payload: ${payload}`);
    }
  });
}



app.post("/write", express.json(), async (req, res) => {
  try {
    const { address, value, topic } = req.body;

    const parts = topic.replace(/^\/+/, "").split("/");
    const baseTopic = parts[0];
    const slave = parts[1];

    // EXACT content that will go into test.txt
    const content = `${address}/${value}/${slave}/`;

    writePlcFile(baseTopic,content)
    res.json({file: `${baseTopic}.txt`, content });
    

  } catch (err) {
    console.error("❌ Write failed:", err);
    res.status(500).json({ error: err });
  }
});


app.post("/clear", express.json(), async (req, res) => {
  try {
    const { topic } = req.body;

    const parts = topic.replace(/^\/+/, "").split("/");
    const baseTopic = parts[0];
    const slave = parts[1];

    const logPath = path.join(__dirname, `${baseTopic}_log.txt`);

    let fileContent;
    fileContent = await fs.readFile(logPath, "utf8");

    const lines = fileContent.split("\n").filter(Boolean);

    let removed = 0;

    const kept = lines.filter(line => {
    try {
        const entry = JSON.parse(line);
        if (String(entry.slave) === String(slave)) {
          removed++;
          return false;
        }
        return true;

      } catch {
        return true;
      }
    });

    await fs.writeFile(
      logPath,
      kept.length ? kept.join("\n") + "\n" : ""
    );



    res.json({file: `${baseTopic}.txt`, slave, removed});

  } catch (err) {
    console.error("❌ Clear failed:", err);
    res.status(500).json({ error: err.message });
  }
});



async function writePlcFile(baseTopic, content) {
  const dir = "/srv/ftp/upload";
  const file = path.join(dir, `${baseTopic}.txt`);
  const tmp = `${file}.tmp`;

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(tmp, content, "utf8");
  await fs.rename(tmp, file);

  console.log(`✍️ Wrote ${baseTopic}.txt → ${content}`);
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
    console.log("⚠️ Message recieved but couldn't broadcast");
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

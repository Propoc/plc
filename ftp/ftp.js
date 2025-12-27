const FtpSrv = require('ftp-srv');

const ftpServer = new FtpSrv({
  // Setting port to 21 (Default FTP)
 url: 'ftp://0.0.0.0:2121',
  pasv_url: '192.168.1.5',
  anonymous: false,
  greeting: "PLC FTP Server Ready"
});

ftpServer.on('error', (err) => {
  console.error('❌ Server Error:', err.message);
});

ftpServer.on('client-connected', (connection) => {
  console.log('📡 CONNECTION DETECTED from', connection.ip);
  
  // This is the most important part for debugging the PLC
  connection.on('command', (command, args) => {
    console.log(`📥 PLC sent command: ${command} ${args ? args : ''}`);
  });
});

// Logic for USER 'plc' and PASS 'plc123'
ftpServer.on('login', ({ username, password, connection }, resolve, reject) => {
  console.log(`🔐 Login attempt: ${username}`);
  if (username === 'plc' && password === 'plc123') {
    resolve({ root: './ftp' }); // Ensure this folder exists!
  } else {
    reject(new Error('Invalid credentials'));
  }
});

ftpServer.listen().then(() => {
  console.log('🚀 Server is actively listening on 192.168.1.5');
});
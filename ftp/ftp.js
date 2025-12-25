const FtpSrv = require('ftp-srv');

const ftpServer = new FtpSrv({
  // Use the actual IP of your computer instead of 0.0.0.0 to force binding
  url: 'ftp://192.168.1.5:2121', 
  pasv_url: '192.168.1.5',
  anonymous: false,
  greeting: "PLC FTP Server Ready"
});

// Add an 'error' listener to see if the server itself is failing
ftpServer.on('error', (err) => {
  console.error('❌ Server Error:', err.message);
});

ftpServer.on('client-connected', (connection) => {
  console.log('📡 CONNECTION DETECTED from', connection.ip);
  
  // Log every command the PLC sends (like USER, PASS, SYST)
  connection.on('command', (command, args) => {
    console.log(`📥 PLC sent command: ${command} ${args ? args : ''}`);
  });
});

// ... (keep your login logic the same)

ftpServer.listen().then(() => {
  console.log('🚀 Server is actively listening on 192.168.1.5:21');
});
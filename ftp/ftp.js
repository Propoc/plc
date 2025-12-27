const FtpSrv = require('ftp-srv');
const fs = require('fs');

const ftpServer = new FtpSrv({
  // Use 0.0.0.0 to listen on all interfaces
  url: 'ftps://0.0.0.0:990', 

  pasv_url: '63.179.188.199', 
  pasv_min: 10000,
  pasv_max: 10005,
  tls: {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  }
});

ftpServer.on('client-connected', ({connection}) => {
  console.log('Client connected from:', connection.ip);
  // You can send a custom message before they even try to log in
  connection.reply(220, 'Anain amiha qoyayim');
});

// Auto-resolve every login attempt (No actual password check)
ftpServer.on('login', (data, resolve) => {
  console.log(`Login attempted by: ${data.username}`);
  resolve({ root: './public' }); // Points to an empty folder
});

ftpServer.listen().then(() => {
  console.log('FTPS Server is running on port 990');
});
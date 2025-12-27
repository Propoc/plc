const FtpSrv = require('ftp-srv');
const fs = require('fs');

const ftpServer = new FtpSrv({
  // Use 0.0.0.0 to listen on all interfaces
  url: 'ftps://0.0.0.0:21', 

  pasv_url: '63.179.188.199', 
  pasv_min: 10000,
  pasv_max: 10005,

  anonymous: true 
});

ftpServer.on('client-connected', ({connection}) => {
  console.log('Client connected from:', connection.ip);
  connection.reply(220, 'Helloooo');
});


ftpServer.on('login', (data, resolve) => {
  console.log(`Login attempted by: ${data.username}`);
  resolve({ root: './public' }); 
});

ftpServer.listen().then(() => {
  console.log('FTPS Server is running on port 21');
})

ftpServer.on('error', (err) => {
  console.error('Server Error:', err);
});
const forge = require('node-forge');
const fs = require('fs');

console.log('Generating 2048-bit RSA key pair...');
const keys = forge.pki.rsa.generateKeyPair(2048);
const cert = forge.pki.createCertificate();

cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
  name: 'commonName',
  value: '192.168.1.5'
}, {
  name: 'organizationName',
  value: 'PLC_Server'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

// Convert to PEM format
const pemKey = forge.pki.privateKeyToPem(keys.privateKey);
const pemCert = forge.pki.certificateToPem(cert);

try {
    fs.writeFileSync('./key.pem', pemKey);
    fs.writeFileSync('./cert.pem', pemCert);
    console.log('✅ Success! key.pem and cert.pem created.');
} catch (err) {
    console.error('❌ File System Error:', err.message);
}
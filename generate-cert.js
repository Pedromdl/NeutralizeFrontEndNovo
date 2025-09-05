import selfsigned from 'selfsigned';
import fs from 'fs';

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

fs.writeFileSync('localhost-cert.pem', pems.cert);
fs.writeFileSync('localhost-key.pem', pems.private);

console.log('✅ Certificado HTTPS gerado: localhost-cert.pem + localhost-key.pem');

// getRenderIp.js
const dns = require('dns');
const os = require('os');

dns.lookup(os.hostname(), (err, address, family) => {
  if (err) {
    console.error('Erro ao obter IP:', err.message);
    process.exit(1);
  }

  console.log('🌍 IP público detectado (Render):', address);
  console.log('📘 Adicione esse IP no Mongo Atlas > Network Access');
  process.exit(0);
});

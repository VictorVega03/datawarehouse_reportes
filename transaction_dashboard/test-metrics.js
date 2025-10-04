// Script simple para probar endpoint de métricas
const http = require('http');

console.log('🧪 Probando /api/v1/dashboard/metrics...\n');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/dashboard/metrics',
  method: 'GET',
  timeout: 10000 // 10 segundos
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
});

req.on('timeout', () => {
  console.error('❌ Request timeout after 10 seconds');
  req.destroy();
});

req.end();

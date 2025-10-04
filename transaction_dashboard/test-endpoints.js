// Test script to verify backend endpoints
const http = require('http');

const endpoints = [
  '/health',
  '/api/v1/dashboard/metrics',
  '/api/v1/dashboard/overview',
  '/api/v1/dashboard/test',
  '/api/v1/casos/horarios/metrics',
  '/api/v1/casos/horarios/analysis',
  '/api/v1/casos/horarios/test'
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: endpoint,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            endpoint,
            status: res.statusCode,
            success: true,
            data: parsed
          });
        } catch (error) {
          resolve({
            endpoint,
            status: res.statusCode,
            success: false,
            error: 'Failed to parse JSON',
            rawData: data.substring(0, 500) // Limit output
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint,
        success: false,
        error: error.message,
        errorCode: error.code
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        endpoint,
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing Backend Endpoints...\n');
  console.log('Backend URL: http://localhost:3001\n');
  console.log('='.repeat(100));
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    
    console.log(`\n📍 Endpoint: ${endpoint}`);
    console.log(`Status: ${result.status || 'ERROR'}`);
    console.log(`Success: ${result.success ? '✅' : '❌'}`);
    
    if (result.success && result.data) {
      console.log('Response Structure:');
      console.log(`  - Has 'success': ${result.data.hasOwnProperty('success')}`);
      console.log(`  - Has 'data': ${result.data.hasOwnProperty('data')}`);
      console.log(`  - Has 'message': ${result.data.hasOwnProperty('message')}`);
      console.log(`  - Has 'timestamp': ${result.data.hasOwnProperty('timestamp')}`);
      
      if (result.data.data) {
        console.log('\nData Content:');
        const dataKeys = Object.keys(result.data.data);
        console.log(`  - Keys: ${dataKeys.join(', ')}`);
        
        // Show first 3 keys with their values
        dataKeys.slice(0, 3).forEach(key => {
          const value = result.data.data[key];
          if (typeof value === 'object' && value !== null) {
            console.log(`  - ${key}: {${Object.keys(value).join(', ')}}`);
          } else {
            console.log(`  - ${key}: ${JSON.stringify(value).substring(0, 50)}`);
          }
        });
        
        if (dataKeys.length > 3) {
          console.log(`  ... and ${dataKeys.length - 3} more keys`);
        }
      }
      
      console.log('\nFull Response Preview:');
      console.log(JSON.stringify(result.data, null, 2).substring(0, 800));
      
    } else if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      if (result.errorCode) {
        console.log(`   Error Code: ${result.errorCode}`);
      }
      if (result.rawData) {
        console.log(`   Raw Data: ${result.rawData}`);
      }
    }
    
    console.log('-'.repeat(100));
  }
  
  console.log('\n✅ Testing complete!\n');
  
  // Summary
  console.log('📊 SUMMARY:');
  const results = await Promise.all(endpoints.map(ep => testEndpoint(ep)));
  const successful = results.filter(r => r.success && r.status === 200).length;
  const failed = results.length - successful;
  
  console.log(`   ✅ Successful: ${successful}/${results.length}`);
  console.log(`   ❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Failed Endpoints:');
    results.filter(r => !r.success || r.status !== 200).forEach(r => {
      console.log(`   - ${r.endpoint}: ${r.error || `Status ${r.status}`}`);
    });
  }
}

testAllEndpoints().catch(console.error);

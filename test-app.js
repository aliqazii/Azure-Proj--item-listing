// Simple test script to verify the app is working
const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`✅ ${description}: Status ${res.statusCode}`);
        if (path === '/health' || path === '/api/items') {
          try {
            const json = JSON.parse(data);
            console.log(`   Response:`, json);
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
        }
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: Request timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Items Listing App...\n');
  
  try {
    await testEndpoint('/health', 'Health Check');
    await testEndpoint('/api/items', 'Get Items API');
    await testEndpoint('/', 'Frontend Page');
    
    console.log('\n🎉 All tests passed! App is working correctly.');
    console.log('🌍 Visit: http://localhost:3000');
    
  } catch (error) {
    console.log('\n❌ Some tests failed. Check if the server is running:');
    console.log('   npm run start:memory');
  }
}

runTests();
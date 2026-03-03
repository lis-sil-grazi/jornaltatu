#!/usr/bin/env node

/**
 * Integration Test: Jornal Tatu Full Stack
 * Tests: Frontend serving + Backend API + Data fetching
 */

const http = require('http');

const tests = [
  {
    name: 'Frontend Health (index.html)',
    host: 'localhost',
    port: 8080,
    path: '/',
    expectedStatus: 200
  },
  {
    name: 'Backend Health',
    host: 'localhost',
    port: 3001,
    path: '/api/health',
    expectedStatus: 200
  },
  {
    name: 'Bitcoin News Feed',
    host: 'localhost',
    port: 3001,
    path: '/api/news/category/bitcoin?limit=3',
    expectedStatus: 200,
    expectedContent: 'Bitcoin'
  },
  {
    name: 'Guerras News Feed',
    host: 'localhost',
    port: 3001,
    path: '/api/news/category/Guerras?limit=2',
    expectedStatus: 200,
    expectedContent: 'Guerras'
  },
  {
    name: 'Política Brasileira Feed',
    host: 'localhost',
    port: 3001,
    path: '/api/news/category/Política%20Brasileira?limit=2',
    expectedStatus: 200,
    expectedContent: 'Política Brasileira'
  }
];

let passed = 0;
let failed = 0;

function runTest(test) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: test.host,
      port: test.port,
      path: test.path,
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === test.expectedStatus &&
          (!test.expectedContent || data.includes(test.expectedContent));
        
        if (success) {
          console.log(`✅ ${test.name}`);
          passed++;
        } else {
          console.log(`❌ ${test.name}`);
          console.log(`   Status: ${res.statusCode} (expected ${test.expectedStatus})`);
          if (test.expectedContent && !data.includes(test.expectedContent)) {
            console.log(`   Missing content: "${test.expectedContent}"`);
          }
          failed++;
        }
        resolve();
      });
    });

    req.on('error', err => {
      console.log(`❌ ${test.name} - Connection error`);
      console.log(`   ${err.message}`);
      failed++;
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`❌ ${test.name} - Timeout`);
      failed++;
      resolve();
    });
  });
}

async function runAllTests() {
  console.log('\n🧪 JORNAL TATU - INTEGRATION TESTS\n');
  
  for (const test of tests) {
    await runTest(test);
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('✅ All systems operational! Site ready for production.\n');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Check backend/frontend status.\n');
    process.exit(1);
  }
}

runAllTests();

// Quick API test script
const axios = require('axios');

async function test() {
  try {
    console.log('Testing /api/health...');
    const health = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check passed:', JSON.stringify(health.data, null, 2));
    
    console.log('\nTesting /api/categories...');
    const categories = await axios.get('http://localhost:3001/api/categories');
    console.log('✅ Categories:', JSON.stringify(categories.data, null, 2));
    
    console.log('\nTesting /api/news/category/Bitcoin...');
    const bitcoin = await axios.get('http://localhost:3001/api/news/category/Bitcoin');
    console.log(`✅ Bitcoin news: ${bitcoin.data.count} articles found`);
    
    if (bitcoin.data.count === 0) {
      console.log('\n🔄 No articles yet. Triggering refresh...');
      const refresh = await axios.post('http://localhost:3001/api/news/refresh');
      console.log('✅ Refresh completed:', JSON.stringify(refresh.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

test();

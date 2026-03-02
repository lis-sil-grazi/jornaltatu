const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('Health endpoint hit!');
  res.json({ status: 'ok', message: 'Simple server working' });
});

app.listen(PORT, () => {
  console.log(`Simple test server running on http://localhost:${PORT}`);
  console.log('Try: http://localhost:3002/api/health');
});

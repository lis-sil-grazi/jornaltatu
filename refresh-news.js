const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/news/refresh',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n✅ Jornal Tatu atualizado com sucesso!\n');
    console.log(JSON.parse(data));
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('❌ Erro ao conectar ao servidor:', error.message);
  console.log('Aguardando o backend subir...');
  process.exit(1);
});

req.end();

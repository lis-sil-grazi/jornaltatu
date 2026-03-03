#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, 'backend', '.env');

console.log('\n🔑 Configurador de API Keys - Jornal Tatu\n');
console.log('1. Pega sua API key em: https://newsapi.org/account');
console.log('2. (Opcional) Pega sua Brave Search key em: https://brave.com/search/api/\n');

rl.question('Cole sua NewsAPI key (ou deixa em branco para pular): ', (newsapiKey) => {
  rl.question('Cole sua Brave Search key (ou deixa em branco para pular): ', (braveKey) => {
    rl.close();

    let content = fs.readFileSync(envPath, 'utf-8');

    if (newsapiKey.trim()) {
      content = content.replace(
        /NEWSAPI_KEY=.*/,
        `NEWSAPI_KEY=${newsapiKey.trim()}`
      );
      console.log('✅ NewsAPI key atualizada');
    }

    if (braveKey.trim()) {
      content = content.replace(
        /BRAVE_API_KEY=.*/,
        `BRAVE_API_KEY=${braveKey.trim()}`
      );
      console.log('✅ Brave Search key atualizada');
    }

    fs.writeFileSync(envPath, content);
    console.log('\n📝 .env atualizado com sucesso!');
    console.log('⚠️  Agora reinicia o backend: npm start\n');
  });
});

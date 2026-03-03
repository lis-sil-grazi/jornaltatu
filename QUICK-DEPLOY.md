# 🚀 Deploy Jornal Tatu em 1 Clique

## Opção 1: Deploy Automático (Render) — RECOMENDADO

**Clica o botão abaixo:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/lis-sil-grazi/jornaltatu)

**O que acontece:**
1. Abre Render.com
2. Conecta com GitHub (autoriza 1x)
3. Seleciona o repo `jornaltatu`
4. Clica "Deploy"
5. Render faz tudo (build, setup, start)
6. Em ~2min está live

**Depois:**
1. Copia a URL que Render te deu (ex: `https://jornal-tatu-backend-xxxxx.render.com`)
2. Edita `index.html`, linha ~400:
   ```javascript
   const API_BASE = 'https://jornal-tatu-backend-xxxxx.render.com/api/news';
   ```
3. Faz push para GitHub
4. GitHub Pages auto-atualiza o frontend

---

## Opção 2: Deploy Manual via Railway

1. **Vai em**: https://railway.app/new/github
2. **Conecta GitHub** (autoriza)
3. **Seleciona repo**: `lis-sil-grazi/jornaltatu`
4. **Configure:**
   - Root directory: `backend/`
   - Environment: Node.js
   - Build: `npm install`
   - Start: `node server.js`
5. **Add variables:**
   - `NEWSAPI_KEY`: `74ab4b21814447f186c40bd848b28798`
   - `BRAVE_API_KEY`: `demo_key`
   - `NODE_ENV`: `production`
6. **Deploy**
7. **Copia URL gerada**
8. **Edita `index.html`** com URL de Railway
9. **Push para GitHub** — Frontend auto-atualiza

---

## Verificação Pós-Deploy

```bash
# Testa se backend está live
curl https://seu-url-deployment.com/api/health

# Testa se frontend consegue buscar notícias
# Vai em https://jornaltatu.com e testa as 5 categorias
```

## Troubleshooting

**API retorna 404 ou "endpoint not found"**
- Reinicia o serviço no Render/Railway dashboard
- Espera 30s, tenta novamente

**Frontend não carrega notícias**
- Verifica `index.html` — API_BASE está correto?
- Abre browser DevTools → Console, vê se há CORS error
- Se tiver CORS error, backend precisa de CORS headers (already configured)

**Notícias sem imagens**
- É normal, Brave Search às vezes não retorna URLs de imagem
- Dados estão chegando, é só visual

---

**Status**: ✅ Pronto para deploy
**Tempo estimado**: 5 minutos (start to finish)
**Suporte**: Silvia tem acesso direto aos repos no GitHub

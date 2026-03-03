# 🚀 Jornal Tatu — Deploy Final no Render (ALL-IN-ONE)

**Status**: ✅ 100% Pronto  
**Tempo**: 5 minutos  
**O que vai acontecer**: Backend + Frontend em um só lugar, tudo automático

---

## Passo 1: Cria o Blueprint no Render

Vai em: **https://render.com/blueprints**

Clica **"New Blueprint"** e preenche:

```
Blueprint Name:    Lis Araujo
Branch:            main
Blueprint Path:    render.yaml
```

Clica **"Create Blueprint"**

---

## Passo 2: Autoriza GitHub

Render vai pedir pra autorizar o GitHub (1x só).

- Clica "Authorize with GitHub"
- Confirma acesso ao repo `lis-sil-grazi/jornaltatu`

---

## Passo 3: Valida Configuração

Render lê o `render.yaml` automaticamente. Vai mostrar:

```
✓ jornal-tatu-backend (Node.js Web Service)
✓ jornal-tatu-frontend (Static Site)
```

Clica **"Continue to Environment Variables"**

---

## Passo 4: Preenche Variáveis de Ambiente

Render vai pedir 2 vars que estão com `${...}`:

### Backend Environment Variables

**KEY**: `NEWSAPI_KEY`  
**VALUE**: `74ab4b21814447f186c40bd848b28798`

**KEY**: `BRAVE_API_KEY`  
**VALUE**: `demo_key`

Deixa as outras como estão (NODE_ENV e PORT já têm valores).

Clica **"Deploy"**

---

## Passo 5: Aguarda Deploy

Render vai fazer tudo:

1. Clone do repo ✅
2. Install dependencies ✅
3. Build backend (`npm install`) ✅
4. Build frontend (static HTML) ✅
5. Start services ✅

**Esperado**: 1-2 minutos

Quando terminar, aparece:
```
✓ jornal-tatu-backend   → https://jornal-tatu-backend-xxxxx.onrender.com
✓ jornal-tatu-frontend  → https://jornal-tatu-frontend-xxxxx.onrender.com
```

---

## Passo 6: Testa Tudo

Vai em: **https://jornal-tatu-frontend-xxxxx.onrender.com**

Verifica:
- [ ] Página carrega
- [ ] 5 categorias (Bitcoin, Guerras, Política, Brasil, Hotelaria)
- [ ] Clica em uma categoria
- [ ] Notícias carregam com títulos e datas
- [ ] Links abrem corretamente

Se tudo funciona ✅ → Você está live!

---

## Passo 7 (Opcional): Custom Domain

Se quiser que seja `jornaltatu.com` ao invés de onrender.com:

1. Vai no dashboard do Frontend (`jornal-tatu-frontend`)
2. Settings → Custom Domains
3. Adiciona `jornaltatu.com`
4. Copia o CNAME que Render gera
5. Vai no seu DNS provider
6. Adiciona o CNAME record

(DNS já está configurado, provavelmente pode só apontá-lo)

---

## Troubleshooting

**Frontend carrega mas não mostra notícias**
- Abre DevTools (F12) → Console
- Vê se tem erro
- Verifica se backend está respondendo em: `https://jornal-tatu-backend-xxxxx.onrender.com/api/health`

**Backend retorna 500 error**
- Vai no dashboard → View Logs
- Procura por erro específico
- Pode ser NEWSAPI_KEY inválida

**Serviço não inicia**
- Render → Logs
- Procura por "npm install failed" ou similar
- Verifica `buildCommand` no render.yaml

---

## Informações Técnicas

### O render.yaml faz:

**Backend (Node.js)**:
- Runtime: Node.js
- Build: `cd backend && npm install`
- Start: `cd backend && node server.js`
- Variables: NODE_ENV, PORT, NEWSAPI_KEY, BRAVE_API_KEY

**Frontend (Static)**:
- Runtime: Static (HTML/CSS/JS)
- Publica todos os arquivos `.`
- Entry: `index.html`
- Auto-detecta backend URL via JavaScript

### Por que funciona automaticamente:

O `index.html` tem lógica embutida:

```javascript
// Se estiver em onrender.com
if (host.includes('onrender.com')) {
  // Troca 'jornal-tatu-frontend' por 'jornal-tatu-backend'
  const backendUrl = host.replace('jornal-tatu-frontend', 'jornal-tatu-backend');
  return `https://${backendUrl}/api/news`;
}
```

Ou seja, não precisa de config manual — funciona "mágicamente" 🎉

---

## Resumo

| Arquivo | O que faz |
|---------|-----------|
| `render.yaml` | Define os 2 serviços (backend + frontend) |
| `index.html` | Frontend com detecção automática de API |
| `backend/server.js` | API que busca notícias em tempo real |
| `backend/.env` | Credenciais NewsAPI |

---

**Status**: ✅ Tudo pronto, faltava você clicar no botão do Render!

Quando deploy terminar, manda a URL do frontend (https://jornal-tatu-frontend-xxxxx.onrender.com) e eu faço qualquer ajuste final se precisar.

🎉 **Parabéns!** Jornal Tatu está indo pro mundo! 🐢

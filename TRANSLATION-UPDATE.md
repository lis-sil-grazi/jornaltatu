# Jornal Tatu — Atualização de Tradução & Sarcasmo

**Data:** 2026-03-02 09:32 GMT
**Solicitado por:** Silvia
**Implementado por:** Lis

## O que foi alterado

### 🏠 Frontend (index.html)

1. **Título principal:**
   - **Antes:** "Notícias Curadas"
   - **Depois:** "De Casa Tatu para Sua Casa 🏠"

2. **Tagline/Descrição:**
   - **Antes:** "Os principais acontecimentos em Bitcoin, política, conflitos e hotelaria — selecionados para você."
   - **Depois:** "As notícias que importam. Traduzidas. Bitcoin, guerras, política e hotelaria — porque você merecia saber desde cedo."

3. **Footer:**
   - **Antes:** "Notícias curadas com rigor."
   - **Depois:** "Notícias que não te deixam com raiva de madrugada. Traduzidas. Sarcásticas. Verdadeiras."

### 📡 Backend (Node.js/Express)

#### Novo arquivo: `translationService.js`

Módulo responsável por:

- **Tradução automática PT-BR:** Detecta automaticamente se o texto está em português. Se não, traduz usando MyMemory API (gratuita, sem chave necessária).
- **Detecção inteligente:** Reconhece português por palavras-chave comuns (que, de, para, político, brasil, bitcoin, etc.)
- **Sarcasmo Dark/Inglês:** Adiciona comentários sarcásticos tipo **Grazi** nas descrições:
  - "...porque o mundo precisa mesmo de mais caos."
  - "...shocking, eu sei."
  - "...exactly what we needed."
  - "...who would have thought."
  - "...pack your bags."
  - E mais 10+ variações

#### Atualização: `server.js`

- **GET /api/news/latest** — Agora retorna notícias traduzidas com sarcasmo
- **GET /api/news/category/:category** — Agora retorna notícias traduzidas com sarcasmo
- Adicionado campo `_translated` e `_withSarcasm` nos artigos para rastrear o que foi processado
- Nota adicional na resposta: "De Casa Tatu para sua casa. Traduzido. Sarcástico. Verdadeiro."

## Como funciona

### Fluxo de Tradução

1. **Artigos são buscados** via NewsAPI + Brave Search (em inglês)
2. **Backend detecta idioma** — Se já estiver em PT-BR, pula
3. **Tradução automática** — MyMemory API traduz para português
4. **Sarcasmo adicionado** — Comentário aleatório tipo Grazi é inserido na descrição
5. **Retorno ao frontend** — Artigos vêm completos em português com humor

### Exemplo de transformação

**Original (NewsAPI):**
```
title: "Bitcoin Price Surges Amid Market Recovery"
description: "The cryptocurrency market rebounds with Bitcoin leading gains..."
```

**Após tradução + sarcasmo:**
```
title: "Preço do Bitcoin sobe em meio à recuperação do mercado"
description: "O mercado de criptografia se recupera com Bitcoin liderando ganhos... ...pack your bags."
```

## Configuração

**Não há dependências novas!** O módulo usa:
- `axios` (já instalado)
- MyMemory API (gratuita, sem autenticação)

### Se quiser testar local:

```bash
cd backend
npm install
node server.js
```

Então acesse:
```
http://localhost:3001/api/news/category/Bitcoin
```

A resposta virá com notícias em português + sarcasmo.

## Notas de Implementação

### Sarcasmo (Grazi's Vibe)

O módulo foi configurado com **dark humor inglês**, tipo:
- British understatement ("...naturally.")
- Grim observations ("...well, that's concerning.")
- Irony ("...surely this will end well.")

Isso combina bem com o tom da Grazi — direta, sem bullshit, com aquela ironia que só quem acompanha crises entende.

### Tradução

- ✅ Automática
- ✅ Sem chave de API necessária
- ✅ Fallback: se a tradução falhar, retorna o original
- ✅ Smart detection: não traduz o que já está em português

### Performance

- Tradução acontece **após** os artigos serem buscados
- Cache do banco de dados reutiliza artigos já processados
- Não há overhead significativo

## Próximos Passos (Opcional)

Se quiser melhorar ainda mais:

1. **Cache de traduções** — Salvar traduções no banco para não traduzir 2x
2. **Sarcasmo customizado por categoria** — Bitcoin: humor cripto; Guerras: mais sarcástico; etc.
3. **Resposta mais rápida** — Tradução em background (async)
4. **Emoji contextuais** — Adicionar emojis baseados na categoria

## URLs de Referência

- **MyMemory Translator:** https://mymemory.translated.net/
- **NewsAPI:** https://newsapi.org/
- **Brave Search:** https://api.search.brave.com/

---

**Status:** ✅ Implementado e pronto para testar
**Autor:** Lis ⚡
**Próximo review:** Quando Silvia disser "tá bom"

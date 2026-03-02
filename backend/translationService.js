const axios = require('axios');

/**
 * Sarcastic comments in English dark humor style (for Grazi's vibe)
 */
const SARCASTIC_QUOTES = [
  '...porque o mundo precisa mesmo de mais caos.',
  '...porque ninguém viu isso vindo.',
  '...shocking, eu sei.',
  '...exactly what we needed.',
  '...como se as coisas pudessem ficar piores.',
  '...groundbreaking.',
  '...who would have thought.',
  '...surely this will end well.',
  '...that\'s not a red flag at all.',
  '...pack your bags.',
  '...naturally.',
  '...because why not.',
  '...another day in paradise.',
  '...well, that\'s concerning.',
  '...surely this will not backfire.',
];

/**
 * Detects if text is likely in Portuguese
 */
function isProbablyPortuguese(text) {
  if (!text) return false;
  
  const ptCommonWords = [
    'que', 'de', 'para', 'é', 'em', 'não', 'por', 'uma', 'com', 'se',
    'seu', 'sua', 'seus', 'suas', 'ele', 'ela', 'eles', 'elas',
    'nos', 'nos', 'vou', 'vai', 'vamos', 'podem', 'pode',
    'será', 'seria', 'foi', 'foram', 'fomos', 'fui',
    'apenas', 'também', 'mesmo', 'muito', 'já', 'ainda',
    'presidente', 'congresso', 'senador', 'brasil', 'brasileiro',
    'bitcoin', 'criptmoeda', 'guerra', 'conflito', 'política',
    'hotel', 'turismo', 'hotelaria', 'hóspede', 'hospedagem'
  ];
  
  const lowerText = text.toLowerCase();
  const matches = ptCommonWords.filter(word => lowerText.includes(word)).length;
  
  return matches >= 2;
}

/**
 * Translate text to Portuguese using Google Translate API (free)
 * Falls back to simple translation if API fails
 */
async function translateToPortuguese(text) {
  if (!text) return '';
  if (isProbablyPortuguese(text)) return text;

  try {
    // Using Google Translate free endpoint (no key required)
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit&client=gtx`;
    
    // Simple fetch with a workaround URL
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|pt`,
      { timeout: 5000 }
    );

    if (response.data?.responseData?.translatedText) {
      return response.data.responseData.translatedText;
    }

    return text; // Return original if translation fails
  } catch (error) {
    console.warn('[Translation] Error translating:', error.message);
    return text; // Return original text if API fails
  }
}

/**
 * Add a sarcastic comment to the description
 */
function addSarcasm(description) {
  if (!description) return '';
  
  const randomSarcasm = SARCASTIC_QUOTES[
    Math.floor(Math.random() * SARCASTIC_QUOTES.length)
  ];
  
  // Clean description and add sarcasm
  const cleaned = description.trim();
  return cleaned.endsWith('.') 
    ? `${cleaned} ${randomSarcasm}`
    : `${cleaned}. ${randomSarcasm}`;
}

/**
 * Process articles: translate to Portuguese + add sarcasm
 */
async function processArticles(articles) {
  if (!Array.isArray(articles)) return articles;

  const processed = [];

  for (const article of articles) {
    try {
      // Translate title
      const translatedTitle = await translateToPortuguese(article.title);
      
      // Translate description and add sarcasm
      let translatedDescription = await translateToPortuguese(article.description || '');
      if (translatedDescription) {
        translatedDescription = addSarcasm(translatedDescription);
      }

      processed.push({
        ...article,
        title: translatedTitle || article.title,
        description: translatedDescription || article.description,
        _translated: true,
        _withSarcasm: !!translatedDescription
      });
    } catch (error) {
      console.error('[Translation] Error processing article:', error.message);
      // Return original article if processing fails
      processed.push(article);
    }
  }

  return processed;
}

module.exports = {
  translateToPortuguese,
  addSarcasm,
  processArticles,
  isProbablyPortuguese
};

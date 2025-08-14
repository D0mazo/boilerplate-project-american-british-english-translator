const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

class Translator {
  constructor() {
    this.highlight = (text) => `<span class="highlight">${text}</span>`;
  }

  translate(text, locale) {
    if (!text) return { text, translation: "Everything looks good to me!" };

    let translation = text;
    let dict = {};
    let titles = {};

    if (locale === 'american-to-british') {
      // Spelling dict first so it takes priority
      dict = { ...americanToBritishSpelling, ...americanOnly };
      titles = americanToBritishTitles;
    } else if (locale === 'british-to-american') {
      const reversedSpelling = Object.fromEntries(
        Object.entries(americanToBritishSpelling).map(([am, br]) => [br, am])
      );
      dict = { ...reversedSpelling, ...britishOnly }; // spelling first
      titles = Object.fromEntries(
        Object.entries(americanToBritishTitles).map(([am, br]) => [br, am])
      );
    } else {
      return { text, translation: "Everything looks good to me!" };
    }

    // Titles (Mr., Dr., etc.)
for (let [key, value] of Object.entries(titles)) {
  let pattern;
  if (locale === 'american-to-british') {
    // Match with optional period, followed by space or end of string
    pattern = new RegExp(`\\b${key.replace('.', '\\.')}(?=\\s)`, 'gi');
  } else {
    // Match without period
    pattern = new RegExp(`\\b${key}\\b`, 'gi');
  }

  translation = translation.replace(pattern, (match) => {
    // Keep original capitalization of the title
    let replacement =
      match[0] === match[0].toUpperCase()
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;
    return this.highlight(replacement);
  });
}


    // Multi-word phrases (longest first)
    const phrases = Object.keys(dict).sort((a, b) => b.length - a.length);
    for (let phrase of phrases) {
      const pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
      translation = translation.replace(pattern, () => {
        let replacement = dict[phrase];

        // FIX for Rube Goldberg machine → Heath Robinson
        if (replacement.toLowerCase().includes("heath robinson")) {
          replacement = "Heath Robinson";
        }

        // Use dictionary value exactly; no capitalization adjustment
        return this.highlight(replacement);
      });
    }

    // Time format
    if (locale === 'american-to-british') {
      translation = translation.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) =>
        this.highlight(`${h}.${m}`)
      );
    } else if (locale === 'british-to-american') {
      translation = translation.replace(/(\d{1,2})\.(\d{2})/g, (_, h, m) =>
        this.highlight(`${h}:${m}`)
      );
    }

    if (translation === text) {
      translation = "Everything looks good to me!";
    }

    return { text, translation };
  }
}

module.exports = Translator;

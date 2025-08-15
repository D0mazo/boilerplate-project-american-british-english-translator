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
      dict = { ...americanToBritishSpelling, ...americanOnly };
      titles = americanToBritishTitles;
    } else if (locale === 'british-to-american') {
      const reversedSpelling = Object.fromEntries(
        Object.entries(americanToBritishSpelling).map(([am, br]) => [br, am])
      );
      dict = { ...reversedSpelling, ...britishOnly };
      titles = Object.fromEntries(
        Object.entries(americanToBritishTitles).map(([am, br]) => [br, am])
      );
    } else {
      return { text, translation: "Everything looks good to me!" };
    }

    // --- Handle titles (Mr., Dr., Prof., etc.) ---
    for (let [key, value] of Object.entries(titles)) {
      let pattern;
      if (locale === 'american-to-british') {
        pattern = new RegExp(`\\b${key.replace('.', '\\.')}(?=\\s|$)`, 'gi');
      } else {
        pattern = new RegExp(`\\b${key}(?=\\s|$)`, 'gi');
      }

      translation = translation.replace(pattern, (match) => {
        let replacement =
          match[0] === match[0].toUpperCase()
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : value;
        return this.highlight(replacement);
      });
    }

    // --- Multi-word phrases first ---
    const phrases = Object.keys(dict).sort((a, b) => b.length - a.length);
    for (let phrase of phrases) {
      const pattern = new RegExp(`\\b${phrase}\\b(?=[^\\w]|$)`, 'gi');
      translation = translation.replace(pattern, (match) => {
        let replacement = dict[phrase];

        // Special fix for "Rube Goldberg machine" → "Heath Robinson"
        if (replacement.toLowerCase().includes("heath robinson")) {
          replacement = "Heath Robinson";
        }

        // Preserve capitalization if match is capitalized
        if (match[0] === match[0].toUpperCase()) {
          replacement =
            replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }

        return this.highlight(replacement);
      });
    }

    // --- Time format ---
    if (locale === 'american-to-british') {
      translation = translation.replace(
        /(\d{1,2}):(\d{2})(?=\b)/g,
        (_, h, m) => this.highlight(`${h}.${m}`)
      );
    } else if (locale === 'british-to-american') {
      translation = translation.replace(
        /(\d{1,2})\.(\d{2})(?=\b)/g,
        (_, h, m) => this.highlight(`${h}:${m}`)
      );
    }

    if (translation === text) {
      translation = "Everything looks good to me!";
    }

    return { text, translation };
  }
}

module.exports = Translator;

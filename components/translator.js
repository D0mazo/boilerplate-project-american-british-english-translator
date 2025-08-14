'use strict';

const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
  constructor() {
    this.highlight = (text) => `<span class="highlight">${text}</span>`;
  }

  translate(text, locale) {
    if (!text) return { error: 'No text to translate' };
    if (!locale || (locale !== 'american-to-british' && locale !== 'british-to-american')) {
      return { error: 'Invalid value for locale field' };
    }

    let translation = text;

    if (locale === 'american-to-british') {
      // American-only words
      Object.keys(americanOnly).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        translation = translation.replace(regex, (match) => this.highlight(americanOnly[word]));
      });

      // Spelling
      Object.keys(americanToBritishSpelling).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        translation = translation.replace(regex, (match) => this.highlight(americanToBritishSpelling[word]));
      });

      // Titles
      Object.keys(americanToBritishTitles).forEach(title => {
        const regex = new RegExp(`\\b${title}\\b`, 'gi');
        translation = translation.replace(regex, (match) => this.highlight(americanToBritishTitles[title]));
      });

      // Time formatting
      translation = translation.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => this.highlight(`${h}.${m}`));

    } else if (locale === 'british-to-american') {
      // British-only words
      Object.keys(britishOnly).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        translation = translation.replace(regex, (match) => this.highlight(britishOnly[word]));
      });

      // Spelling (reverse)
      Object.keys(americanToBritishSpelling).forEach(word => {
        const britishWord = americanToBritishSpelling[word];
        const regex = new RegExp(`\\b${britishWord}\\b`, 'gi');
        translation = translation.replace(regex, (match) => this.highlight(word));
      });

      // Titles (reverse)
      Object.keys(americanToBritishTitles).forEach(title => {
        const britishTitle = americanToBritishTitles[title];
        const regex = new RegExp(`\\b${britishTitle}\\b`, 'gi');
        translation = translation.replace(regex, (match) => this.highlight(title));
      });

      // Time formatting
      translation = translation.replace(/(\d{1,2})\.(\d{2})/g, (_, h, m) => this.highlight(`${h}:${m}`));
    }

    if (translation === text) {
      return { text, translation: 'Everything looks good to me!' };
    }

    return { text, translation };
  }
}

module.exports = Translator;

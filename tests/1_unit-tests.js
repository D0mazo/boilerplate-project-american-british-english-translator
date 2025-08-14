const chai = require('chai');
const assert = chai.assert;
const Translator = require('../components/translator.js');

suite('Unit Tests', () => {
  const translator = new Translator();

  test('Translate Mangoes are my favorite fruit. to British English', () => {
    const result = translator.translate('Mangoes are my favorite fruit.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">favourite</span>');
  });

  test('Translate I ate yogurt for breakfast. to British English', () => {
    const result = translator.translate('I ate yogurt for breakfast.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">yoghurt</span>');
  });

  test('Translate We had a party at my friend\'s condo. to British English', () => {
    const result = translator.translate('We had a party at my friend\'s condo.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">flat</span>');
  });

  test('Translate Can you toss this in the trashcan for me? to British English', () => {
    const result = translator.translate('Can you toss this in the trashcan for me?', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">bin</span>');
  });

  test('Translate The parking lot was full. to British English', () => {
    const result = translator.translate('The parking lot was full.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">car park</span>');
  });

  test('Translate Like a high tech Rube Goldberg machine. to British English', () => {
    const result = translator.translate('Like a high tech Rube Goldberg machine.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">Heath Robinson</span>');
  });

  test('Translate To play hooky means to skip class or work. to British English', () => {
    const result = translator.translate('To play hooky means to skip class or work.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">bunk off</span>');
  });

  test('Translate No Mr. Bond, I expect you to die. to British English', () => {
    const result = translator.translate('No Mr. Bond, I expect you to die.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">Mr</span>');
  });

  test('Translate Dr. Grosh will see you now. to British English', () => {
    const result = translator.translate('Dr. Grosh will see you now.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">Dr</span>');
  });

  test('Translate Lunch is at 12:15 today. to British English', () => {
    const result = translator.translate('Lunch is at 12:15 today.', 'american-to-british');
    assert.include(result.translation, '<span class="highlight">12.15</span>');
  });

  test('Translate We watched the footie match for a while. to American English', () => {
    const result = translator.translate('We watched the footie match for a while.', 'british-to-american');
    assert.include(result.translation, '<span class="highlight">soccer</span>');
  });

  test('Translate Paracetamol takes up to an hour to work. to American English', () => {
    const result = translator.translate('Paracetamol takes up to an hour to work.', 'british-to-american');
    assert.include(result.translation, '<span class="highlight">acetaminophen</span>');
  });

  // ...add more tests for remaining translations and highlights
});

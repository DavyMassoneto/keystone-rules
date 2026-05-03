import { describe, it, expect } from 'vitest';
import { normalizeText } from '#lib/text-distance';

describe('normalizeText', () => {
  it('lowercases ASCII letters', () => {
    expect(normalizeText('HELLO')).toBe('hello');
  });

  it('strips Portuguese acute accents', () => {
    expect(normalizeText('árvore éter ímã óculos úvula')).toBe(
      'arvore eter ima oculos uvula',
    );
  });

  it('strips Portuguese grave accent', () => {
    expect(normalizeText('à')).toBe('a');
  });

  it('strips Portuguese circumflex accents', () => {
    expect(normalizeText('âmbar êxodo índole ônix')).toBe(
      'ambar exodo indole onix',
    );
  });

  it('strips Portuguese tilde accents', () => {
    expect(normalizeText('mão pão coração')).toBe('mao pao coracao');
  });

  it('strips the cedilla', () => {
    expect(normalizeText('ç')).toBe('c');
  });

  it('collapses multiple spaces into one', () => {
    expect(normalizeText('a   b\t\tc')).toBe('a b c');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalizeText('  hello  ')).toBe('hello');
  });

  it('removes punctuation', () => {
    expect(normalizeText('hello, world! how are you?')).toBe(
      'hello world how are you',
    );
  });

  it('returns an empty string when given an empty string', () => {
    expect(normalizeText('')).toBe('');
  });

  it('handles a combination of accents, casing, punctuation, and spacing', () => {
    expect(normalizeText('  ISSO,    NÃO  faz   SENTIDO!!! ')).toBe(
      'isso nao faz sentido',
    );
  });
});

export function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\p{P}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

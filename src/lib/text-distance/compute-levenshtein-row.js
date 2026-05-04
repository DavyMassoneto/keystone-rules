export function computeLevenshteinRow(previousRow, sourceChar, target) {
  const currentRow = new Array(target.length + 1);
  currentRow[0] = previousRow[0] + 1;
  for (let j = 1; j <= target.length; j++) {
    const cost = sourceChar === target[j - 1] ? 0 : 1;
    const insertion = currentRow[j - 1] + 1;
    const deletion = previousRow[j] + 1;
    const substitution = previousRow[j - 1] + cost;
    currentRow[j] = Math.min(insertion, deletion, substitution);
  }
  return currentRow;
}

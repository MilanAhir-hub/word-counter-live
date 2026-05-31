const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'of', 'to', 'for', 'with', 'on', 'in', 'at', 'by', 'and', 'or', 'but',
  'if', 'from', 'this', 'that', 'these', 'those', 'it', 'its', 'not', 'no',
  'so', 'as', 'do', 'did', 'does', 'has', 'had', 'have', 'can', 'could',
  'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'up', 'down',
  'out', 'off', 'over', 'under', 'again', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
  'more', 'most', 'some', 'any', 'who', 'whom', 'which', 'what', 'about',
  'into', 'than', 'also', 'just', 'very', 'too', 'own', 'same', 'such',
  'until', 'while', 'after', 'before', 'between', 'through', 'during',
  'because', 'other', 'another', 'many', 'much', 'nor', 'only', 'else',
  'well', 'even', 'still', 'yet', 'thus', 'since', 'like', 'upon'
]);

const MIN_WORD_LENGTH = 3;

export function normalizeText(text) {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const cleaned = lower.replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  return cleaned.split(' ').filter(w => w.length > 0);
}

export function removeStopWords(words) {
  return words.filter(w => w.length >= MIN_WORD_LENGTH && !STOP_WORDS.has(w));
}

export function calculateKeywordFrequency(words) {
  const freq = {};
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    freq[w] = (freq[w] || 0) + 1;
  }
  const entries = Object.entries(freq);
  entries.sort((a, b) => b[1] - a[1]);
  return entries.slice(0, 10).map(([keyword, count]) => ({ keyword, count }));
}

export function calculateKeywordDensity(frequency, totalValidWords) {
  if (!totalValidWords || totalValidWords === 0) return [];
  return frequency.map(({ keyword, count }) => ({
    keyword,
    count,
    density: parseFloat(((count / totalValidWords) * 100).toFixed(2))
  }));
}

export function analyzeKeywords(text) {
  const words = normalizeText(text);
  const validWords = removeStopWords(words);
  const totalValidWords = validWords.length;
  const frequency = calculateKeywordFrequency(validWords);
  const density = calculateKeywordDensity(frequency, totalValidWords);
  return { density, frequency, totalValidWords };
}

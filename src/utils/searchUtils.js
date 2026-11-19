// =============================================
// utils/searchUtils.js — searches ACTIVE_PROBLEMS only
// =============================================
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';

/** Build a flat search index from active problems */
export const buildSearchIndex = () =>
  ACTIVE_PROBLEMS.map(p => ({
    id:           p.id,
    title:        p.title,
    titleLc:      p.title.toLowerCase(),
    topic:        p.topic,
    topicDisplay: p.topicDisplay,
    topicLc:      p.topicDisplay.toLowerCase(),
    subtopicLc:   (p.subtopic || '').toLowerCase(),
    tagsLc:       (p.tags || []).join(' ').toLowerCase(),
    difficulty:   p.difficulty,
    diffLc:       p.difficulty.toLowerCase(),
    hasPython:    p.hasPython,
    hasJava:      p.hasJava,
  }));

let _index = null;
const getIndex = () => { if (!_index) _index = buildSearchIndex(); return _index; };

/**
 * Search the index.
 * @param {string} query
 * @param {number} limit
 */
export const searchProblems = (query, limit = 15) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return getIndex()
    .filter(item =>
      item.titleLc.includes(q) ||
      item.topicLc.includes(q) ||
      item.subtopicLc.includes(q) ||
      item.tagsLc.includes(q) ||
      item.diffLc.includes(q)
    )
    .sort((a, b) => {
      const rank = str => str.startsWith(q) ? 0 : str.includes(q) ? 1 : 2;
      return rank(a.titleLc) - rank(b.titleLc);
    })
    .slice(0, limit);
};

/**
 * Filter a problem list with multiple criteria.
 */
export const filterProblems = (
  problems,
  { query = '', difficulty = '', lang = '', onlyCompleted = false, onlyBookmarked = false, completed = new Set(), bookmarks = new Set() }
) => {
  const q = query.toLowerCase().trim();
  return problems.filter(p => {
    if (q && !p.title.toLowerCase().includes(q) &&
        !p.topicDisplay.toLowerCase().includes(q) &&
        !(p.subtopic || '').toLowerCase().includes(q)) return false;
    if (difficulty && p.difficulty !== difficulty) return false;
    if (lang === 'python' && !p.hasPython) return false;
    if (lang === 'java'   && !p.hasJava)   return false;
    if (onlyCompleted  && !completed.has(p.id))  return false;
    if (onlyBookmarked && !bookmarks.has(p.id))  return false;
    return true;
  });
};

/** Highlight a matching substring in text */
export const highlight = (text, query) => {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    `<mark>${text.slice(idx, idx + query.length)}</mark>` +
    text.slice(idx + query.length)
  );
};

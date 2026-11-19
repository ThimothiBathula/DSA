// =============================================
// utils/progressUtils.js — uses ACTIVE_PROBLEMS only
// =============================================
import { TOPIC_ORDER, TOPIC_DISPLAY } from '../data/problems.js';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';

export const computeStats = (completed = [], bookmarks = []) => {
  const total          = ACTIVE_PROBLEMS.length;
  const completedSet   = new Set(completed);
  const completedCount = ACTIVE_PROBLEMS.filter(p => completedSet.has(p.id)).length;
  const bookmarksCount = new Set(bookmarks).size;
  const remaining      = total - completedCount;
  const pct            = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  return { total, completedCount, remaining, bookmarksCount, pct };
};

export const computeTopicStats = (completed = []) => {
  const completedSet = new Set(completed);
  const stats = {};
  TOPIC_ORDER.forEach(key => {
    const problems = ACTIVE_PROBLEMS.filter(p => p.topic === key);
    const done     = problems.filter(p => completedSet.has(p.id)).length;
    stats[key] = {
      total:   problems.length,
      done,
      pct:     problems.length > 0 ? Math.round((done / problems.length) * 100) : 0,
      display: TOPIC_DISPLAY[key] || key,
    };
  });
  return stats;
};

/** Get prev / next problem in flat order (within active problems only) */
export const getAdjacentProblems = (id) => {
  const idx = ACTIVE_PROBLEMS.findIndex(p => p.id === id);
  return {
    prev: idx > 0 ? ACTIVE_PROBLEMS[idx - 1] : null,
    next: idx < ACTIVE_PROBLEMS.length - 1 ? ACTIVE_PROBLEMS[idx + 1] : null,
  };
};

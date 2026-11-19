// =============================================
// utils/storage.js – localStorage helpers
// =============================================

const KEYS = {
  completed: 'dsa_completed',
  bookmarks: 'dsa_bookmarks',
  recent:    'dsa_recent',
  theme:     'dsa_theme',
  lang:      'dsa_lang',
};

const get = (key, fallback = []) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const set = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export const storage = {
  KEYS,

  /* ── Completed ── */
  getCompleted:    () => get(KEYS.completed, []),
  setCompleted:    (list) => set(KEYS.completed, list),
  isCompleted:     (id) => get(KEYS.completed, []).includes(id),
  toggleCompleted: (id) => {
    let list = get(KEYS.completed, []);
    if (list.includes(id)) { list = list.filter(i => i !== id); set(KEYS.completed, list); return false; }
    list.push(id); set(KEYS.completed, list); return true;
  },

  /* ── Bookmarks ── */
  getBookmarks:    () => get(KEYS.bookmarks, []),
  setBookmarks:    (list) => set(KEYS.bookmarks, list),
  isBookmarked:    (id) => get(KEYS.bookmarks, []).includes(id),
  toggleBookmark:  (id) => {
    let list = get(KEYS.bookmarks, []);
    if (list.includes(id)) { list = list.filter(i => i !== id); set(KEYS.bookmarks, list); return false; }
    list.push(id); set(KEYS.bookmarks, list); return true;
  },

  /* ── Recent ── */
  getRecent: (limit = 20) => get(KEYS.recent, []).slice(0, limit),
  addRecent: (id) => {
    let list = get(KEYS.recent, []).filter(i => i !== id);
    list.unshift(id);
    set(KEYS.recent, list.slice(0, 25));
  },

  /* ── Theme ── */
  getTheme: () => localStorage.getItem(KEYS.theme) || 'dark',
  setTheme: (t) => localStorage.setItem(KEYS.theme, t),

  /* ── Lang ── */
  getLang: () => localStorage.getItem(KEYS.lang) || 'python',
  setLang: (l) => localStorage.setItem(KEYS.lang, l),
};

// =============================================
// hooks/useTheme.js
// =============================================
import { useApp } from '../context/AppContext.jsx';
export const useTheme = () => {
  const { theme, setTheme } = useApp();
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return { theme, setTheme, toggle };
};

// =============================================
// hooks/useProgress.js
// =============================================
// (re-exported from context for convenience)
export { useApp as useProgress } from '../context/AppContext.jsx';

// =============================================
// hooks/useSearch.js
// =============================================
import { useState, useCallback, useRef } from 'react';
import { searchProblems } from '../utils/searchUtils.js';

export const useSearch = () => {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const timer = useRef(null);

  const search = useCallback((q) => {
    setQuery(q);
    clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(() => {
      const r = searchProblems(q, 12);
      setResults(r);
      setOpen(true);
    }, 80);
  }, []);

  const clear = useCallback(() => { setQuery(''); setResults([]); setOpen(false); }, []);

  return { query, results, open, search, clear, setOpen };
};

// =============================================
// hooks/useBookmarks.js
// =============================================
export { useApp as useBookmarks } from '../context/AppContext.jsx';

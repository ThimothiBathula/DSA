// =============================================
// context/AppContext.jsx
// =============================================
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storage } from '../utils/storage.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme,     setThemeState]     = useState(() => storage.getTheme());
  const [completed, setCompleted]      = useState(() => storage.getCompleted());
  const [bookmarks, setBookmarks]      = useState(() => storage.getBookmarks());
  const [recent,    setRecent]         = useState(() => storage.getRecent());
  const [sidebarOpen, setSidebarOpen]  = useState(false);
  const [toast,     setToast]          = useState(null);

  /* ── Theme ── */
  const setTheme = useCallback((t) => {
    setThemeState(t);
    storage.setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ── Completed ── */
  const toggleCompleted = useCallback((id) => {
    setCompleted(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      storage.setCompleted(next);
      return next;
    });
    return !completed.includes(id);
  }, [completed]);

  const isCompleted = useCallback((id) => completed.includes(id), [completed]);

  /* ── Bookmarks ── */
  const toggleBookmark = useCallback((id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      storage.setBookmarks(next);
      return next;
    });
    return !bookmarks.includes(id);
  }, [bookmarks]);

  const isBookmarked = useCallback((id) => bookmarks.includes(id), [bookmarks]);

  /* ── Recent ── */
  const addRecent = useCallback((id) => {
    setRecent(prev => {
      const next = [id, ...prev.filter(i => i !== id)].slice(0, 25);
      storage.setCompleted; // just to keep reference — we call storage below
      return next;
    });
    storage.addRecent(id);
  }, []);

  /* ── Toast ── */
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => setToast(t => t?.id === id ? null : t), 2800);
  }, []);

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      completed, toggleCompleted, isCompleted,
      bookmarks, toggleBookmark, isBookmarked,
      recent, addRecent,
      sidebarOpen, setSidebarOpen,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

// =============================================
// components/SearchBar.jsx — Premium redesign
// =============================================
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/index.js';
import { highlight } from '../utils/searchUtils.js';

const SearchSvgIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function SearchBar() {
  const navigate = useNavigate();
  const { query, results, open, search, clear, setOpen } = useSearch();
  const inputRef     = useRef(null);
  const listRef      = useRef(null);
  const highlightIdx = useRef(-1);

  /* Ctrl+K shortcut */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.search-wrap')) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setOpen]);

  const goTo = (item) => {
    navigate(`/problem/${item.id}`);
    clear();
  };

  const handleKeyDown = (e) => {
    if (!open || !results.length) return;
    const items = listRef.current?.querySelectorAll('.search-result') || [];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightIdx.current = Math.min(highlightIdx.current + 1, results.length - 1);
      items[highlightIdx.current]?.scrollIntoView({ block: 'nearest' });
      items.forEach((el, i) => el.classList.toggle('highlighted', i === highlightIdx.current));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIdx.current = Math.max(highlightIdx.current - 1, -1);
      items.forEach((el, i) => el.classList.toggle('highlighted', i === highlightIdx.current));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIdx.current >= 0 && results[highlightIdx.current]) goTo(results[highlightIdx.current]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="search-wrap">
      <div className="search-input-wrap">
        <span className="search-icon"><SearchSvgIcon /></span>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          value={query}
          onChange={e => { highlightIdx.current = -1; search(e.target.value); }}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setOpen(true)}
          placeholder="Search problems…"
          autoComplete="off"
          spellCheck="false"
          aria-label="Search problems"
        />
        <span className="search-kbd">Ctrl K</span>
      </div>

      {open && (
        <div className="search-dropdown" ref={listRef} role="listbox">
          {results.length === 0 ? (
            <div className="search-no-results">
              No results for "{query}"
            </div>
          ) : results.map((r) => (
            <button
              key={r.id}
              className="search-result"
              onMouseDown={() => goTo(r)}
              role="option"
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="search-result__title"
                  dangerouslySetInnerHTML={{ __html: highlight(r.title, query) }}
                />
                <div className="search-result__meta">{r.topicDisplay} · {r.difficulty}</div>
              </div>
              <span className={`diff-badge diff-badge--${r.difficulty}`}>{r.difficulty}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

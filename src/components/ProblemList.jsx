// =============================================
// components/ProblemList.jsx — Premium redesign
// =============================================
import { useState, useMemo } from 'react';
import ProblemRow from './ProblemRow.jsx';
import { filterProblems } from '../utils/searchUtils.js';
import { useApp } from '../context/AppContext.jsx';
import { computeTopicStats } from '../utils/progressUtils.js';

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

export default function ProblemList({ problems, title, icon, topicSlug }) {
  const { completed, bookmarks } = useApp();

  const [query,          setQuery]          = useState('');
  const [difficulty,     setDifficulty]     = useState('');
  const [lang,           setLang]           = useState('');
  const [onlyCompleted,  setOnlyCompleted]  = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const bookmarkSet  = useMemo(() => new Set(bookmarks),  [bookmarks]);

  const topicStats = useMemo(() => {
    if (!topicSlug) return null;
    const stats = computeTopicStats(completed);
    return stats[topicSlug] || null;
  }, [topicSlug, completed]);

  const filtered = useMemo(() =>
    filterProblems(problems, { query, difficulty, lang, onlyCompleted, onlyBookmarked, completed: completedSet, bookmarks: bookmarkSet }),
    [problems, query, difficulty, lang, onlyCompleted, onlyBookmarked, completedSet, bookmarkSet]
  );

  const hasActiveFilter = query || difficulty || lang || onlyCompleted || onlyBookmarked;

  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="topic-header">
        <div className="page-header__title">{title}</div>
        <div className="topic-header__meta">
          <span className="topic-header__count">
            {filtered.length !== problems.length ? `${filtered.length} / ${problems.length}` : `${problems.length}`} problems
          </span>
          {topicStats && topicStats.total > 0 && (
            <div className="topic-header__progress">
              <div className="topic-mini-bar">
                <div className="topic-mini-fill" style={{ width: `${topicStats.pct}%` }} />
              </div>
              <span>{topicStats.done}/{topicStats.total} completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-search">
          <span className="search-icon"><SearchIcon /></span>
          <input
            className="filter-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter problems…"
          />
        </div>

        <select className="filter-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select className="filter-select" value={lang} onChange={e => setLang(e.target.value)}>
          <option value="">All Languages</option>
          <option value="python">Has Python</option>
          <option value="java">Has Java</option>
        </select>

        <button
          className={`filter-toggle-btn${onlyCompleted ? ' active-completed' : ''}`}
          onClick={() => setOnlyCompleted(v => !v)}
        >
          <CheckIcon />
          Completed
        </button>

        <button
          className={`filter-toggle-btn${onlyBookmarked ? ' active-bookmarked' : ''}`}
          onClick={() => setOnlyBookmarked(v => !v)}
        >
          <BookmarkIcon />
          Bookmarked
        </button>
      </div>

      {/* Problems table */}
      <div className="problems-table">
        {/* Table header (desktop) */}
        <div className="problems-table__header">
          <div></div>
          <div>Problem</div>
          <div className="col-topic">Topic</div>
          <div className="col-diff">Difficulty</div>
          <div className="col-langs">Languages</div>
          <div></div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              {hasActiveFilter ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              ) : '📋'}
            </div>
            <h3>{hasActiveFilter ? 'No matching problems' : 'No problems here'}</h3>
            <p>{hasActiveFilter ? 'Try adjusting your search or filters.' : 'No problems found in this list.'}</p>
            {hasActiveFilter && (
              <button
                className="btn btn--outline btn--sm"
                onClick={() => { setQuery(''); setDifficulty(''); setLang(''); setOnlyCompleted(false); setOnlyBookmarked(false); }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filtered.map(p => <ProblemRow key={p.id} problem={p} />)
        )}
      </div>
    </div>
  );
}

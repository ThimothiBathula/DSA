// =============================================
// components/ProgressCard.jsx — Premium redesign
// =============================================
import { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { computeStats, computeTopicStats } from '../utils/progressUtils.js';
import { TOPIC_ORDER } from '../data/problems.js';
import { useNavigate } from 'react-router-dom';

export function StatsGrid() {
  const { completed, bookmarks } = useApp();
  const stats = useMemo(() => computeStats(completed, bookmarks), [completed, bookmarks]);

  const cards = [
    {
      value: stats.total,
      label: 'Total Problems',
      color: 'blue',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      value: stats.completedCount,
      label: 'Completed',
      color: 'green',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
    },
    {
      value: stats.remaining,
      label: 'Remaining',
      color: 'orange',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      value: stats.bookmarksCount,
      label: 'Bookmarks',
      color: 'purple',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      value: 19,
      label: 'Topics',
      color: 'cyan',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map(c => (
        <div key={c.label} className="stat-card">
          <div className="stat-card__top">
            <div className={`stat-card__icon stat-card__icon--${c.color}`}>{c.icon}</div>
          </div>
          <div className="stat-card__value">{c.value}</div>
          <div className="stat-card__label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

export function OverallProgress() {
  const { completed, bookmarks } = useApp();
  const stats = useMemo(() => computeStats(completed, bookmarks), [completed, bookmarks]);

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-title">Overall Progress</span>
        <span className="progress-pct">{stats.pct}%</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${stats.pct}%` }} />
      </div>
      <div className="progress-labels">
        <span><strong>{stats.completedCount}</strong> solved</span>
        <span><strong>{stats.remaining}</strong> remaining</span>
        <span><strong>{stats.total}</strong> total</span>
      </div>
    </div>
  );
}

export function TopicsOverview() {
  const { completed } = useApp();
  const navigate = useNavigate();
  const topicStats = useMemo(() => computeTopicStats(completed), [completed]);

  return (
    <div className="card">
      <div className="section-heading">Topics</div>
      <div className="topic-overview-list">
        {TOPIC_ORDER.map(key => {
          const ts = topicStats[key];
          if (!ts) return null;
          return (
            <div
              key={key}
              className="topic-overview-item"
              onClick={() => navigate(`/topics/${key}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(`/topics/${key}`)}
            >
              <div className="topic-overview-name">{ts.display}</div>
              <div className="topic-overview-bar">
                <div className="topic-overview-fill" style={{ width: `${ts.pct}%` }} />
              </div>
              <div className="topic-overview-count">{ts.done}/{ts.total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================
// pages/Dashboard.jsx — Premium redesign
// =============================================
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { StatsGrid, OverallProgress, TopicsOverview } from '../components/ProgressCard.jsx';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';
const PROBLEMS_DATA = ACTIVE_PROBLEMS; // only show problems with actual code

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const QUICK_LINKS = [
  { label: 'All Problems', to: '/problems', desc: 'Browse every problem' },
  { label: 'Arrays', to: '/topics/arrays', desc: 'Foundation concepts' },
  { label: 'Dynamic Programming', to: '/topics/dp', desc: 'Optimization problems' },
  { label: 'Graphs', to: '/topics/graphs', desc: 'Graph traversal' },
  { label: 'Binary Search', to: '/topics/binary-search', desc: 'Divide & conquer' },
  { label: 'Trees', to: '/topics/trees', desc: 'Tree problems' },
];

export default function Dashboard() {
  const { recent, isCompleted } = useApp();
  const navigate = useNavigate();

  const recentProblems = useMemo(() =>
    recent.slice(0, 7).map(id => PROBLEMS_DATA.find(p => p.id === id)).filter(Boolean),
    [recent]
  );

  return (
    <div className="page-enter">
      {/* Hero section */}
      <div className="dashboard-hero">
        <div className="dashboard-hero__greeting">Your workspace</div>
        <h1>DSA Learning Platform</h1>
        <p>Master Data Structures &amp; Algorithms — one problem at a time.</p>
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Progress bar */}
      <OverallProgress />

      {/* Grid: Topics + Recent */}
      <div className="dashboard-grid">
        <TopicsOverview />

        <div className="card">
          <div className="section-heading">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Recently Visited
          </div>

          {recentProblems.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 0' }}>
              <div className="empty-state__icon">📖</div>
              <h3>No recent activity</h3>
              <p>Start solving problems to track your progress here.</p>
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/problems')}>
                Browse Problems
              </button>
            </div>
          ) : (
            <div className="recent-list">
              {recentProblems.map(p => (
                <div
                  key={p.id}
                  className="recent-item"
                  onClick={() => navigate(`/problem/${p.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/problem/${p.id}`)}
                >
                  <span className={`status-dot${isCompleted(p.id) ? ' status-dot--done' : ''}`}>
                    {isCompleted(p.id) && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </span>
                  <div className="recent-item__title">{p.title}</div>
                  <span className="topic-pill">{p.topicDisplay}</span>
                  <span className={`diff-badge diff-badge--${p.difficulty}`}>{p.difficulty}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick access */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="section-heading">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Quick Access
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {QUICK_LINKS.map(({ label, to, desc }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 8, padding: '10px 12px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition)',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--accent-bg)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-surface-2)';
              }}
            >
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 1 }}>{desc}</div>
              </div>
              <ArrowRightIcon />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

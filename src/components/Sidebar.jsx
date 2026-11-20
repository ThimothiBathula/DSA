// =============================================
// components/Sidebar.jsx — Premium redesign
// =============================================
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { TOPICS_DATA } from '../data/problems.js';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';
import { computeStats } from '../utils/progressUtils.js';
import '../styles/layout.css';

const NAV_ICONS = {
  dashboard: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  problems: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  bookmark: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  topic: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ),
};

export default function Sidebar() {
  const { completed, bookmarks, sidebarOpen, setSidebarOpen } = useApp();
  const stats = computeStats(completed, bookmarks);
  const navigate = useNavigate();

  const handleNav = (to) => {
    navigate(to);
    if (window.innerWidth <= 900) setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar__header">
          <button className="sidebar__logo" onClick={() => handleNav('/')}>
            <div className="sidebar__logo-icon">⚡</div>
            <span className="sidebar__logo-name">DSA Platform</span>
          </button>
        </div>

        <nav className="sidebar__nav">
          {/* Main section */}
          <div className="sidebar__section">
            <div className="sidebar__section-title">Main</div>
            <SidebarLink to="/" label="Dashboard" icon={NAV_ICONS.dashboard} end onClick={handleNav} />
            <SidebarLink to="/problems" label="All Problems" icon={NAV_ICONS.problems} badge={stats.total} onClick={handleNav} />
            <SidebarLink to="/bookmarks" label="Bookmarks" icon={NAV_ICONS.bookmark} badge={bookmarks.length || undefined} onClick={handleNav} />
            <SidebarLink to="/completed" label="Completed" icon={NAV_ICONS.check} badge={stats.completedCount || undefined} onClick={handleNav} />
          </div>

          {/* Topics section */}
          <div className="sidebar__section">
            <div className="sidebar__section-title">Topics</div>
            {TOPICS_DATA.map(t => {
              const topicCount = ACTIVE_PROBLEMS.filter(p => p.topic === t.key).length;
              return (
                <SidebarLink
                  key={t.key}
                  to={`/topics/${t.slug}`}
                  label={t.display}
                  icon={NAV_ICONS.topic}
                  badge={topicCount || undefined}
                  onClick={handleNav}
                />
              );
            })}
          </div>
        </nav>

        <div className="sidebar__footer">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
            {ACTIVE_PROBLEMS.length} problems · {TOPICS_DATA.length} topics
          </span>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, label, icon, badge, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `sidebar__item${isActive ? ' active' : ''}`}
      onClick={(e) => { e.preventDefault(); onClick(to); }}
    >
      <span className="sidebar__icon">{icon}</span>
      <span className="sidebar__label">{label}</span>
      {badge !== undefined && (
        <span className="sidebar__badge">{badge}</span>
      )}
    </NavLink>
  );
}

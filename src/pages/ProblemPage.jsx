// =============================================
// pages/ProblemPage.jsx — Premium redesign
// =============================================
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { useApp }  from '../context/AppContext.jsx';
import CodeBlock   from '../components/CodeBlock.jsx';
import Breadcrumb  from '../components/Breadcrumb.jsx';
import { PROBLEMS_DATA } from '../data/problems.js';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';
import { getAdjacentProblems } from '../utils/progressUtils.js';

/* ── Helper: render plain text as paragraphs ── */
function ContentBody({ text }) {
  if (!text) return null;
  const paras = text.split(/\n\s*\n/).filter(p => p.trim());
  return (
    <div className="content-body">
      {paras.map((p, i) => (
        <p key={i}>{p.replace(/\n/g, ' ')}</p>
      ))}
    </div>
  );
}

/* ── Section card ── */
function Section({ icon, title, children }) {
  if (!children) return null;
  return (
    <div className="card content-card">
      <div className="section-heading">{icon && <span>{icon}</span>}{title}</div>
      {children}
    </div>
  );
}

/* ── Back arrow ── */
const ArrowLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

export default function ProblemPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { isCompleted, toggleCompleted, isBookmarked, toggleBookmark, addRecent, showToast } = useApp();

  const id = parseInt(problemId, 10);
  const problem = useMemo(() => PROBLEMS_DATA.find(p => p.id === id), [id]);

  useEffect(() => {
    if (problem) {
      addRecent(problem.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [problem?.id]);

  if (!problem) return <Navigate to="/404" replace />;

  const done  = isCompleted(problem.id);
  const bmked = isBookmarked(problem.id);
  const { prev, next } = getAdjacentProblems(problem.id);

  const handleComplete = () => {
    const nowDone = !done;
    toggleCompleted(problem.id);
    showToast(nowDone ? 'Marked as completed!' : 'Marked as incomplete', nowDone ? 'success' : 'info');
  };

  const handleBookmark = () => {
    const nowBmked = !bmked;
    toggleBookmark(problem.id);
    showToast(nowBmked ? 'Bookmarked!' : 'Bookmark removed', nowBmked ? 'success' : 'info');
  };

  return (
    <div className="page-enter">
      {/* Top bar */}
      <div className="prob-topbar">
        <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)} style={{ gap: 6 }}>
          <ArrowLeft />
          Back
        </button>
        <span className="prob-counter">
          Problem {ACTIVE_PROBLEMS.findIndex(p => p.id === problem.id) + 1} of {ACTIVE_PROBLEMS.length}
        </span>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: problem.topicDisplay, to: `/topics/${problem.topic}` },
        { label: problem.title },
      ]} />

      {/* Title + meta */}
      <div className="prob-title-section">
        <h1 className="prob-detail__title">{problem.title}</h1>
        <div className="prob-meta">
          <span className={`diff-badge diff-badge--${problem.difficulty}`}>{problem.difficulty}</span>
          <Link to={`/topics/${problem.topic}`} className="topic-link">{problem.topicDisplay}</Link>
          {problem.subtopic && <span className="prob-sub">· {problem.subtopic}</span>}
          {(problem.tags || []).length > 0 && (
            <div className="tags-row">
              {problem.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="problem-actions">
        <button
          className={`btn${done ? ' btn--completed' : ' btn--outline'}`}
          onClick={handleComplete}
          style={{ gap: 7 }}
        >
          <CheckIcon />
          {done ? 'Completed' : 'Mark Complete'}
        </button>
        <button
          className={`btn btn--outline${bmked ? ' btn--bookmarked' : ''}`}
          onClick={handleBookmark}
          style={{ gap: 7 }}
        >
          <BookmarkIcon filled={bmked} />
          {bmked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      {/* Problem navigation (top) */}
      <ProbNav prev={prev} next={next} navigate={navigate} problem={problem} />

      {/* ── Content ── */}
      {problem.problemStatement && (
        <Section title="Problem Statement">
          <ContentBody text={problem.problemStatement} />
        </Section>
      )}

      {problem.intuition && (
        <Section title="Intuition & Approach">
          <ContentBody text={problem.intuition} />
        </Section>
      )}

      {problem.approach && (
        <Section title="Algorithm Steps">
          <ContentBody text={problem.approach} />
        </Section>
      )}

      {/* ── Code ── */}
      <div className="content-card">
        <div className="section-heading" style={{ marginBottom: 12 }}>
          Solution
        </div>
        <CodeBlock
          pythonCode={problem.pythonCode}
          javaCode={problem.javaCode}
          hasPython={problem.hasPython}
          hasJava={problem.hasJava}
        />
      </div>

      {/* ── Complexity ── */}
      {(problem.timeComplexity || problem.spaceComplexity) && (
        <Section title="Complexity Analysis">
          <div className="complexity-grid">
            <div className="complexity-item">
              <div className="complexity-label">Time Complexity</div>
              <div className="complexity-value">{problem.timeComplexity || 'N/A'}</div>
            </div>
            <div className="complexity-item">
              <div className="complexity-label">Space Complexity</div>
              <div className="complexity-value">{problem.spaceComplexity || 'N/A'}</div>
            </div>
          </div>
        </Section>
      )}

      {/* Problem navigation (bottom) */}
      <ProbNav prev={prev} next={next} navigate={navigate} problem={problem} />
    </div>
  );
}

function ProbNav({ prev, next, navigate, problem }) {
  return (
    <div className="prob-nav">
      <button
        className="prob-nav__btn btn btn--outline btn--sm"
        disabled={!prev}
        onClick={() => prev && navigate(`/problem/${prev.id}`)}
        style={{ gap: 5 }}
      >
        <ChevronLeft />
        {prev ? <span className="prob-nav__title">{prev.title}</span> : <span>First</span>}
      </button>

      <button
        className="btn btn--ghost btn--sm"
        onClick={() => navigate(`/topics/${problem.topic}`)}
        style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}
      >
        {problem.topicDisplay}
      </button>

      <button
        className="prob-nav__btn btn btn--outline btn--sm"
        disabled={!next}
        onClick={() => next && navigate(`/problem/${next.id}`)}
        style={{ gap: 5 }}
      >
        {next ? <span className="prob-nav__title">{next.title}</span> : <span>Last</span>}
        <ChevronRight />
      </button>
    </div>
  );
}

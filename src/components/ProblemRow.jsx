// =============================================
// components/ProblemRow.jsx — Premium redesign
// =============================================
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const CheckIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

export default function ProblemRow({ problem }) {
  const navigate = useNavigate();
  const { isCompleted, isBookmarked, toggleBookmark, showToast } = useApp();

  const done  = isCompleted(problem.id);
  const bmked = isBookmarked(problem.id);

  const handleBookmark = (e) => {
    e.stopPropagation();
    const nowBookmarked = !bmked;
    toggleBookmark(problem.id);
    showToast(nowBookmarked ? 'Bookmarked!' : 'Bookmark removed', nowBookmarked ? 'success' : 'info');
  };

  return (
    <div
      className={`problem-row${done ? ' problem-row--done' : ''}`}
      onClick={() => navigate(`/problem/${problem.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/problem/${problem.id}`)}
    >
      {/* Status */}
      <div className="problem-row__status">
        <span className={`status-dot${done ? ' status-dot--done' : ''}`}>
          {done && <CheckIcon />}
        </span>
      </div>

      {/* Title */}
      <div className="problem-row__title-col">
        <div className="problem-row__title">{problem.title}</div>
        {problem.subtopic && (
          <div className="problem-row__sub">{problem.subtopic}</div>
        )}
      </div>

      {/* Topic */}
      <div className="problem-row__topic col-topic">
        <span className="topic-pill">{problem.topicDisplay}</span>
      </div>

      {/* Difficulty */}
      <div className="problem-row__diff col-diff">
        <span className={`diff-badge diff-badge--${problem.difficulty}`}>{problem.difficulty}</span>
      </div>

      {/* Languages */}
      <div className="code-langs col-langs">
        {problem.hasPython
          ? <span className="lang-pill lang-pill--py">PY</span>
          : <span className="lang-pill lang-pill--na">—</span>
        }
        {problem.hasJava
          ? <span className="lang-pill lang-pill--java">JV</span>
          : <span className="lang-pill lang-pill--na">—</span>
        }
      </div>

      {/* Bookmark */}
      <div className="problem-row__actions" onClick={e => e.stopPropagation()}>
        <button
          className={`btn btn--icon${bmked ? ' btn--bookmarked' : ''}`}
          title={bmked ? 'Remove bookmark' : 'Bookmark this problem'}
          onClick={handleBookmark}
          style={{ color: bmked ? 'var(--amber)' : 'var(--text-muted)' }}
        >
          <BookmarkIcon filled={bmked} />
        </button>
      </div>
    </div>
  );
}

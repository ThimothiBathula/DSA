// =============================================
// pages/ProblemPage.jsx
// Premium problem page with:
//  - Properly structured Input / Output for ALL problems
//  - Generated pattern outputs for Pattern 1-22
//  - LeetCode search link on every problem
// =============================================
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { useApp }  from '../context/AppContext.jsx';
import CodeBlock   from '../components/CodeBlock.jsx';
import Breadcrumb  from '../components/Breadcrumb.jsx';
import { PROBLEMS_DATA } from '../data/problems.js';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';
import { getAdjacentProblems } from '../utils/progressUtils.js';
import { generatePattern, getPatternNumber } from '../utils/patternGenerator.js';

/* ═══════════════════════════════════════════
   Helpers
═══════════════════════════════════════════ */

/** Render plain text with paragraphs */
function ContentBody({ text }) {
  if (!text) return null;
  const paras = text.split(/\n\s*\n/).filter(p => p.trim());
  return (
    <div className="content-body">
      {paras.map((p, i) => <p key={i}>{p.replace(/\n/g, ' ')}</p>)}
    </div>
  );
}

/**
 * Parse a raw example string into { input, output, explanation }
 * Handles formats like:
 *   "Input : x = 5 Output : 10 Explanation : doubled"
 *   "Input (user gives value): 7 Output : 7"
 *   "Input : n = 4 Output :"   (empty output – pattern)
 */
function parseExample(str) {
  if (!str || !str.trim()) return null;
  str = str.trim();

  const inputMatch = str.match(/Input\s*(?:\([^)]*\))?\s*[:\-]\s*(.*?)(?=\s*Output\s*[:\-]|$)/is);
  const outputMatch = str.match(/Output\s*[:\-]\s*(.*?)(?=\s*Explanation\s*[:\-]|$)/is);
  const explMatch   = str.match(/Explanation\s*[:\-]\s*(.*?)$/is);

  return {
    input:       inputMatch?.[1]?.trim()  || '',
    output:      outputMatch?.[1]?.trim() || '',
    explanation: explMatch?.[1]?.trim()   || '',
    raw: str,
  };
}

/* ═══════════════════════════════════════════
   ExamplesSection — structured IO for ALL problems
═══════════════════════════════════════════ */
function ExamplesSection({ problem }) {
  const { examples, problemStatement, title, id } = problem;

  const patternNum = getPatternNumber(title);
  const isPattern  = patternNum !== null;

  // Parse all example strings
  const parsed = useMemo(() => {
    if (!examples || !examples.length) return [];
    return examples.map(parseExample).filter(Boolean);
  }, [examples]);

  // For patterns, generate actual outputs for n=4 and n=5
  const patternOutputs = useMemo(() => {
    if (!isPattern) return null;
    return {
      n4: generatePattern(patternNum, 4),
      n5: generatePattern(patternNum, 5),
    };
  }, [patternNum, isPattern]);

  const hasContent = parsed.length > 0 || isPattern;
  if (!hasContent) return null;

  return (
    <div className="card content-card">
      <div className="section-heading">Input / Output Examples</div>

      {/* ── Pattern problems: show generated visual output ── */}
      {isPattern && patternOutputs && (
        <>
          {/* Example 1: n=4 */}
          <div className="io-example">
            <div className="io-example__num">Example 1</div>
            <div className="io-row">
              <div className="io-cell io-cell--input">
                <div className="io-label">Input</div>
                <code className="io-value">n = 4</code>
              </div>
              <div className="io-arrow">→</div>
              <div className="io-cell io-cell--output">
                <div className="io-label">Output</div>
                {patternOutputs.n4 ? (
                  <pre className="io-pattern">{patternOutputs.n4}</pre>
                ) : (
                  <code className="io-value io-value--out">See code</code>
                )}
              </div>
            </div>
          </div>

          {/* Example 2: n=5 */}
          <div className="io-example">
            <div className="io-example__num">Example 2</div>
            <div className="io-row">
              <div className="io-cell io-cell--input">
                <div className="io-label">Input</div>
                <code className="io-value">n = 5</code>
              </div>
              <div className="io-arrow">→</div>
              <div className="io-cell io-cell--output">
                <div className="io-label">Output</div>
                {patternOutputs.n5 ? (
                  <pre className="io-pattern">{patternOutputs.n5}</pre>
                ) : (
                  <code className="io-value io-value--out">See code</code>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── All other problems: structured Input/Output ── */}
      {!isPattern && parsed.map((ex, i) => {
        const hasIO = ex.input || ex.output;

        if (hasIO) {
          return (
            <div key={i} className="io-example">
              <div className="io-example__num">Example {i + 1}</div>

              <div className="io-row">
                {ex.input && (
                  <div className="io-cell io-cell--input">
                    <div className="io-label">Input</div>
                    <code className="io-value">{ex.input}</code>
                  </div>
                )}
                {ex.input && ex.output && <div className="io-arrow">→</div>}
                {ex.output && (
                  <div className="io-cell io-cell--output">
                    <div className="io-label">Output</div>
                    <code className="io-value io-value--out">{ex.output}</code>
                  </div>
                )}
              </div>

              {ex.explanation && (
                <div className="io-explain">
                  <span className="io-explain__key">Explanation: </span>
                  <span className="io-explain__text">{ex.explanation}</span>
                </div>
              )}
            </div>
          );
        }

        // Fallback: show raw
        return (
          <div key={i} className="io-example">
            <div className="io-example__num">Example {i + 1}</div>
            <pre className="io-raw">{ex.raw}</pre>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SVG Icons
═══════════════════════════════════════════ */
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
const ExternalLinkIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* ═══════════════════════════════════════════
   LeetCode search URL
═══════════════════════════════════════════ */
function getLeetCodeUrl(title) {
  const encoded = encodeURIComponent(title.replace(/\s+/g, '+'));
  return `https://leetcode.com/problemset/?search=${encoded}`;
}

/* ═══════════════════════════════════════════
   Problem Page
═══════════════════════════════════════════ */
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

  const activePosIdx = ACTIVE_PROBLEMS.findIndex(p => p.id === problem.id);
  const posLabel = activePosIdx >= 0
    ? `${activePosIdx + 1} of ${ACTIVE_PROBLEMS.length}`
    : '';

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

      {/* ── Top bar ── */}
      <div className="prob-topbar">
        <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)} style={{ gap: 6 }}>
          <ArrowLeft /> Back
        </button>
        {posLabel && <span className="prob-counter">Problem {posLabel}</span>}
      </div>

      {/* ── Breadcrumb ── */}
      <Breadcrumb items={[
        { label: problem.topicDisplay, to: `/topics/${problem.topic}` },
        { label: problem.title },
      ]} />

      {/* ── Title + meta ── */}
      <div className="prob-title-section">
        <h1 className="prob-detail__title">{problem.title}</h1>
        <div className="prob-meta">
          <span className={`diff-badge diff-badge--${problem.difficulty}`}>{problem.difficulty}</span>
          <Link to={`/topics/${problem.topic}`} className="topic-link">{problem.topicDisplay}</Link>
          {problem.subtopic && <span className="prob-sub">· {problem.subtopic}</span>}

          {/* LeetCode link on every problem */}
          <a
            href={getLeetCodeUrl(problem.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="leetcode-link"
            title={`Search "${problem.title}" on LeetCode`}
          >
            <span className="leetcode-link__icon">LC</span>
            LeetCode
            <ExternalLinkIcon />
          </a>
        </div>

        {(problem.tags || []).length > 0 && (
          <div className="tags-row" style={{ marginTop: 8 }}>
            {problem.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
      </div>

      {/* ── Action buttons ── */}
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

      {/* ── Prev / Next navigation ── */}
      <ProbNav prev={prev} next={next} navigate={navigate} problem={problem} />

      {/* ── Problem Statement ── */}
      {problem.problemStatement && (
        <div className="card content-card">
          <div className="section-heading">Problem Statement</div>
          <ContentBody text={problem.problemStatement} />
        </div>
      )}

      {/* ── Input / Output Examples (all problems) ── */}
      <ExamplesSection problem={problem} />

      {/* ── Intuition ── */}
      {problem.intuition && (
        <div className="card content-card">
          <div className="section-heading">Intuition &amp; Approach</div>
          <ContentBody text={problem.intuition} />
        </div>
      )}

      {/* ── Algorithm Steps ── */}
      {problem.approach && (
        <div className="card content-card">
          <div className="section-heading">Algorithm Steps</div>
          <ContentBody text={problem.approach} />
        </div>
      )}

      {/* ── Code ── */}
      <div className="content-card">
        <div className="section-heading" style={{ marginBottom: 12 }}>Solution</div>
        <CodeBlock
          pythonCode={problem.pythonCode}
          javaCode={problem.javaCode}
          hasPython={problem.hasPython}
          hasJava={problem.hasJava}
        />
      </div>

      {/* ── Complexity ── */}
      {(problem.timeComplexity || problem.spaceComplexity) && (
        <div className="card content-card">
          <div className="section-heading">Complexity Analysis</div>
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
        </div>
      )}

      {/* ── Bottom nav ── */}
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

// =============================================
// pages/Bookmarks.jsx
// =============================================
import { useMemo } from 'react';
import ProblemList from '../components/ProblemList.jsx';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';
import { useApp } from '../context/AppContext.jsx';

export default function Bookmarks() {
  const { bookmarks } = useApp();
  const bmSet    = useMemo(() => new Set(bookmarks), [bookmarks]);
  const problems = useMemo(() => ACTIVE_PROBLEMS.filter(p => bmSet.has(p.id)), [bmSet]);

  return <ProblemList problems={problems} title="Bookmarks" />;
}

// =============================================
// pages/CompletedProblems.jsx
// =============================================
import { useMemo } from 'react';
import ProblemList from '../components/ProblemList.jsx';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';
import { useApp } from '../context/AppContext.jsx';

export default function CompletedProblems() {
  const { completed } = useApp();
  const doneSet  = useMemo(() => new Set(completed), [completed]);
  const problems = useMemo(() => ACTIVE_PROBLEMS.filter(p => doneSet.has(p.id)), [doneSet]);

  return <ProblemList problems={problems} title="Completed Problems" />;
}

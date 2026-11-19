// =============================================
// pages/AllProblems.jsx
// =============================================
import ProblemList from '../components/ProblemList.jsx';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';

export default function AllProblems() {
  return <ProblemList problems={ACTIVE_PROBLEMS} title="All Problems" />;
}

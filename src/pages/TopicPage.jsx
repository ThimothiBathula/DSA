import { useParams, Navigate } from 'react-router-dom';
import ProblemList from '../components/ProblemList.jsx';
import { TOPIC_DISPLAY, TOPICS_DATA } from '../data/problems.js';
import { ACTIVE_PROBLEMS } from '../data/activeProblems.js';

export default function TopicPage() {
  const { topicSlug } = useParams();

  const topicInfo = TOPICS_DATA.find(t => t.slug === topicSlug);
  if (!topicInfo) return <Navigate to="/404" replace />;

  const problems = ACTIVE_PROBLEMS.filter(p => p.topic === topicSlug);
  const display  = TOPIC_DISPLAY[topicSlug] || topicSlug;

  return (
    <ProblemList
      problems={problems}
      title={display}
      icon={topicInfo.icon}
      topicSlug={topicSlug}
    />
  );
}

// =============================================
// components/Breadcrumb.jsx — Premium redesign
// =============================================
import { Link } from 'react-router-dom';

const ChevronRight = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function Breadcrumb({ items = [] }) {
  const all = [{ label: 'Home', to: '/' }, ...items];

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {all.map((item, i) => {
        const isLast = i === all.length - 1;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && (
              <span className="breadcrumb__sep" aria-hidden="true">
                <ChevronRight />
              </span>
            )}
            {isLast || !item.to ? (
              <span className="breadcrumb__current" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="breadcrumb__link">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

// =============================================
// pages/NotFound.jsx — Premium redesign
// =============================================
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-enter notfound">
      <div className="notfound__code">404</div>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn--primary" onClick={() => navigate('/')}>
          Go to Dashboard
        </button>
        <button className="btn btn--outline" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}

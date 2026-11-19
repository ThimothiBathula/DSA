// =============================================
// components/Toast.jsx — Works with AppContext's single toast state
// =============================================
import { useApp } from '../context/AppContext.jsx';

const icons = {
  success: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

const toastColors = {
  success: 'var(--green)',
  info:    'var(--accent)',
  warning: 'var(--amber)',
};

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const type  = toast.type || 'info';
  const color = toastColors[type] || 'var(--accent)';

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      <div className={`toast toast--${type}`} style={{ borderLeftColor: color }}>
        <span style={{ color, flexShrink: 0 }}>{icons[type] || icons.info}</span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
          {toast.message}
        </span>
      </div>
    </div>
  );
}

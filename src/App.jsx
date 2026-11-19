// =============================================
// App.jsx
// =============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppProvider }    from './context/AppContext.jsx';
import Sidebar  from './components/Sidebar.jsx';
import Navbar   from './components/Navbar.jsx';
import Toast    from './components/Toast.jsx';
import './styles/global.css';
import './styles/layout.css';
import './styles/responsive.css';
import './styles/components.css';

/* ── Lazy-loaded pages ── */
const Dashboard         = lazy(() => import('./pages/Dashboard.jsx'));
const AllProblems       = lazy(() => import('./pages/AllProblems.jsx'));
const TopicPage         = lazy(() => import('./pages/TopicPage.jsx'));
const ProblemPage       = lazy(() => import('./pages/ProblemPage.jsx'));
const Bookmarks         = lazy(() => import('./pages/Bookmarks.jsx'));
const CompletedProblems = lazy(() => import('./pages/CompletedProblems.jsx'));
const NotFound          = lazy(() => import('./pages/NotFound.jsx'));

function PageShell({ children }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 12 }}>
        <div className="spinner" />
        <span style={{ color: 'var(--color-text-muted)' }}>Loading…</span>
      </div>
    }>
      {children}
    </Suspense>
  );
}

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-area">
          <Routes>
            <Route path="/"           element={<PageShell><Dashboard /></PageShell>} />
            <Route path="/problems"   element={<PageShell><AllProblems /></PageShell>} />
            <Route path="/topics/:topicSlug" element={<PageShell><TopicPage /></PageShell>} />
            <Route path="/problem/:problemId" element={<PageShell><ProblemPage /></PageShell>} />
            <Route path="/bookmarks"  element={<PageShell><Bookmarks /></PageShell>} />
            <Route path="/completed"  element={<PageShell><CompletedProblems /></PageShell>} />
            <Route path="/404"        element={<PageShell><NotFound /></PageShell>} />
            <Route path="*"           element={<PageShell><NotFound /></PageShell>} />
          </Routes>
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}

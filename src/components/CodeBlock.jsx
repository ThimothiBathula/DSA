// =============================================
// components/CodeBlock.jsx — Premium redesign
// =============================================
import { useState, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import java   from 'highlight.js/lib/languages/java';
import { storage } from '../utils/storage.js';
import { useApp }  from '../context/AppContext.jsx';

hljs.registerLanguage('python', python);
hljs.registerLanguage('java',   java);

function highlightCode(code, lang) {
  try {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  } catch {
    return code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function CodeBlock({ pythonCode, javaCode, hasPython, hasJava }) {
  const { showToast } = useApp();
  const [activeLang, setActiveLang] = useState(() => storage.getLang());
  const [copied,     setCopied]     = useState(false);
  const codeRef = useRef(null);

  const switchLang = (lang) => {
    setActiveLang(lang);
    storage.setLang(lang);
  };

  const handleCopy = async () => {
    const code = activeLang === 'python' ? pythonCode : javaCode;
    if (!code) { showToast('No code to copy', 'warning'); return; }
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const pre = codeRef.current;
      if (pre) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      }
    }
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCode = activeLang === 'python' ? pythonCode : javaCode;
  const hasCode     = activeLang === 'python' ? hasPython  : hasJava;

  const highlighted = hasCode && currentCode
    ? highlightCode(currentCode, activeLang)
    : '';

  return (
    <div className="code-section">
      {/* Tabs bar */}
      <div className="code-tabs-bar">
        {/* Python tab */}
        <button
          className={`code-tab-btn${activeLang === 'python' ? ' active' : ''}`}
          onClick={() => switchLang('python')}
        >
          <span className="lang-dot lang-dot--py" />
          Python
          {!hasPython && <span className="code-tab-na">(N/A)</span>}
        </button>

        {/* Java tab */}
        <button
          className={`code-tab-btn${activeLang === 'java' ? ' active' : ''}`}
          onClick={() => switchLang('java')}
        >
          <span className="lang-dot lang-dot--java" />
          Java
          {!hasJava && <span className="code-tab-na">(N/A)</span>}
        </button>

        {/* Actions */}
        <div className="code-actions-bar">
          <button
            className={`btn btn--sm${copied ? ' btn--completed' : ' btn--outline'}`}
            onClick={handleCopy}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code panel */}
      {hasCode && currentCode ? (
        <pre
          className="code-block"
          ref={codeRef}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <div className="code-unavailable">
          <div className="code-unavailable__icon">⚠</div>
          <p>{activeLang === 'python' ? 'Python' : 'Java'} solution is not available for this problem.</p>
        </div>
      )}
    </div>
  );
}

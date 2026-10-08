import React from 'react';
import { Sparkles, Layers, Activity, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function Navbar({ isBackendLive, onOpenArchitecture, theme, toggleTheme }) {
  return (
    <nav className="navbar navbar-expand-lg border-bottom py-3 sticky-top" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)' }}>
      <div className="container">
        {/* Brand */}
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div className="fw-bold fs-5 lh-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>HireScope AI</span>
              <span className="badge brand-badge small px-2 py-1" style={{ fontSize: '0.65rem' }}>AI Screener</span>
            </div>
            <span className="small" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
              Spring Boot 3 &bull; React 18 &bull; SSE Streaming &bull; OpenAI
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="d-flex align-items-center gap-2 gap-md-3 mt-3 mt-lg-0">
          {/* Backend Health Badge */}
          <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{
            background: isBackendLive ? 'rgba(16, 185, 129, 0.08)' : 'var(--brand-subtle)',
            border: `1px solid ${isBackendLive ? 'rgba(16, 185, 129, 0.25)' : 'var(--brand-border)'}`
          }}>
            <span className="rounded-circle" style={{
              width: '8px',
              height: '8px',
              backgroundColor: isBackendLive ? '#10b981' : 'var(--brand-indigo)',
              boxShadow: `0 0 6px ${isBackendLive ? '#10b981' : 'var(--brand-indigo)'}`
            }} />
            <span className="small fw-semibold" style={{ color: isBackendLive ? '#059669' : 'var(--brand-indigo)', fontSize: '0.75rem' }}>
              {isBackendLive ? 'Spring Boot API Live' : 'Demo Mode'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? (
              <>
                <Moon size={15} style={{ color: '#4f46e5' }} />
                <span className="small d-none d-md-inline" style={{ fontSize: '0.78rem' }}>Dark</span>
              </>
            ) : (
              <>
                <Sun size={15} style={{ color: '#f59e0b' }} />
                <span className="small d-none d-md-inline" style={{ fontSize: '0.78rem' }}>Light</span>
              </>
            )}
          </button>

          {/* Architecture Modal Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-nav)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Layers size={14} style={{ color: 'var(--brand-indigo)' }} />
            <span className="d-none d-sm-inline">Architecture</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/ganesh-badar/ai-resume-screener-ats"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-nav)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="d-none d-sm-inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

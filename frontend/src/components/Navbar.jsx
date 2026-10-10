import React from 'react';
import { FileCheck2, Layers, Globe, Shield, Scale, Sun, Moon } from 'lucide-react';

export default function Navbar({
  isBackendLive,
  onOpenArchitecture,
  onOpenDomain,
  onOpenPrivacy,
  onOpenTerms,
  theme,
  toggleTheme
}) {
  return (
    <nav className="navbar navbar-expand-lg border-bottom py-2 sticky-top" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)' }}>
      <div className="container">
        {/* Brand */}
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 border rounded-1 d-flex align-items-center justify-content-center" style={{ background: 'var(--brand-navy)', borderColor: 'var(--border-strong)', color: '#FFFFFF' }}>
            <FileCheck2 size={18} />
          </div>
          <div>
            <div className="fw-bold fs-6 lh-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>HireScope ATS</span>
              <span className="badge technical-badge" style={{ color: 'var(--brand-primary)', borderColor: 'var(--brand-border)', background: 'var(--brand-subtle)' }}>
                Enterprise Screener
              </span>
            </div>
            <span className="code-font" style={{ color: 'var(--text-muted)', fontSize: '0.70rem' }}>
              Spring Boot 3.3.4 &bull; React 18 &bull; SSE Streaming &bull; PDFBox 3.x
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mt-lg-0">
          {/* Backend Status Indicator */}
          <div className="d-flex align-items-center gap-2 px-2 py-1 border rounded-1" style={{
            background: isBackendLive ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
            borderColor: isBackendLive ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '1px',
              backgroundColor: isBackendLive ? '#10b981' : '#0284c7'
            }} />
            <span className="code-font fw-semibold" style={{ color: isBackendLive ? '#059669' : 'var(--text-secondary)', fontSize: '0.72rem' }}>
              {isBackendLive ? 'API LIVE: 8080' : 'STANDALONE MODE'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-brand-outline d-flex align-items-center gap-1 py-1 px-2"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle color theme"
            style={{ fontSize: '0.76rem' }}
          >
            {theme === 'light' ? (
              <>
                <Moon size={13} style={{ color: 'var(--text-secondary)' }} />
                <span className="d-none d-md-inline">Dark</span>
              </>
            ) : (
              <>
                <Sun size={13} style={{ color: '#f59e0b' }} />
                <span className="d-none d-md-inline">Light</span>
              </>
            )}
          </button>

          {/* Custom Domain Trigger */}
          <button
            onClick={onOpenDomain}
            className="btn btn-sm btn-brand-outline d-flex align-items-center gap-1 py-1 px-2"
            style={{ fontSize: '0.76rem' }}
            title="Custom Domain & DNS Status"
          >
            <Globe size={13} style={{ color: 'var(--brand-primary)' }} />
            <span className="d-none d-sm-inline">Domain</span>
          </button>

          {/* Architecture Modal Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="btn btn-sm btn-brand-outline d-flex align-items-center gap-1 py-1 px-2"
            style={{ fontSize: '0.76rem' }}
            title="System Architecture & Concurrency"
          >
            <Layers size={13} style={{ color: 'var(--brand-primary)' }} />
            <span className="d-none d-sm-inline">Architecture</span>
          </button>

          {/* Privacy Policy Trigger */}
          <button
            onClick={onOpenPrivacy}
            className="btn btn-sm btn-brand-outline d-flex align-items-center gap-1 py-1 px-2"
            style={{ fontSize: '0.76rem' }}
            title="Candidate Privacy Policy"
          >
            <Shield size={13} style={{ color: 'var(--text-secondary)' }} />
            <span className="d-none d-md-inline">Privacy</span>
          </button>

          {/* Terms Trigger */}
          <button
            onClick={onOpenTerms}
            className="btn btn-sm btn-brand-outline d-flex align-items-center gap-1 py-1 px-2"
            style={{ fontSize: '0.76rem' }}
            title="Terms of Service"
          >
            <Scale size={13} style={{ color: 'var(--text-secondary)' }} />
            <span className="d-none d-md-inline">Terms</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/ganesh-badar/ai-resume-screener-ats"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-brand-solid d-flex align-items-center gap-1 py-1 px-2"
            style={{ fontSize: '0.76rem' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="d-none d-sm-inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

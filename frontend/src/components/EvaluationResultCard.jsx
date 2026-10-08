import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Clock, RefreshCw, FileText, Sparkles } from 'lucide-react';

export default function EvaluationResultCard({ result, onReset }) {
  if (!result) return null;

  const score = result.score || 0;
  const isHighMatch = score >= 80;
  const isMediumMatch = score >= 60 && score < 80;

  const scoreColor = isHighMatch ? '#059669' : isMediumMatch ? '#d97706' : '#dc2626';
  const scoreBadgeBg = isHighMatch
    ? 'rgba(16, 185, 129, 0.12)'
    : isMediumMatch
    ? 'rgba(245, 158, 11, 0.12)'
    : 'rgba(239, 68, 68, 0.12)';

  return (
    <div className="glass-panel p-4 mb-4">
      {/* Top Banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-circle" style={{ background: scoreBadgeBg, color: scoreColor }}>
            <Award size={24} />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>AI Candidate Evaluation Complete</h5>
            <span className="small" style={{ color: 'var(--text-secondary)' }}>
              Evaluated against <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{result.jobTitle || 'Target Role'}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="btn btn-sm d-flex align-items-center gap-1 shadow-sm"
          style={{
            fontSize: '0.78rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-nav)'
          }}
        >
          <RefreshCw size={13} />
          <span>Screen Another Resume</span>
        </button>
      </div>

      <div className="row g-4 align-items-center mb-4">
        {/* Score Meter Column */}
        <div className="col-md-4 text-center">
          <div
            className="p-4 rounded-4 d-inline-flex flex-column align-items-center justify-content-center shadow-sm"
            style={{
              background: 'var(--bg-card)',
              border: `2px solid ${scoreColor}`,
              minWidth: '180px',
              minHeight: '180px',
              boxShadow: `0 10px 30px -5px ${scoreColor}22`
            }}
          >
            <span className="small fw-bold text-uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Match Score
            </span>
            <div className="display-4 fw-bold my-1" style={{ color: scoreColor }}>
              {score}%
            </div>
            <span
              className="badge px-3 py-1 rounded-pill small"
              style={{ background: scoreBadgeBg, color: scoreColor, fontSize: '0.75rem' }}
            >
              {isHighMatch ? 'High Alignment' : isMediumMatch ? 'Moderate Match' : 'Low Relevance'}
            </span>
          </div>
        </div>

        {/* Executive Summary Column */}
        <div className="col-md-8">
          <div className="p-3 rounded-3" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
            <div className="fw-bold small mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sparkles size={14} style={{ color: 'var(--brand-purple)' }} />
              <span>Executive Feedback Summary</span>
            </div>
            <p className="small mb-0" style={{ color: 'var(--text-nav)', lineHeight: 1.6, fontSize: '0.88rem' }}>
              {result.feedback}
            </p>
          </div>

          <div className="mt-3 d-flex flex-wrap align-items-center gap-3 small code-font" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <span>ID: {result.evaluationId || 'N/A'}</span>
            <span>&bull;</span>
            <span className="d-flex align-items-center gap-1">
              <Clock size={12} />
              SSE Real-Time Push Verified
            </span>
          </div>
        </div>
      </div>

      {/* Strengths & Gaps Breakdown */}
      <div className="row g-3">
        {result.strengths && result.strengths.length > 0 && (
          <div className="col-md-6">
            <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div className="fw-bold small mb-2 d-flex align-items-center gap-2" style={{ color: '#059669' }}>
                <CheckCircle2 size={15} />
                <span>Identified Strengths &amp; Proficiencies</span>
              </div>
              <ul className="list-unstyled mb-0 small">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    <span style={{ color: '#059669' }}>&bull;</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {result.gaps && result.gaps.length > 0 && (
          <div className="col-md-6">
            <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <div className="fw-bold small mb-2 d-flex align-items-center gap-2" style={{ color: '#d97706' }}>
                <AlertTriangle size={15} />
                <span>Areas for Clarification / Missing Gaps</span>
              </div>
              <ul className="list-unstyled mb-0 small">
                {result.gaps.map((gap, idx) => (
                  <li key={idx} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    <span style={{ color: '#d97706' }}>&bull;</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Clock, RefreshCw, FileText, Sparkles } from 'lucide-react';

export default function EvaluationResultCard({ result, onReset }) {
  if (!result) return null;

  const score = result.score || 0;
  const isHighMatch = score >= 80;
  const isMediumMatch = score >= 60 && score < 80;

  const scoreColor = isHighMatch ? '#10b981' : isMediumMatch ? '#f59e0b' : '#ef4444';
  const scoreBadgeBg = isHighMatch
    ? 'rgba(16, 185, 129, 0.15)'
    : isMediumMatch
    ? 'rgba(245, 158, 11, 0.15)'
    : 'rgba(239, 68, 68, 0.15)';

  return (
    <div className="glass-panel p-4 mb-4 border border-secondary border-opacity-30">
      {/* Top Banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom border-secondary border-opacity-20">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-circle" style={{ background: scoreBadgeBg, color: scoreColor }}>
            <Award size={24} />
          </div>
          <div>
            <h5 className="fw-bold text-white mb-0">AI Candidate Evaluation Complete</h5>
            <span className="text-secondary small">
              Evaluated against <span className="text-white fw-semibold">{result.jobTitle || 'Target Role'}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 text-white border-secondary"
          style={{ fontSize: '0.78rem' }}
        >
          <RefreshCw size={13} />
          <span>Screen Another Resume</span>
        </button>
      </div>

      <div className="row g-4 align-items-center mb-4">
        {/* Score Meter Column */}
        <div className="col-md-4 text-center">
          <div
            className="p-4 rounded-4 d-inline-flex flex-column align-items-center justify-content-center"
            style={{
              background: '#0b1120',
              border: `2px solid ${scoreColor}`,
              minWidth: '180px',
              minHeight: '180px',
              boxShadow: `0 0 30px ${scoreColor}33`
            }}
          >
            <span className="text-secondary small fw-bold text-uppercase tracking-wider">
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
          <div className="p-3 rounded-3" style={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="fw-bold text-white small mb-2 d-flex align-items-center gap-2">
              <Sparkles size={14} className="text-warning" />
              <span>Executive Feedback Summary</span>
            </div>
            <p className="text-secondary small mb-0" style={{ lineHeight: 1.6, fontSize: '0.85rem' }}>
              {result.feedback}
            </p>
          </div>

          <div className="mt-3 d-flex flex-wrap align-items-center gap-3 text-secondary small code-font" style={{ fontSize: '0.72rem' }}>
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
            <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="fw-bold text-success small mb-2 d-flex align-items-center gap-2">
                <CheckCircle2 size={15} />
                <span>Identified Strengths &amp; Proficiencies</span>
              </div>
              <ul className="list-unstyled mb-0 small text-secondary">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '0.8rem' }}>
                    <span className="text-success">&bull;</span>
                    <span className="text-light">{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {result.gaps && result.gaps.length > 0 && (
          <div className="col-md-6">
            <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div className="fw-bold text-warning small mb-2 d-flex align-items-center gap-2">
                <AlertTriangle size={15} />
                <span>Areas for Clarification / Missing Gaps</span>
              </div>
              <ul className="list-unstyled mb-0 small text-secondary">
                {result.gaps.map((gap, idx) => (
                  <li key={idx} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '0.8rem' }}>
                    <span className="text-warning">&bull;</span>
                    <span className="text-light">{gap}</span>
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

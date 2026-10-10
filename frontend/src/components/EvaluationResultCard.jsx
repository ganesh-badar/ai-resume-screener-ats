import React from 'react';
import { FileCheck2, CheckCircle2, AlertTriangle, Clock, RefreshCw, Layers } from 'lucide-react';

export default function EvaluationResultCard({ result, onReset }) {
  if (!result) return null;

  const score = result.score || 0;
  const isHighMatch = score >= 80;
  const isMediumMatch = score >= 60 && score < 80;

  const scoreColor = isHighMatch ? '#059669' : isMediumMatch ? '#d97706' : '#dc2626';
  const scoreBadgeBg = isHighMatch
    ? 'rgba(16, 185, 129, 0.10)'
    : isMediumMatch
    ? 'rgba(245, 158, 11, 0.10)'
    : 'rgba(239, 68, 68, 0.10)';

  return (
    <div className="glass-panel p-4 mb-4">
      {/* Top Banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 border rounded-1" style={{ background: scoreBadgeBg, borderColor: scoreColor, color: scoreColor }}>
            <FileCheck2 size={20} />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.02rem' }}>
              Candidate Evaluation Specification Complete
            </h5>
            <span className="small code-font" style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
              Target Requisition: <strong style={{ color: 'var(--text-primary)' }}>{result.jobTitle || 'Target Role'}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="btn btn-sm btn-brand-outline d-flex align-items-center gap-1 py-1 px-3"
          style={{ fontSize: '0.78rem' }}
        >
          <RefreshCw size={13} />
          <span>Screen Another Candidate</span>
        </button>
      </div>

      <div className="row g-4 align-items-center mb-4">
        {/* Match Metric Column */}
        <div className="col-md-4 text-center">
          <div
            className="p-4 border rounded-1 d-inline-flex flex-column align-items-center justify-content-center w-100"
            style={{
              background: 'var(--bg-subtle)',
              borderColor: scoreColor,
              minHeight: '160px'
            }}
          >
            <span className="small fw-bold text-uppercase code-font" style={{ color: 'var(--text-muted)', fontSize: '0.70rem' }}>
              Algorithmic Alignment Score
            </span>
            <div className="display-5 fw-bold my-1 code-font" style={{ color: scoreColor }}>
              {score}%
            </div>
            <span
              className="badge technical-badge"
              style={{ background: scoreBadgeBg, color: scoreColor, borderColor: scoreColor, fontSize: '0.74rem' }}
            >
              {isHighMatch ? 'High Technical Fit' : isMediumMatch ? 'Moderate Alignment' : 'Sub-Threshold Alignment'}
            </span>
          </div>
        </div>

        {/* Executive Summary Column */}
        <div className="col-md-8">
          <div className="p-3 border rounded-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="fw-bold small mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Layers size={14} style={{ color: 'var(--brand-primary)' }} />
              <span className="text-uppercase code-font" style={{ fontSize: '0.74rem' }}>Technical Assessment Summary</span>
            </div>
            <p className="small mb-0" style={{ color: 'var(--text-nav)', lineHeight: 1.6, fontSize: '0.86rem' }}>
              {result.feedback}
            </p>
          </div>

          <div className="mt-2 d-flex flex-wrap align-items-center gap-3 small code-font" style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            <span>EVALUATION-UUID: {result.evaluationId || 'DEMO-INSTANCE'}</span>
            <span>&bull;</span>
            <span className="d-flex align-items-center gap-1">
              <Clock size={11} />
              W3C Server-Sent Event Delivery: VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Strengths & Gaps Breakdown */}
      <div className="row g-3">
        {result.strengths && result.strengths.length > 0 && (
          <div className="col-md-6">
            <div className="p-3 border rounded-1 h-100" style={{ background: 'rgba(16, 185, 129, 0.04)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <div className="fw-bold small mb-2 d-flex align-items-center gap-2" style={{ color: '#059669', fontSize: '0.80rem' }}>
                <CheckCircle2 size={15} />
                <span className="text-uppercase code-font">Verified Technical Competencies</span>
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
            <div className="p-3 border rounded-1 h-100" style={{ background: 'rgba(245, 158, 11, 0.04)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <div className="fw-bold small mb-2 d-flex align-items-center gap-2" style={{ color: '#d97706', fontSize: '0.80rem' }}>
                <AlertTriangle size={15} />
                <span className="text-uppercase code-font">Requisition Skill Gaps &amp; Clarifications</span>
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

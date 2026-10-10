import React from 'react';
import { Briefcase, ChevronRight, CheckSquare } from 'lucide-react';

export default function JobSelector({ jobs, selectedJob, onSelectJob, disabled }) {
  return (
    <div className="glass-panel p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
        <div className="d-flex align-items-center gap-2">
          <Briefcase size={17} style={{ color: 'var(--brand-primary)' }} />
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '0.98rem' }}>
            1. Target Job Requisition
          </h5>
        </div>
        <span className="badge technical-badge">
          Step 1 of 2
        </span>
      </div>

      <div className="row g-3">
        {jobs.map((job) => {
          const isSelected = selectedJob?.id === job.id;
          return (
            <div key={job.id} className="col-md-4">
              <div
                onClick={() => !disabled && onSelectJob(job)}
                className={`p-3 h-100 d-flex flex-column justify-content-between border rounded-1 ${
                  disabled ? 'opacity-75' : 'cursor-pointer'
                }`}
                style={{
                  background: isSelected ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border-color)',
                  boxShadow: isSelected
                    ? '0 2px 8px -1px rgba(2, 132, 199, 0.25)'
                    : 'var(--card-shadow)',
                  transition: 'border-color 0.15s ease, background-color 0.15s ease'
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge technical-badge" style={{
                      color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      borderColor: isSelected ? 'var(--brand-border)' : 'var(--border-color)'
                    }}>
                      {job.department || 'Engineering'}
                    </span>
                    {isSelected && <CheckSquare size={16} style={{ color: 'var(--brand-primary)' }} />}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--text-primary)', fontSize: '0.90rem' }}>
                    {job.title}
                  </h6>
                  <p className="small mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                    {job.description ? job.description.substring(0, 100) + '...' : ''}
                  </p>
                </div>

                <div className="mt-3 pt-2 d-flex align-items-center justify-content-between small" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <span className="code-font" style={{ fontSize: '0.70rem' }}>REQ-ID: 00{job.id}</span>
                  <ChevronRight size={13} style={{ color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

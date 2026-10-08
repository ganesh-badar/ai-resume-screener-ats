import React from 'react';
import { Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function JobSelector({ jobs, selectedJob, onSelectJob, disabled }) {
  return (
    <div className="glass-panel p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Briefcase size={18} style={{ color: 'var(--brand-indigo)' }} />
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>1. Select Target Job Requisition</h5>
        </div>
        <span className="badge small px-2 py-1" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
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
                className={`p-3 rounded-3 h-100 d-flex flex-column justify-content-between ${
                  disabled ? 'opacity-75' : 'cursor-pointer'
                }`}
                style={{
                  background: 'var(--bg-card)',
                  border: isSelected ? '2px solid var(--brand-indigo)' : '1.5px solid var(--border-color)',
                  boxShadow: isSelected
                    ? '0 10px 25px -5px rgba(79, 70, 229, 0.22), 0 0 0 1px var(--brand-indigo)'
                    : 'var(--card-shadow)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge small px-2 py-1" style={{
                      background: 'var(--brand-subtle)',
                      color: 'var(--brand-indigo)',
                      border: '1px solid var(--brand-border)',
                      fontSize: '0.68rem'
                    }}>
                      {job.department || 'Engineering'}
                    </span>
                    {isSelected && <CheckCircle2 size={16} style={{ color: 'var(--brand-indigo)' }} />}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    {job.title}
                  </h6>
                  <p className="small mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.45 }}>
                    {job.description ? job.description.substring(0, 95) + '...' : ''}
                  </p>
                </div>

                <div className="mt-3 pt-2 d-flex align-items-center justify-content-between small" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '0.72rem' }}>Match against this JD</span>
                  <ChevronRight size={13} style={{ color: isSelected ? 'var(--brand-indigo)' : 'var(--text-muted)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

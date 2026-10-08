import React from 'react';
import { Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function JobSelector({ jobs, selectedJob, onSelectJob, disabled }) {
  return (
    <div className="glass-panel p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Briefcase size={18} style={{ color: '#4f46e5' }} />
          <h5 className="fw-bold mb-0" style={{ color: '#0f172a' }}>1. Select Target Job Requisition</h5>
        </div>
        <span className="badge small px-2 py-1" style={{ background: '#f1f5f9', color: '#64748b' }}>
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
                  background: isSelected ? '#ffffff' : '#ffffff',
                  border: isSelected ? '2px solid #4f46e5' : '1.5px solid #e2e8f0',
                  boxShadow: isSelected
                    ? '0 10px 25px -5px rgba(79, 70, 229, 0.18), 0 0 0 1px #4f46e5'
                    : '0 1px 3px rgba(15, 23, 42, 0.04)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge small px-2 py-1" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', border: '1px solid rgba(79, 70, 229, 0.2)', fontSize: '0.68rem' }}>
                      {job.department || 'Engineering'}
                    </span>
                    {isSelected && <CheckCircle2 size={16} style={{ color: '#4f46e5' }} />}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: '#0f172a', fontSize: '0.92rem' }}>
                    {job.title}
                  </h6>
                  <p className="small mb-0" style={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.45 }}>
                    {job.description ? job.description.substring(0, 95) + '...' : ''}
                  </p>
                </div>

                <div className="mt-3 pt-2 d-flex align-items-center justify-content-between small" style={{ borderTop: '1px solid #f1f5f9', color: '#64748b' }}>
                  <span style={{ fontSize: '0.72rem' }}>Match against this JD</span>
                  <ChevronRight size={13} style={{ color: isSelected ? '#4f46e5' : '#94a3b8' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

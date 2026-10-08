import React from 'react';
import { Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function JobSelector({ jobs, selectedJob, onSelectJob, disabled }) {
  return (
    <div className="glass-panel p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Briefcase size={18} className="text-info" />
          <h5 className="fw-bold mb-0 text-white">1. Select Target Job Requisition</h5>
        </div>
        <span className="badge bg-secondary bg-opacity-25 text-secondary small">
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
                  background: isSelected ? 'rgba(99, 102, 241, 0.16)' : '#0d1527',
                  border: `1.5px solid ${isSelected ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-25" style={{ fontSize: '0.68rem' }}>
                      {job.department || 'Engineering'}
                    </span>
                    {isSelected && <CheckCircle2 size={16} className="text-info" />}
                  </div>
                  <h6 className="fw-bold text-white mb-2" style={{ fontSize: '0.9rem' }}>
                    {job.title}
                  </h6>
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                    {job.description ? job.description.substring(0, 95) + '...' : ''}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-top border-secondary border-opacity-10 d-flex align-items-center justify-content-between small text-secondary">
                  <span style={{ fontSize: '0.7rem' }}>Match against this JD</span>
                  <ChevronRight size={13} className={isSelected ? 'text-primary-accent' : 'text-muted'} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

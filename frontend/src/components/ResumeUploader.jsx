import React, { useRef } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2, Play, Terminal } from 'lucide-react';
import { SAMPLE_RESUMES } from '../services/api';

export default function ResumeUploader({
  selectedFile,
  setSelectedFile,
  onUploadSubmit,
  streamingStatus,
  streamingStep,
  isProcessing,
  onLoadSampleResume
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('pdf')) {
        setSelectedFile(file);
      } else {
        alert('Please upload a PDF document.');
      }
    }
  };

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
        <div className="d-flex align-items-center gap-2">
          <UploadCloud size={17} style={{ color: 'var(--brand-primary)' }} />
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '0.98rem' }}>
            2. Ingest Candidate Resume (PDF Format)
          </h5>
        </div>
        <span className="badge technical-badge">
          Step 2 of 2
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        className={`dropzone mb-3 ${isProcessing ? 'opacity-50' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="d-none"
        />

        <div className="py-2">
          <div className="d-inline-flex p-3 border rounded-1 mb-2" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)', color: 'var(--brand-primary)' }}>
            <FileText size={28} />
          </div>

          {selectedFile ? (
            <div>
              <div className="fw-bold fs-6 mb-1 d-flex align-items-center justify-content-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} className="text-success" />
                <span className="code-font">{selectedFile.name}</span>
              </div>
              <p className="small mb-0 code-font" style={{ color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
                {(selectedFile.size ? (selectedFile.size / 1024).toFixed(1) + ' KB' : 'Standard Ingestion Sample')} &bull; Status: Ready for Parse
              </p>
            </div>
          ) : (
            <div>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                Drag and drop curriculum vitae (PDF) to initiate ingestion
              </h6>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                or click here to select a file from local filesystem
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preset 1-Click Verification Samples */}
      <div className="p-3 border rounded-1 mb-3" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="small fw-bold d-flex align-items-center gap-1" style={{ color: 'var(--text-nav)', fontSize: '0.76rem' }}>
            <Terminal size={13} style={{ color: 'var(--brand-primary)' }} />
            <span>Pre-Configured Benchmark Resumes (Immediate Evaluation):</span>
          </div>
          <span className="code-font" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>RFC 7231 Test Payloads</span>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => onLoadSampleResume(sample)}
              className="btn btn-sm btn-brand-outline text-start flex-fill py-2 px-3"
              style={{ fontSize: '0.78rem' }}
            >
              <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{sample.label}</div>
              <div className="code-font" style={{ color: 'var(--text-muted)', fontSize: '0.70rem' }}>{sample.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action / Streaming Bar */}
      {isProcessing ? (
        <div className="p-3 border rounded-1" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--brand-primary)' }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <Loader2 size={16} className="spinner-border spinner-border-sm" style={{ color: 'var(--brand-primary)' }} />
              <span className="fw-bold small code-font" style={{ color: 'var(--text-primary)' }}>
                SSE STREAM: {streamingStatus}
              </span>
            </div>
            <span className="badge technical-badge" style={{ color: 'var(--brand-primary)' }}>
              @Async ThreadPool Active
            </span>
          </div>
          <div className="small code-font" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            {streamingStep || "Ingesting document stream and establishing reactive connection..."}
          </div>
          <div className="progress mt-2" style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px' }}>
            <div
              className="progress-bar"
              style={{
                width: streamingStatus === 'PROCESSING' ? '70%' : '35%',
                background: 'var(--brand-primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={!selectedFile || isProcessing}
          onClick={onUploadSubmit}
          className="btn btn-brand-action w-100 d-flex align-items-center justify-content-center gap-2"
          style={{ fontSize: '0.88rem' }}
        >
          <Play size={16} />
          <span>Execute Resume Screening &amp; Stream Evaluation (HTTP 202 + SSE)</span>
        </button>
      )}
    </div>
  );
}

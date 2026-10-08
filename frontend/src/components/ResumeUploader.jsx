import React, { useRef } from 'react';
import { UploadCloud, FileText, Sparkles, Loader2, CheckCircle2, Zap } from 'lucide-react';
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
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <UploadCloud size={18} className="text-primary-accent" style={{ color: '#818cf8' }} />
          <h5 className="fw-bold mb-0 text-white">2. Upload Resume Document (PDF)</h5>
        </div>
        <span className="badge bg-secondary bg-opacity-25 text-secondary small">
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
          <div className="d-inline-flex p-3 rounded-circle mb-2" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <FileText size={32} />
          </div>

          {selectedFile ? (
            <div>
              <div className="fw-bold text-white fs-6 mb-1 d-flex align-items-center justify-content-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                <span>{selectedFile.name}</span>
              </div>
              <p className="text-secondary small mb-0">
                {(selectedFile.size ? (selectedFile.size / 1024).toFixed(1) + ' KB' : 'Preset sample')} &bull; Ready for screening
              </p>
            </div>
          ) : (
            <div>
              <h6 className="fw-bold text-white mb-1">
                Drag &amp; drop candidate resume (PDF) here
              </h6>
              <p className="text-secondary small mb-0">
                or click to browse your local computer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preset 1-Click Samples for Instant Testing */}
      <div className="p-3 rounded-3 mb-4" style={{ background: '#0b1120', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="text-secondary small fw-bold d-flex align-items-center gap-1">
            <Zap size={14} className="text-warning" />
            <span>Instant Demo Samples (No local PDF needed):</span>
          </div>
          <span className="text-muted" style={{ fontSize: '0.68rem' }}>1-Click Load</span>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => onLoadSampleResume(sample)}
              className="btn btn-sm btn-outline-light text-start border-secondary border-opacity-25 flex-fill py-2 px-3"
              style={{ fontSize: '0.78rem', background: '#111827' }}
            >
              <div className="fw-bold text-white">{sample.label}</div>
              <div className="text-secondary" style={{ fontSize: '0.7rem' }}>{sample.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action / Streaming Bar */}
      {isProcessing ? (
        <div className="p-3 rounded-3 pulsing-border" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <Loader2 size={18} className="spinner-border spinner-border-sm text-primary-accent" />
              <span className="fw-bold text-white small">
                Real-Time SSE Streaming: {streamingStatus}
              </span>
            </div>
            <span className="badge bg-primary bg-opacity-50 text-white code-font" style={{ fontSize: '0.68rem' }}>
              @Async Worker Active
            </span>
          </div>
          <div className="text-secondary small" style={{ fontSize: '0.8rem' }}>
            {streamingStep || "Ingesting document stream and establishing reactive connection..."}
          </div>
          <div className="progress mt-2" style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              style={{ width: streamingStatus === 'PROCESSING' ? '70%' : '35%' }}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={!selectedFile || isProcessing}
          onClick={onUploadSubmit}
          className="btn btn-brand w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fs-6"
        >
          <Sparkles size={18} />
          <span>Screen Resume &amp; Generate Evaluation (HTTP 202 + SSE)</span>
        </button>
      )}
    </div>
  );
}

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
          <UploadCloud size={18} style={{ color: '#4f46e5' }} />
          <h5 className="fw-bold mb-0" style={{ color: '#0f172a' }}>2. Upload Resume Document (PDF)</h5>
        </div>
        <span className="badge small px-2 py-1" style={{ background: '#f1f5f9', color: '#64748b' }}>
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
          <div className="d-inline-flex p-3 rounded-circle mb-2" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5' }}>
            <FileText size={32} />
          </div>

          {selectedFile ? (
            <div>
              <div className="fw-bold fs-6 mb-1 d-flex align-items-center justify-content-center gap-2" style={{ color: '#0f172a' }}>
                <CheckCircle2 size={16} className="text-success" />
                <span>{selectedFile.name}</span>
              </div>
              <p className="small mb-0" style={{ color: '#64748b' }}>
                {(selectedFile.size ? (selectedFile.size / 1024).toFixed(1) + ' KB' : 'Preset sample')} &bull; Ready for screening
              </p>
            </div>
          ) : (
            <div>
              <h6 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
                Drag &amp; drop candidate resume (PDF) here
              </h6>
              <p className="small mb-0" style={{ color: '#64748b' }}>
                or click to browse your local computer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preset 1-Click Samples for Instant Testing */}
      <div className="p-3 rounded-3 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="small fw-bold d-flex align-items-center gap-1" style={{ color: '#334155' }}>
            <Zap size={14} style={{ color: '#f59e0b' }} />
            <span>Instant Demo Samples (No local PDF needed):</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>1-Click Load</span>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => onLoadSampleResume(sample)}
              className="btn btn-sm text-start flex-fill py-2 px-3 shadow-sm"
              style={{
                fontSize: '0.78rem',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="fw-semibold" style={{ color: '#0f172a' }}>{sample.label}</div>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{sample.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action / Streaming Bar */}
      {isProcessing ? (
        <div className="p-3 rounded-3 pulsing-border" style={{ background: 'rgba(79, 70, 229, 0.05)', border: '1.5px solid rgba(79, 70, 229, 0.35)' }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <Loader2 size={18} className="spinner-border spinner-border-sm" style={{ color: '#4f46e5' }} />
              <span className="fw-bold small" style={{ color: '#0f172a' }}>
                Real-Time SSE Streaming: {streamingStatus}
              </span>
            </div>
            <span className="badge px-2 py-1 code-font" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', border: '1px solid rgba(79, 70, 229, 0.2)', fontSize: '0.68rem' }}>
              @Async Worker Active
            </span>
          </div>
          <div className="small" style={{ color: '#475569', fontSize: '0.8rem' }}>
            {streamingStep || "Ingesting document stream and establishing reactive connection..."}
          </div>
          <div className="progress mt-2" style={{ height: '5px', background: '#e2e8f0' }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{
                width: streamingStatus === 'PROCESSING' ? '70%' : '35%',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
              }}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={!selectedFile || isProcessing}
          onClick={onUploadSubmit}
          className="btn btn-brand w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fs-6 shadow"
        >
          <Sparkles size={18} />
          <span>Screen Resume &amp; Generate Evaluation (HTTP 202 + SSE)</span>
        </button>
      )}
    </div>
  );
}

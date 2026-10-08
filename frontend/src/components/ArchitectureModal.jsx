import React from 'react';
import { X, Layers, Cpu, Database, Radio, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1080 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content glass-panel border border-secondary border-opacity-25 text-white" style={{ background: '#0a0f1d' }}>
          {/* Header */}
          <div className="modal-header border-bottom border-secondary border-opacity-25 px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                <Layers size={20} />
              </div>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0">System Architecture &amp; Engineering Decisions</h5>
                <span className="text-secondary small">Technical Design Breakdown for Software Engineering Interviews</span>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn-close btn-close-white" aria-label="Close" />
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-3" style={{ maxHeight: '70vh' }}>
            {/* 1. Core Workflow */}
            <div className="mb-4">
              <h6 className="fw-bold text-primary-accent mb-2 d-flex align-items-center gap-2" style={{ color: '#818cf8' }}>
                <Cpu size={16} />
                <span>1. Asynchronous Ingestion &amp; Real-Time Streaming Flow</span>
              </h6>
              <div className="p-3 rounded-3" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <ol className="small mb-0 text-secondary ps-3" style={{ lineHeight: 1.7 }}>
                  <li><strong className="text-white">Client Upload:</strong> React sends multi-part PDF resume + Job ID to Spring Boot.</li>
                  <li><strong className="text-white">Storage &amp; Metadata:</strong> Spring Boot uploads PDF bytes to S3/disk and saves record as <code className="text-warning">PENDING</code>.</li>
                  <li><strong className="text-white">HTTP 202 Accepted:</strong> Backend immediately returns 202 with an unguessable UUID <code className="text-info">evaluationId</code>.</li>
                  <li><strong className="text-white">SSE Connection:</strong> React opens a <code className="text-info">text/event-stream</code> connection on <code className="text-light">/api/resumes/stream/{'{evaluationId}'}</code>.</li>
                  <li><strong className="text-white">Background @Async Worker:</strong> Thread pool extracts text via Apache PDFBox 3.x and queries OpenAI <code className="text-primary-accent">gpt-4o-mini</code>.</li>
                  <li><strong className="text-white">Push Update:</strong> Evaluator updates DB to <code className="text-success">COMPLETED</code> and pushes result to client via SSE.</li>
                </ol>
              </div>
            </div>

            {/* 2. Key Architectural Decisions */}
            <div className="mb-4">
              <h6 className="fw-bold text-primary-accent mb-2 d-flex align-items-center gap-2" style={{ color: '#818cf8' }}>
                <Radio size={16} />
                <span>2. Why Server-Sent Events (SSE) over WebSockets?</span>
              </h6>
              <div className="p-3 rounded-3 small text-secondary" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.6 }}>
                WebSockets are bidirectional and protocol-heavy (requiring connection upgrade handshakes, custom ping/pong heartbeats, and sticky sessions). In our ATS use-case, the data flow is strictly <strong>unidirectional (server &rarr; client)</strong>. SSE operates over standard HTTP, works seamlessly behind corporate proxies, natively supports browser reconnects (<code className="text-info">EventSource</code>), and drastically reduces operational complexity.
              </div>
            </div>

            {/* 3. Thread Pool Backpressure */}
            <div className="mb-3">
              <h6 className="fw-bold text-primary-accent mb-2 d-flex align-items-center gap-2" style={{ color: '#818cf8' }}>
                <Database size={16} />
                <span>3. Bounded Thread Pools &amp; Resource Protection</span>
              </h6>
              <div className="p-3 rounded-3 small text-secondary" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.6 }}>
                Rather than using Spring's default <code className="text-danger">SimpleAsyncTaskExecutor</code> (which spawns an unbounded thread per request risking OOM under traffic spikes), we configure a bounded <code className="text-white">ThreadPoolTaskExecutor</code> (Core: 5, Max: 20, Queue: 100) with <code className="text-warning">CallerRunsPolicy</code> for natural backpressure.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary border-opacity-25 px-4 py-2">
            <button type="button" onClick={onClose} className="btn btn-sm btn-brand px-3">
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

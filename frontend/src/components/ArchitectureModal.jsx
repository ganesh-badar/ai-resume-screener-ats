import React from 'react';
import { X, Layers, Cpu, Database, Radio, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'var(--modal-backdrop)', zIndex: 1080 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border shadow-lg" style={{ background: 'var(--modal-bg)', borderColor: 'var(--border-color)' }}>
          {/* Header */}
          <div className="modal-header px-4 py-3 border-bottom" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
                <Layers size={20} />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>System Architecture &amp; Engineering Decisions</h5>
                <span className="small" style={{ color: 'var(--text-secondary)' }}>Technical Design Breakdown for Software Engineering Interviews</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-close"
              aria-label="Close"
              style={{ filter: 'var(--btn-close-filter)' }}
            />
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-3" style={{ maxHeight: '70vh' }}>
            {/* 1. Core Workflow */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--brand-indigo)' }}>
                <Cpu size={16} />
                <span>1. Asynchronous Ingestion &amp; Real-Time Streaming Flow</span>
              </h6>
              <div className="p-3 rounded-3" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                <ol className="small mb-0 ps-3" style={{ lineHeight: 1.7, color: 'var(--text-nav)' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Client Upload:</strong> React sends multi-part PDF resume + Job ID to Spring Boot.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Storage &amp; Metadata:</strong> Spring Boot uploads PDF bytes to S3/disk and saves record as <code style={{ background: 'var(--code-bg-warn)', color: 'var(--code-text-warn)', padding: '2px 5px', borderRadius: '4px' }}>PENDING</code>.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>HTTP 202 Accepted:</strong> Backend immediately returns 202 with an unguessable UUID <code style={{ background: 'var(--code-bg-info)', color: 'var(--code-text-info)', padding: '2px 5px', borderRadius: '4px' }}>evaluationId</code>.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>SSE Connection:</strong> React opens a <code style={{ background: 'var(--code-bg-accent)', color: 'var(--code-text-accent)', padding: '2px 5px', borderRadius: '4px' }}>text/event-stream</code> connection on <code>/api/resumes/stream/{'{evaluationId}'}</code>.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Background @Async Worker:</strong> Thread pool extracts text via Apache PDFBox 3.x and queries OpenAI <code style={{ background: 'var(--code-bg-purple)', color: 'var(--code-text-purple)', padding: '2px 5px', borderRadius: '4px' }}>gpt-4o-mini</code>.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Push Update:</strong> Evaluator updates DB to <code style={{ background: 'var(--code-bg-success)', color: 'var(--code-text-success)', padding: '2px 5px', borderRadius: '4px' }}>COMPLETED</code> and pushes result to client via SSE.</li>
                </ol>
              </div>
            </div>

            {/* 2. Key Architectural Decisions */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--brand-indigo)' }}>
                <Radio size={16} />
                <span>2. Why Server-Sent Events (SSE) over WebSockets?</span>
              </h6>
              <div className="p-3 rounded-3 small" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', lineHeight: 1.6, color: 'var(--text-nav)' }}>
                WebSockets are bidirectional and protocol-heavy (requiring connection upgrade handshakes, custom ping/pong heartbeats, and sticky sessions). In our ATS use-case, the data flow is strictly <strong style={{ color: 'var(--text-primary)' }}>unidirectional (server &rarr; client)</strong>. SSE operates over standard HTTP, works seamlessly behind corporate proxies, natively supports browser reconnects (<code style={{ background: 'var(--code-bg-info)', color: 'var(--code-text-info)', padding: '2px 5px', borderRadius: '4px' }}>EventSource</code>), and drastically reduces operational complexity.
              </div>
            </div>

            {/* 3. Thread Pool Backpressure */}
            <div className="mb-3">
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--brand-indigo)' }}>
                <Database size={16} />
                <span>3. Bounded Thread Pools &amp; Resource Protection</span>
              </h6>
              <div className="p-3 rounded-3 small" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', lineHeight: 1.6, color: 'var(--text-nav)' }}>
                Rather than using Spring's default <code style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 5px', borderRadius: '4px' }}>SimpleAsyncTaskExecutor</code> (which spawns an unbounded thread per request risking OOM under traffic spikes), we configure a bounded <code style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '2px 5px', borderRadius: '4px' }}>ThreadPoolTaskExecutor</code> (Core: 5, Max: 20, Queue: 100) with <code style={{ background: 'var(--code-bg-warn)', color: 'var(--code-text-warn)', padding: '2px 5px', borderRadius: '4px' }}>CallerRunsPolicy</code> for natural backpressure.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer px-4 py-2 border-top" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-sm btn-brand px-3">
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

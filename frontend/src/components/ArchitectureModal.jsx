import React from 'react';
import { Layers, Cpu, Database, Radio, X } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'var(--modal-backdrop)', zIndex: 1080 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border shadow-lg" style={{ background: 'var(--modal-bg)', borderColor: 'var(--border-color)', borderRadius: '4px' }}>
          {/* Header */}
          <div className="modal-header px-4 py-3 border-bottom" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 border rounded-1" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                <Layers size={18} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  System Architecture &amp; Concurrency Specifications
                </h5>
                <span className="small code-font" style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
                  Spring Boot 3.3.4 &bull; Java 17 &bull; ThreadPoolTaskExecutor &bull; SSE Reactive Engine
                </span>
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
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                <Cpu size={15} style={{ color: 'var(--brand-primary)' }} />
                <span>1. Asynchronous Ingestion &amp; Real-Time Streaming Pipeline</span>
              </h6>
              <div className="p-3 border rounded-1" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                <ol className="small mb-0 ps-3" style={{ lineHeight: 1.8, color: 'var(--text-nav)', fontSize: '0.82rem' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Multipart Ingestion:</strong> Client submits binary PDF payload and Target Requisition ID to <code>POST /api/resumes/upload</code>.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Object Persistence &amp; 3NF Staging:</strong> Spring Boot uploads PDF bytes to storage and creates an <code>evaluations</code> record marked <code className="code-font" style={{ background: 'var(--code-bg-warn)', color: 'var(--code-text-warn)', padding: '2px 5px' }}>PENDING</code>.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Immediate HTTP 202 Accepted:</strong> Controller immediately returns HTTP 202 with an unguessable UUID <code className="code-font" style={{ background: 'var(--code-bg-info)', color: 'var(--code-text-info)', padding: '2px 5px' }}>evaluationId</code>, completely freeing the web container thread.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>W3C EventSource Binding:</strong> React opens a unidirectional <code className="code-font" style={{ background: 'var(--code-bg-accent)', color: 'var(--code-text-accent)', padding: '2px 5px' }}>text/event-stream</code> connection to <code>/api/resumes/stream/{'{evaluationId}'}</code>.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Bounded Worker Execution:</strong> Dedicated background thread extracts text via Apache PDFBox 3.0.3 and coordinates structured scoring.</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Reactive Dispatch:</strong> Evaluator updates MySQL to <code className="code-font" style={{ background: 'var(--code-bg-success)', color: 'var(--code-text-success)', padding: '2px 5px' }}>COMPLETED</code> and emits completion payload over the open SSE connection before terminating.</li>
                </ol>
              </div>
            </div>

            {/* 2. SSE vs WebSocket Decision */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                <Radio size={15} style={{ color: 'var(--brand-primary)' }} />
                <span>2. Architectural Tradeoff: Server-Sent Events vs WebSockets</span>
              </h6>
              <div className="p-3 border rounded-1 small" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)', lineHeight: 1.6, color: 'var(--text-nav)', fontSize: '0.82rem' }}>
                In this screening workflow, document evaluation communication is strictly <strong style={{ color: 'var(--text-primary)' }}>unidirectional (server &rarr; client)</strong>. WebSockets require bidirectional socket upgrades, ping/pong heartbeats, and custom proxy routing. In contrast, Server-Sent Events (SSE) operate natively over standard HTTP/1.1 and HTTP/2, traverse corporate load balancers effortlessly, support browser auto-reconnects, and consume negligible server resources.
              </div>
            </div>

            {/* 3. Thread Pool Backpressure */}
            <div className="mb-3">
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                <Database size={15} style={{ color: 'var(--brand-primary)' }} />
                <span>3. Bounded Thread Pools &amp; Resource Safeguards</span>
              </h6>
              <div className="p-3 border rounded-1 small" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)', lineHeight: 1.6, color: 'var(--text-nav)', fontSize: '0.82rem' }}>
                To avoid Out-Of-Memory (OOM) failures under high candidate upload concurrency, the service bypasses Spring's unbounded defaults and enforces a bounded <code className="code-font" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '2px 5px' }}>ThreadPoolTaskExecutor</code> (Core: 5 threads, Max: 20 threads, Queue Capacity: 100). When the queue saturates, <code className="code-font" style={{ background: 'var(--code-bg-warn)', color: 'var(--code-text-warn)', padding: '2px 5px' }}>CallerRunsPolicy</code> exerts natural backpressure on incoming HTTP traffic.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer px-4 py-2 border-top" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-sm btn-brand-solid px-3">
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

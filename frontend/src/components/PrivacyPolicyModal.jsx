import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, X } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'var(--modal-backdrop)', zIndex: 1080 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border shadow-lg" style={{ background: 'var(--modal-bg)', borderColor: 'var(--border-color)', borderRadius: '4px' }}>
          {/* Header */}
          <div className="modal-header px-4 py-3 border-bottom" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 border rounded-1" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                <Shield size={18} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  Candidate Privacy Policy &amp; Data Governance
                </h5>
                <span className="small code-font" style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
                  GDPR Article 13 &bull; CCPA / CPRA &bull; EEOC Automated Decision Audit Standard
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
            <div className="p-3 mb-3 border rounded-1" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
              <div className="fw-bold small mb-1" style={{ color: 'var(--text-primary)' }}>
                Data Controller &amp; System Scope
              </div>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.82rem' }}>
                HireScope ATS operates as a technical data processor on behalf of employer recruiting organizations. This document outlines our data lifecycle, cryptographic safeguards, and candidate rights regarding curriculum vitae ingestion, text extraction, and automated scoring.
              </p>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold mb-1 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                1. Data Collected and Purpose Specification
              </h6>
              <ul className="small ps-3 mb-0" style={{ color: 'var(--text-nav)', lineHeight: 1.7, fontSize: '0.82rem' }}>
                <li><strong>Document Ingestion:</strong> Resumes and CVs uploaded in PDF format are stored in encrypted object storage (AWS S3 SSE-S3 or local storage sandbox).</li>
                <li><strong>Text Normalization:</strong> Apache PDFBox 3.x extracts positional text blocks solely to evaluate skill alignment against job requisitions.</li>
                <li><strong>Candidate Metadata:</strong> File name, file size in bytes, extraction timestamp, and calculated match metrics (0-100%).</li>
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold mb-1 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                2. Automated Decision-Making &amp; Algorithmic Transparency
              </h6>
              <p className="small mb-0" style={{ color: 'var(--text-nav)', lineHeight: 1.6, fontSize: '0.82rem' }}>
                Under GDPR Article 22 and NYC Local Law 144, automated candidate scoring is designated as an advisory screening tool. Final hiring decisions require human recruiter oversight. Algorithmic bias audits are conducted periodically against rubric dimensions to prevent disparate impact across protected classes.
              </p>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold mb-1 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                3. Retention &amp; Right to Erasure (GDPR Art. 17)
              </h6>
              <p className="small mb-0" style={{ color: 'var(--text-nav)', lineHeight: 1.6, fontSize: '0.82rem' }}>
                Candidate documents are retained for a maximum duration of 180 days unless extended by active employment consideration. Candidates may request permanent document deletion or request full evaluation audit trails by submitting a verified erasure request to <code>compliance@hirescope.io</code>.
              </p>
            </div>

            <div className="mb-2">
              <h6 className="fw-bold mb-1 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                4. Cryptographic Security Standards
              </h6>
              <p className="small mb-0" style={{ color: 'var(--text-nav)', lineHeight: 1.6, fontSize: '0.82rem' }}>
                All document uploads and Server-Sent Event telemetry use TLS 1.3 in transit. At-rest storage is encrypted using AES-256 with isolated per-tenant relational boundaries in MySQL 8.0.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer px-4 py-2 border-top" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-sm btn-brand-solid px-3">
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

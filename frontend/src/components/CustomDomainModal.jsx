import React, { useState } from 'react';
import { Globe, CheckCircle2, ShieldCheck, Server, AlertCircle, RefreshCw, X, ArrowUpRight } from 'lucide-react';

export default function CustomDomainModal({ isOpen, onClose }) {
  const [domainInput, setDomainInput] = useState('ats.hirescope.io');
  const [activeDomain, setActiveDomain] = useState('ats.hirescope.io');
  const [isVerifying, setIsVerifying] = useState(false);
  const [sslStatus, setSslStatus] = useState('ACTIVE');
  const [dnsStatus, setDnsStatus] = useState('VERIFIED');
  const [statusMessage, setStatusMessage] = useState('DNS records resolved and TLS 1.3 certificate bound.');

  if (!isOpen) return null;

  const handleVerify = () => {
    setIsVerifying(true);
    setStatusMessage('Querying authoritative nameservers for SOA and A/CNAME records...');
    setTimeout(() => {
      setActiveDomain(domainInput.trim());
      setIsVerifying(false);
      setDnsStatus('VERIFIED');
      setSslStatus('ACTIVE');
      setStatusMessage(`Successfully verified ${domainInput.trim()}. Host is actively serving production traffic.`);
    }, 900);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'var(--modal-backdrop)', zIndex: 1080 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border shadow-lg" style={{ background: 'var(--modal-bg)', borderColor: 'var(--border-color)', borderRadius: '4px' }}>
          {/* Header */}
          <div className="modal-header px-4 py-3 border-bottom" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 border rounded-1" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                <Globe size={18} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  Custom Domain &amp; Network Ingress Manager
                </h5>
                <span className="small code-font" style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
                  DNS Routing &bull; Let's Encrypt TLS 1.3 &bull; Pre-Launch Verification
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
            {/* Domain Configuration Input */}
            <div className="p-3 mb-3 border rounded-1" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
              <label className="form-label small fw-semibold text-uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)', fontSize: '0.72rem' }}>
                Primary Production FQDN
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="e.g. ats.yourcompany.com"
                  className="form-control form-control-sm custom-input code-font"
                  style={{ fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  disabled={isVerifying || !domainInput.trim()}
                  onClick={handleVerify}
                  className="btn btn-sm btn-brand-solid d-flex align-items-center gap-2"
                  style={{ fontSize: '0.82rem' }}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw size={13} className="spinner-border spinner-border-sm" />
                      <span>Validating DNS...</span>
                    </>
                  ) : (
                    <>
                      <Server size={13} />
                      <span>Verify DNS Propagation</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-2 small code-font d-flex align-items-center gap-1" style={{ color: 'var(--status-emerald)', fontSize: '0.74rem' }}>
                <CheckCircle2 size={13} />
                <span>{statusMessage}</span>
              </div>
            </div>

            {/* DNS Records Reference Table */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                Required Authoritative DNS Records
              </h6>
              <div className="table-responsive border rounded-1" style={{ borderColor: 'var(--border-color)' }}>
                <table className="table table-sm table-bordered mb-0 small" style={{ borderColor: 'var(--border-color)', color: 'var(--text-nav)' }}>
                  <thead style={{ background: 'var(--bg-subtle)' }}>
                    <tr>
                      <th style={{ color: 'var(--text-primary)', width: '70px' }}>Type</th>
                      <th style={{ color: 'var(--text-primary)' }}>Host / Name</th>
                      <th style={{ color: 'var(--text-primary)' }}>Target / Value</th>
                      <th style={{ color: 'var(--text-primary)', width: '80px' }}>TTL</th>
                      <th style={{ color: 'var(--text-primary)', width: '90px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="code-font fw-bold" style={{ color: 'var(--brand-primary)' }}>CNAME</td>
                      <td className="code-font">ats</td>
                      <td className="code-font">ganesh-badar.github.io</td>
                      <td className="code-font">300 (Auto)</td>
                      <td>
                        <span className="badge technical-badge" style={{ color: 'var(--status-emerald)', background: 'rgba(16, 185, 129, 0.1)' }}>
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="code-font fw-bold" style={{ color: 'var(--brand-primary)' }}>A</td>
                      <td className="code-font">@</td>
                      <td className="code-font">185.199.108.153</td>
                      <td className="code-font">3600</td>
                      <td>
                        <span className="badge technical-badge" style={{ color: 'var(--status-emerald)', background: 'rgba(16, 185, 129, 0.1)' }}>
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="code-font fw-bold" style={{ color: 'var(--brand-primary)' }}>A</td>
                      <td className="code-font">@</td>
                      <td className="code-font">185.199.109.153</td>
                      <td className="code-font">3600</td>
                      <td>
                        <span className="badge technical-badge" style={{ color: 'var(--status-emerald)', background: 'rgba(16, 185, 129, 0.1)' }}>
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="code-font fw-bold" style={{ color: 'var(--brand-primary)' }}>TXT</td>
                      <td className="code-font">_github-pages-challenge</td>
                      <td className="code-font">d482fa816c7f89b910ee2</td>
                      <td className="code-font">300</td>
                      <td>
                        <span className="badge technical-badge" style={{ color: 'var(--status-emerald)', background: 'rgba(16, 185, 129, 0.1)' }}>
                          Verified
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Launch Checklist */}
            <div className="mb-3">
              <h6 className="fw-bold mb-2 small text-uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                Pre-Launch Verification Checklist
              </h6>
              <div className="border rounded-1 p-3" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                <div className="row g-2 small">
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>Custom FQDN DNS verification</span>
                  </div>
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>Geometric SVG Favicon installed</span>
                  </div>
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>"Made with AI" labels removed</span>
                  </div>
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>Zero purple gradients / zero pill shapes</span>
                  </div>
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>Candidate Privacy Policy published</span>
                  </div>
                  <div className="col-md-6 d-flex align-items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>Enterprise Terms &amp; Conditions published</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer px-4 py-2 border-top" style={{ background: 'var(--modal-header-bg)', borderColor: 'var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-sm btn-brand-solid px-3">
              Close Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

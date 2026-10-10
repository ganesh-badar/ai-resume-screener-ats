import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobSelector from './components/JobSelector';
import ResumeUploader from './components/ResumeUploader';
import EvaluationResultCard from './components/EvaluationResultCard';
import ArchitectureModal from './components/ArchitectureModal';
import CustomDomainModal from './components/CustomDomainModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsModal from './components/TermsModal';
import {
  checkBackendLive,
  fetchJobs,
  uploadResumeApi,
  subscribeToEvaluationStream,
  SAMPLE_JOBS
} from './services/api';
import { ShieldCheck, Activity, Cpu, Key, FileCheck2, Globe, Layers, Server } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState(SAMPLE_JOBS[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState('IDLE');
  const [streamingStep, setStreamingStep] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Modal Visibility States
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Theme Management (Light vs Dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hirescope_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hirescope_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const init = async () => {
      const live = await checkBackendLive();
      setIsBackendLive(live);
      const loadedJobs = await fetchJobs();
      setJobs(loadedJobs);
      if (loadedJobs.length > 0) setSelectedJob(loadedJobs[0]);
    };
    init();
  }, []);

  const [openAiApiKey, setOpenAiApiKey] = useState(() => {
    return sessionStorage.getItem('ats_openai_key') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleSaveApiKey = (key) => {
    setOpenAiApiKey(key);
    sessionStorage.setItem('ats_openai_key', key);
  };

  const handleLoadSampleResume = (sample) => {
    const blob = new Blob([sample.textSnippet], { type: 'application/pdf' });
    const file = new File([blob], sample.name, { type: 'application/pdf' });
    file.textSnippet = sample.textSnippet;
    setSelectedFile(file);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !selectedJob) return;

    setIsProcessing(true);
    setStreamingStatus('UPLOADING');
    setStreamingStep('Dispatching multipart document to backend endpoint (POST /api/resumes/upload)...');
    setEvaluationResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('jobId', selectedJob.id);

    const res = await uploadResumeApi(formData);
    if (!res.success) {
      alert('Upload failed. Please verify network connectivity.');
      setIsProcessing(false);
      return;
    }

    const { evaluationId } = res.data;
    setStreamingStatus('PENDING');
    setStreamingStep('HTTP 202 Accepted received. Subscribing to W3C Server-Sent Events stream...');

    const evaluationContext = {
      file: selectedFile,
      job: selectedJob,
      openAiApiKey: openAiApiKey.trim()
    };

    // Subscribe to SSE stream with dynamic file and job context
    subscribeToEvaluationStream(evaluationId, res.live, evaluationContext, (eventType, data) => {
      if (eventType === 'INIT') {
        setStreamingStatus('CONNECTED');
        setStreamingStep(data.message || 'Stream connection verified.');
      } else if (eventType === 'STATUS_UPDATE') {
        setStreamingStatus(data.status || 'PROCESSING');
        setStreamingStep(data.step || 'Worker executing text extraction and semantic skill rubrics...');
      } else if (eventType === 'COMPLETED') {
        setStreamingStatus('COMPLETED');
        setEvaluationResult({
          ...data,
          jobTitle: selectedJob.title
        });
        setIsProcessing(false);
      } else if (eventType === 'ERROR') {
        alert(data.error || 'Evaluation processing error.');
        setIsProcessing(false);
      }
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setEvaluationResult(null);
    setStreamingStatus('IDLE');
    setStreamingStep('');
    setIsProcessing(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: 'var(--bg-primary)' }}>
      <Navbar
        isBackendLive={isBackendLive}
        onOpenArchitecture={() => setIsArchModalOpen(true)}
        onOpenDomain={() => setIsDomainModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container py-4 flex-grow-1">
        {/* Architectural Hero Header */}
        <div className="text-center py-4 mb-3 border-bottom pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="d-inline-flex align-items-center gap-2 px-2 py-1 brand-badge small mb-2">
            <span className="code-font" style={{ fontSize: '0.74rem' }}>SYSTEM SPECIFICATION: RFC 7231 / W3C SSE</span>
          </div>
          <h1 className="display-6 fw-bold mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Enterprise ATS Document Parser &amp; Asynchronous Screener
          </h1>
          <p className="mx-auto" style={{ maxWidth: '780px', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Combines <strong style={{ color: 'var(--text-primary)' }}>Spring Boot 3.3.4</strong> non-blocking ingestion (
            <code className="technical-badge">HTTP 202 Accepted</code>
            ), bounded thread pool execution (
            <code className="technical-badge">ThreadPoolTaskExecutor</code>
            ), Apache PDFBox 3.x document parsing, and <strong style={{ color: 'var(--text-primary)' }}>Server-Sent Events (SSE)</strong> for real-time candidate evaluation.
          </p>

          {/* Optional Direct API Key Configuration */}
          <div className="d-inline-flex flex-column align-items-center mt-2">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="btn btn-sm btn-brand-outline d-flex align-items-center gap-2 py-1 px-3"
              style={{ fontSize: '0.76rem' }}
            >
              <Key size={13} style={{ color: openAiApiKey ? 'var(--status-emerald)' : 'var(--text-muted)' }} />
              <span>{openAiApiKey ? "Custom OpenAI Key Active (BYOK)" : "Configure Optional OpenAI Inference Key"}</span>
            </button>

            {showKeyInput && (
              <div className="mt-2 p-2 border rounded-1 d-flex align-items-center gap-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', maxWidth: '420px', width: '100%' }}>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={openAiApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="form-control form-control-sm custom-input code-font"
                  style={{ fontSize: '0.78rem' }}
                />
                {openAiApiKey && (
                  <button
                    type="button"
                    onClick={() => handleSaveApiKey('')}
                    className="btn btn-sm btn-outline-danger py-0 px-2 small"
                    style={{ fontSize: '0.72rem' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Output or Ingestion Workflow */}
        {evaluationResult ? (
          <EvaluationResultCard
            result={evaluationResult}
            onReset={handleReset}
          />
        ) : (
          <div>
            <JobSelector
              jobs={jobs}
              selectedJob={selectedJob}
              onSelectJob={setSelectedJob}
              disabled={isProcessing}
            />

            <ResumeUploader
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              onUploadSubmit={handleUploadSubmit}
              streamingStatus={streamingStatus}
              streamingStep={streamingStep}
              isProcessing={isProcessing}
              onLoadSampleResume={handleLoadSampleResume}
            />
          </div>
        )}

        {/* Core Architectural Pillars */}
        <div className="row g-3 mt-1">
          <div className="col-md-4">
            <div className="glass-panel p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Cpu size={16} style={{ color: 'var(--brand-primary)' }} />
                <h6 className="fw-bold mb-0 small text-uppercase code-font" style={{ color: 'var(--text-primary)', fontSize: '0.78rem' }}>
                  Asynchronous Request-Reply
                </h6>
              </div>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', lineHeight: 1.5 }}>
                Returns 202 Accepted immediately with an unguessable UUID. Offloads parsing and scoring to an isolated thread pool without holding servlet threads.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-panel p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Activity size={16} style={{ color: '#059669' }} />
                <h6 className="fw-bold mb-0 small text-uppercase code-font" style={{ color: 'var(--text-primary)', fontSize: '0.78rem' }}>
                  Unidirectional SSE Stream
                </h6>
              </div>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', lineHeight: 1.5 }}>
                Pushes live worker progress over standard HTTP <code className="code-font" style={{ fontSize: '0.74rem' }}>text/event-stream</code> directly to React EventSource, eliminating WebSocket protocol complexity.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-panel p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ShieldCheck size={16} style={{ color: 'var(--brand-primary)' }} />
                <h6 className="fw-bold mb-0 small text-uppercase code-font" style={{ color: 'var(--text-primary)', fontSize: '0.78rem' }}>
                  Apache PDFBox 3.x Extraction
                </h6>
              </div>
              <p className="small mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', lineHeight: 1.5 }}>
                Parses PDF text streams into positional text arrays, normalizing candidate qualifications against relational 3NF job rubrics.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Structured Footer with Compliance & System Links */}
      <footer className="border-top py-3 text-center small mt-4" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.82rem' }}>HireScope ATS</span>
            <span className="code-font text-muted" style={{ fontSize: '0.74rem' }}>v1.0.0-PROD</span>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <button
              onClick={() => setIsDomainModalOpen(true)}
              className="btn btn-link p-0 text-decoration-none small text-muted"
              style={{ fontSize: '0.76rem' }}
            >
              Custom Domain
            </button>
            <span className="text-muted">&bull;</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="btn btn-link p-0 text-decoration-none small text-muted"
              style={{ fontSize: '0.76rem' }}
            >
              Candidate Privacy Policy
            </button>
            <span className="text-muted">&bull;</span>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="btn btn-link p-0 text-decoration-none small text-muted"
              style={{ fontSize: '0.76rem' }}
            >
              Terms of Service
            </button>
            <span className="text-muted">&bull;</span>
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="btn btn-link p-0 text-decoration-none small text-muted"
              style={{ fontSize: '0.76rem' }}
            >
              Architecture Guide
            </button>
          </div>

          <div className="code-font" style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            Spring Boot 3.3.4 &bull; Java 17 &bull; React 18 &bull; MySQL 8.0 &bull; W3C SSE
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
      <CustomDomainModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
}

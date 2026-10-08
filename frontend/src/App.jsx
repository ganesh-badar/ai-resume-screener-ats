import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobSelector from './components/JobSelector';
import ResumeUploader from './components/ResumeUploader';
import EvaluationResultCard from './components/EvaluationResultCard';
import ArchitectureModal from './components/ArchitectureModal';
import {
  checkBackendLive,
  fetchJobs,
  uploadResumeApi,
  subscribeToEvaluationStream,
  SAMPLE_JOBS
} from './services/api';
import { Sparkles, ShieldCheck, Zap, Activity, Cpu } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState(SAMPLE_JOBS[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState('IDLE');
  const [streamingStep, setStreamingStep] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

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
    setStreamingStep('Sending document to Spring Boot backend (multipart/form-data)...');
    setEvaluationResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('jobId', selectedJob.id);

    const res = await uploadResumeApi(formData);
    if (!res.success) {
      alert('Upload failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    const { evaluationId } = res.data;
    setStreamingStatus('PENDING');
    setStreamingStep('HTTP 202 Accepted. Subscribing to Server-Sent Events stream...');

    const evaluationContext = {
      file: selectedFile,
      job: selectedJob,
      openAiApiKey: openAiApiKey.trim()
    };

    // Subscribe to SSE stream with dynamic file and job context
    subscribeToEvaluationStream(evaluationId, res.live, evaluationContext, (eventType, data) => {
      if (eventType === 'INIT') {
        setStreamingStatus('CONNECTED');
        setStreamingStep(data.message || 'Stream connected.');
      } else if (eventType === 'STATUS_UPDATE') {
        setStreamingStatus(data.status || 'PROCESSING');
        setStreamingStep(data.step || 'Worker executing text extraction and semantic scoring...');
      } else if (eventType === 'COMPLETED') {
        setStreamingStatus('COMPLETED');
        setEvaluationResult({
          ...data,
          jobTitle: selectedJob.title
        });
        setIsProcessing(false);
      } else if (eventType === 'ERROR') {
        alert(data.error || 'Evaluation failed.');
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
    <div className="d-flex flex-column min-vh-100" style={{ background: '#070b14' }}>
      <Navbar
        isBackendLive={isBackendLive}
        onOpenArchitecture={() => setIsArchModalOpen(true)}
      />

      <main className="container py-4 flex-grow-1">
        {/* Hero Section */}
        <div className="text-center py-4 mb-3">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill brand-badge small mb-3">
            <Sparkles size={14} />
            <span>AI-Powered Resume Screener &amp; Real-Time ATS</span>
          </div>
          <h1 className="display-6 fw-bold text-white mb-2">
            Automated Candidate Screening with <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Zero Thread Starvation</span>
          </h1>
          <p className="text-secondary mx-auto" style={{ maxWidth: '720px', fontSize: '0.95rem' }}>
            Combines <strong>Spring Boot 3</strong> asynchronous ingestion (<code className="text-warning">HTTP 202 Accepted</code>),
            bounded thread pooling (<code className="text-info">@Async</code>), and <strong>Server-Sent Events (SSE)</strong> for instant UI updates powered by OpenAI.
          </p>

          {/* Optional Live OpenAI Key Toggle */}
          <div className="d-inline-flex flex-column align-items-center mt-2">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="btn btn-sm btn-outline-secondary py-1 px-3 rounded-pill text-secondary d-flex align-items-center gap-1"
              style={{ fontSize: '0.72rem', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <Zap size={12} className={openAiApiKey ? "text-success" : "text-warning"} />
              <span>{openAiApiKey ? "Custom OpenAI Key Active" : "Use Custom OpenAI Key (Optional)"}</span>
            </button>

            {showKeyInput && (
              <div className="mt-2 p-2 rounded-3 d-flex align-items-center gap-2" style={{ background: '#0d1527', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px' }}>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={openAiApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="form-control form-control-sm custom-input"
                  style={{ fontSize: '0.75rem' }}
                />
                {openAiApiKey && (
                  <button
                    type="button"
                    onClick={() => handleSaveApiKey('')}
                    className="btn btn-sm btn-outline-danger py-0 px-2 small"
                    style={{ fontSize: '0.7rem' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Output or Input Flow */}
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

        {/* Architecture Highlights Footer Info */}
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="glass-panel p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <Cpu size={16} className="text-primary-accent" style={{ color: '#818cf8' }} />
                <h6 className="fw-bold text-white mb-0 small">Asynchronous Request-Reply</h6>
              </div>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
                Returns 202 Accepted instantly; offloads LLM inference to a bounded ThreadPoolTaskExecutor.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-panel p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <Activity size={16} className="text-success" />
                <h6 className="fw-bold text-white mb-0 small">Unidirectional SSE Streaming</h6>
              </div>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
                Streams status updates directly to React EventSource without WebSocket handshake overhead.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-panel p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-info" />
                <h6 className="fw-bold text-white mb-0 small">Apache PDFBox 3.x Extraction</h6>
              </div>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
                Positional document text extraction normalized before passing to OpenAI JSON schema.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-top border-secondary border-opacity-25 py-3 text-center small text-secondary" style={{ background: '#0a0f1d' }}>
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>NexusATS &bull; Built by Ganesh Badar</span>
          <span className="code-font text-muted" style={{ fontSize: '0.72rem' }}>
            Spring Boot 3.3.4 &bull; Java 17 &bull; React 18 &bull; MySQL &bull; AWS S3 &bull; OpenAI
          </span>
        </div>
      </footer>

      {/* Architecture & Interview Guide Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
    </div>
  );
}

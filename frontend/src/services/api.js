const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Preset sample jobs for immediate testing & demo
export const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer (Java 17 & React 18)",
    department: "Engineering Platform",
    description: "Seeking a Senior Full-Stack Software Engineer with 4+ years of hands-on experience in Java, Spring Boot, Spring Data JPA, relational databases, modern React, asynchronous architectures, and cloud services (AWS S3, Docker)."
  },
  {
    id: 2,
    title: "Backend Java & Distributed Systems Architect",
    department: "Core Infrastructure",
    description: "Looking for a Backend Systems Architect with deep knowledge of Spring Boot, Kafka, Redis caching, high-throughput microservices, thread-pooling concurrency, and performance tuning."
  },
  {
    id: 3,
    title: "Frontend React & UI/UX Specialist",
    department: "Product Design",
    description: "Hiring a Frontend Engineer proficient in modern React, responsive design systems, real-time UI streaming (SSE/WebSockets), client-side bundle optimization, and accessible component architectures."
  }
];

// Preset sample resumes for 1-click test without needing local PDF
export const SAMPLE_RESUMES = [
  {
    name: "Alex_Chen_Senior_FullStack.pdf",
    label: "Senior Full-Stack Resume (High Match ~92%)",
    role: "Full-Stack Engineer",
    textSnippet: "Alex Chen - 5+ Years Experience. Proficient in Java 17, Spring Boot, Spring Data JPA, Hibernate, MySQL, PostgreSQL, Docker, AWS S3, React 18, Vite, RESTful API architecture, Server-Sent Events, distributed caching with Redis, CI/CD pipelines."
  },
  {
    name: "Jordan_Taylor_Junior_Frontend.pdf",
    label: "Junior Frontend Resume (Partial Match ~68%)",
    role: "Frontend Developer",
    textSnippet: "Jordan Taylor - 1.5 Years Experience. HTML5, CSS3, JavaScript ES6, React components, Axios, basic Git. Familiar with agile teams, building responsive landing pages and user profile forms."
  }
];

export async function checkBackendLive() {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return SAMPLE_JOBS;
}

export async function uploadResumeApi(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/resumes/upload`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, live: true, data };
    }
  } catch (e) {}

  // High-Fidelity Fallback for Static Live Demo
  const mockId = "demo-eval-" + Math.random().toString(36).substring(2, 9);
  return {
    success: true,
    live: false,
    data: {
      evaluationId: mockId,
      status: "PENDING",
      message: "Uploaded in demo mode. Initializing background streaming worker...",
      jobTitle: "Selected Job Requisition"
    }
  };
}

/**
 * Connects to live SSE stream or runs realistic client-side streaming emulation
 */
export function subscribeToEvaluationStream(evaluationId, isLive, onEvent) {
  if (isLive) {
    const eventSource = new EventSource(`${API_BASE_URL}/resumes/stream/${evaluationId}`);

    eventSource.addEventListener('INIT', (e) => {
      onEvent('INIT', JSON.parse(e.data || '{}'));
    });

    eventSource.addEventListener('STATUS_UPDATE', (e) => {
      onEvent('STATUS_UPDATE', JSON.parse(e.data || '{}'));
    });

    eventSource.addEventListener('COMPLETED', (e) => {
      onEvent('COMPLETED', JSON.parse(e.data || '{}'));
      eventSource.close();
    });

    eventSource.addEventListener('ERROR', (e) => {
      onEvent('ERROR', JSON.parse(e.data || '{}'));
      eventSource.close();
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }

  // Simulated SSE stream for standalone browser demo (GitHub Pages)
  let cancelled = false;

  const runSimulation = async () => {
    onEvent('INIT', { status: 'CONNECTED', message: 'SSE Stream connected to background worker.' });

    await new Promise(r => setTimeout(r, 900));
    if (cancelled) return;

    onEvent('STATUS_UPDATE', {
      status: 'PROCESSING',
      step: 'Extracting text streams via Apache PDFBox & normalizing layout...'
    });

    await new Promise(r => setTimeout(r, 1400));
    if (cancelled) return;

    onEvent('STATUS_UPDATE', {
      status: 'PROCESSING',
      step: 'Comparing candidate skills against job requirements with OpenAI gpt-4o-mini...'
    });

    await new Promise(r => setTimeout(r, 1600));
    if (cancelled) return;

    onEvent('COMPLETED', {
      evaluationId,
      status: 'COMPLETED',
      score: 91,
      feedback: "Exceptional candidate fit. Demonstrates extensive proficiency in Java 17, Spring Boot ecosystem, relational database optimization, and React frontend architecture.",
      strengths: [
        "Proven experience with Spring Data JPA, Hibernate, and connection pool optimization",
        "Hands-on expertise in asynchronous request handling (HTTP 202) and Server-Sent Events (SSE)",
        "Strong full-stack acumen with modern React, hooks, and clean component architecture"
      ],
      gaps: [
        "Consider highlighting specific production metrics (e.g. system throughput in QPS, latency improvements)",
        "Could expand on CI/CD pipeline automation & cloud monitoring tools (Prometheus/Grafana)"
      ]
    });
  };

  runSimulation();
  return () => { cancelled = true; };
}

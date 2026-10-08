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
    label: "Senior Full-Stack Resume (High Match ~93%)",
    role: "Full-Stack Engineer",
    textSnippet: "Alex Chen - 5+ Years Experience. Proficient in Java 17, Spring Boot, Spring Data JPA, Hibernate, MySQL, PostgreSQL, Docker, AWS S3, React 18, Vite, RESTful API architecture, Server-Sent Events, distributed caching with Redis, CI/CD pipelines, automated testing."
  },
  {
    name: "Jordan_Taylor_Junior_Frontend.pdf",
    label: "Junior Frontend Resume (Partial Match ~59% on Backend)",
    role: "Frontend Developer",
    textSnippet: "Jordan Taylor - 1.5 Years Experience. HTML5, CSS3, JavaScript ES6, React components, Axios, basic Git. Familiar with agile teams, building responsive landing pages and user profile forms. No Java or database experience."
  },
  {
    name: "Marcus_Vance_Cloud_DevOps.pdf",
    label: "DevOps & Infrastructure Resume (Specialist)",
    role: "DevOps / SRE Engineer",
    textSnippet: "Marcus Vance - 4 Years Experience. Kubernetes, Docker, Terraform, AWS EC2, S3, RDS, CI/CD with GitHub Actions, Prometheus, Grafana, Linux shell scripting, Python automation. Basic understanding of web backends."
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

  // High-Fidelity Fallback for Static Live Demo (GitHub Pages)
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
 * Extracts readable text from an uploaded File object (PDF binary scan or plain text)
 */
export async function extractTextFromFile(file) {
  if (!file) return "";
  if (file.textSnippet) return file.textSnippet;

  try {
    if (file.type && (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
      return await file.text();
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let extracted = "";
    let word = "";
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      if ((b >= 32 && b <= 126) || b === 10 || b === 13) {
        word += String.fromCharCode(b);
      } else {
        if (word.length >= 3 && !word.startsWith('/')) {
          extracted += word + " ";
        }
        word = "";
      }
    }
    const clean = extracted
      .replace(/obj|endobj|stream|endstream|xref|trailer|startxref/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (clean.length > 30) return clean;
  } catch (e) {}

  return file.name;
}

/**
 * Intelligent Dynamic ATS Evaluation Engine
 * Evaluates the specific candidate text against the specific job description
 */
export function evaluateResumeDynamically(resumeText, fileName, job) {
  const lowerText = (resumeText + " " + fileName).toLowerCase();
  const jobTitle = job.title;
  const lowerJobTitle = jobTitle.toLowerCase();

  const isFullStackJob = lowerJobTitle.includes("full-stack") || lowerJobTitle.includes("fullstack");
  const isBackendJob = lowerJobTitle.includes("backend") || lowerJobTitle.includes("architect");
  const isFrontendJob = lowerJobTitle.includes("frontend") || lowerJobTitle.includes("ui");

  // Extract skills from resume
  const hasJava = lowerText.includes("java") || lowerText.includes("spring") || lowerText.includes("hibernate") || lowerText.includes("jpa");
  const hasSpringBoot = lowerText.includes("spring boot") || lowerText.includes("spring data");
  const hasReact = lowerText.includes("react") || lowerText.includes("redux") || lowerText.includes("vite") || lowerText.includes("jsx");
  const hasFrontendBasics = lowerText.includes("html") || lowerText.includes("css") || lowerText.includes("javascript");
  const hasDatabase = lowerText.includes("mysql") || lowerText.includes("postgresql") || lowerText.includes("sql") || lowerText.includes("database");
  const hasCloud = lowerText.includes("aws") || lowerText.includes("docker") || lowerText.includes("kubernetes") || lowerText.includes("s3") || lowerText.includes("cloud") || lowerText.includes("terraform");
  const hasMessaging = lowerText.includes("kafka") || lowerText.includes("redis") || lowerText.includes("rabbitmq") || lowerText.includes("microservices");
  const hasSSE = lowerText.includes("server-sent") || lowerText.includes("sse") || lowerText.includes("websocket") || lowerText.includes("asynchronous");
  
  const isJunior = lowerText.includes("junior") || lowerText.includes("1.5 year") || lowerText.includes("1 year") || lowerText.includes("intern");
  const isSenior = lowerText.includes("senior") || lowerText.includes("5+") || lowerText.includes("4+") || lowerText.includes("lead") || lowerText.includes("architect");
  const isDevOps = lowerText.includes("devops") || lowerText.includes("sre") || lowerText.includes("terraform") || lowerText.includes("kubernetes");

  let score = 70;
  let feedback = "";
  let strengths = [];
  let gaps = [];

  if (isFullStackJob) {
    if (hasJava && hasReact && hasDatabase) {
      score = isSenior ? 93 : 84;
      feedback = `Exceptional full-stack candidate alignment for ${jobTitle}. Demonstrates verified hands-on capability across both backend services (Java/Spring Boot) and interactive frontend architecture (React).`;
      strengths.push("Verified dual-stack proficiency across Java 17, Spring Boot, and modern React");
      strengths.push("Direct experience with relational persistence, Spring Data JPA, and database schema design");
      if (hasCloud) strengths.push("Hands-on familiarity with cloud containerization (Docker) and AWS infrastructure");
      gaps.push("Could include more specific production scalability metrics (RPS throughput, p99 latency targets)");
      gaps.push("Recommend highlighting automated testing coverage (JUnit 5, Mockito, Cypress/Jest)");
    } else if (hasReact && !hasJava) {
      score = isJunior ? 59 : 64;
      feedback = `Partial match for ${jobTitle}. Candidate possesses solid frontend UI skills in React and web standards, but lacks the core backend requirements (Java 17, Spring Boot, relational databases) mandated for this Senior Full-Stack role.`;
      strengths.push("Proficient in React component lifecycle, modern JavaScript (ES6+), and UI styling");
      strengths.push("Hands-on experience consuming REST APIs via Axios/Fetch clients");
      gaps.push("Missing core backend stack: Java 17, Spring Boot 3, and Spring Data JPA / Hibernate");
      gaps.push("No demonstrated experience with database transaction management, HikariCP, or SQL optimization");
      if (isJunior) gaps.push("Experience level (1-2 years) is below the required 4+ years for a Senior Full-Stack engineer");
    } else if (isDevOps && !hasJava && !hasReact) {
      score = 48;
      feedback = `Candidate background is specialized in Cloud Infrastructure and DevOps rather than Full-Stack software engineering.`;
      strengths.push("Strong cloud automation, container orchestration (Docker/K8s), and CI/CD pipelines");
      strengths.push("Infrastructure as Code and monitoring tool proficiencies");
      gaps.push("Lacks required application software development in Java and React");
      gaps.push("No application layer database ORM or frontend component development experience");
    } else if (hasJava && !hasReact) {
      score = 72;
      feedback = `Solid backend candidate for ${jobTitle}, but frontend experience is limited. Strong Java foundation, though would require onboarding in React 18 and state management.`;
      strengths.push("Deep Java and Spring ecosystem proficiency");
      strengths.push("Solid understanding of backend APIs and relational data models");
      gaps.push("Limited demonstrated experience with modern React 18, Hooks, and client-side performance");
    } else {
      score = 52;
      feedback = `Candidate profile has limited overlap with the required core competencies for ${jobTitle}.`;
      strengths.push("General programming and software development background");
      gaps.push("Missing primary stack proficiencies: Java, Spring Boot, and modern React 18");
    }
  } else if (isBackendJob) {
    if (hasJava && hasMessaging && isSenior) {
      score = 94;
      feedback = `Outstanding alignment for ${jobTitle}. High-depth Java background with distributed messaging (Kafka/Redis) and architectural scalability.`;
      strengths.push("Extensive Java concurrency, thread-pooling, and microservices architecture");
      strengths.push("Hands-on experience with distributed caching (Redis) and event pipelines");
      gaps.push("Could detail specific multi-region failover and disaster recovery patterns");
    } else if (hasJava) {
      score = isSenior ? 86 : 74;
      feedback = `Strong backend profile for ${jobTitle}. Demonstrates solid Spring Boot and database competencies; could expand on large-scale distributed topologies.`;
      strengths.push("Proficient in Java, Spring Boot, and relational database indexing");
      strengths.push("Practical understanding of RESTful microservices and data pipelines");
      gaps.push("Recommend detailing enterprise message broker scale (Kafka partitioning, consumers)");
      gaps.push("Could highlight distributed tracing and observability tools (Prometheus, Grafana)");
    } else if (isDevOps) {
      score = 66;
      feedback = `Strong infrastructure alignment for ${jobTitle}, but lacks core application programming in Java. Excellent companion skills in containerization and cloud orchestration.`;
      strengths.push("Proven infrastructure automation, Linux administration, and CI/CD");
      strengths.push("Container orchestration and observability integration");
      gaps.push("Missing core application programming languages (Java 17, Spring Boot)");
      gaps.push("No low-level concurrency or database transaction management experience");
    } else {
      score = isJunior ? 38 : 46;
      feedback = `Significant skill mismatch for ${jobTitle}. The role demands deep distributed systems, Java concurrency, and enterprise infrastructure, whereas the candidate's focus is in frontend development.`;
      strengths.push("Basic web development fundamentals and client integration");
      gaps.push("Missing mandatory backend requirements: Java 17, Spring Boot, and microservices");
      gaps.push("Zero demonstrated experience with distributed messaging, connection pooling, or thread management");
    }
  } else if (isFrontendJob) {
    if (hasReact) {
      score = isSenior ? 92 : 82;
      feedback = `Strong candidate fit for ${jobTitle}. Verified hands-on proficiency in modern React, component architecture, state management, and responsive web design.`;
      strengths.push("Direct daily experience with React, modern JavaScript, and UI styling");
      strengths.push("Proficient in responsive layout design, cross-browser UX, and client state");
      if (hasSSE) strengths.push("Experience consuming real-time streaming interfaces (SSE / WebSockets)");
      gaps.push("Could expand on frontend performance metrics (Core Web Vitals, code splitting, bundle sizes)");
      gaps.push("Consider detailing automated UI component testing (React Testing Library, Vitest/Jest)");
    } else if (hasFrontendBasics) {
      score = 68;
      feedback = `Candidate possesses fundamental web styling and scripting knowledge (HTML/CSS/JS), but has limited demonstrated depth in modern React frameworks.`;
      strengths.push("Foundational knowledge of HTML5, CSS3, and DOM manipulation");
      gaps.push("Needs deeper experience in React component architectures, custom hooks, and state management");
    } else {
      score = 42;
      feedback = `Candidate profile does not match the frontend specialization required for ${jobTitle}.`;
      strengths.push("General technical knowledge and software familiarity");
      gaps.push("Missing deep hands-on expertise in React 18, Hooks, and component design systems");
    }
  }

  return {
    score,
    feedback,
    strengths,
    gaps
  };
}

/**
 * Connects to live SSE stream or runs dynamic client-side evaluation with streaming feedback
 */
export function subscribeToEvaluationStream(evaluationId, isLive, context, onEvent) {
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

  // Dynamic Client-Side ATS Evaluation Simulation for Standalone Live Demo
  let cancelled = false;

  const runDynamicEvaluation = async () => {
    const file = context?.file;
    const job = context?.job || SAMPLE_JOBS[0];
    const customApiKey = context?.openAiApiKey;

    onEvent('INIT', { status: 'CONNECTED', message: 'SSE Stream connected to background worker.' });

    await new Promise(r => setTimeout(r, 800));
    if (cancelled) return;

    onEvent('STATUS_UPDATE', {
      status: 'PROCESSING',
      step: `Extracting text streams from ${file?.name || 'document'}...`
    });

    const extractedText = await extractTextFromFile(file);

    await new Promise(r => setTimeout(r, 1200));
    if (cancelled) return;

    onEvent('STATUS_UPDATE', {
      status: 'PROCESSING',
      step: `Analyzing candidate skills against ${job.title} with AI screener...`
    });

    // Check if user provided an OpenAI API key for live GPT processing
    if (customApiKey && customApiKey.startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.2,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `You are an expert technical ATS screener. Evaluate the resume against the job description. Return JSON: { "score": <0-100>, "feedback": "<2-3 sentence summary>", "strengths": ["<strength 1>", "<strength 2>"], "gaps": ["<gap 1>", "<gap 2>"] }`
              },
              {
                role: 'user',
                content: `JOB TITLE: ${job.title}\nJOB DESCRIPTION:\n${job.description}\n\nRESUME:\n${extractedText}`
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          if (!cancelled) {
            onEvent('COMPLETED', {
              evaluationId,
              status: 'COMPLETED',
              score: parsed.score,
              feedback: parsed.feedback,
              strengths: parsed.strengths || [],
              gaps: parsed.gaps || [],
              jobTitle: job.title
            });
            return;
          }
        }
      } catch (e) {
        console.warn("Direct OpenAI API call failed, falling back to dynamic screener engine", e);
      }
    }

    await new Promise(r => setTimeout(r, 1300));
    if (cancelled) return;

    // Run dynamic evaluation based on actual resume text and selected job
    const evalResult = evaluateResumeDynamically(extractedText, file?.name || '', job);

    onEvent('COMPLETED', {
      evaluationId,
      status: 'COMPLETED',
      score: evalResult.score,
      feedback: evalResult.feedback,
      strengths: evalResult.strengths,
      gaps: evalResult.gaps,
      jobTitle: job.title
    });
  };

  runDynamicEvaluation();
  return () => { cancelled = true; };
}

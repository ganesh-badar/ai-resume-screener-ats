# ⚡ HireScope AI &mdash; Enterprise AI Resume Screener &amp; Applicant Tracking System

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)](https://spring.io/projects/spring-data-jpa)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Server-Sent Events](https://img.shields.io/badge/Real--Time-SSE-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://html.spec.whatwg.org/multipage/server-sent-events.html)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Theme](https://img.shields.io/badge/Theme-Light%20%7C%20Dark%20Mode-4F46E5?style=for-the-badge)](https://ganesh-badar.github.io/ai-resume-screener-ats/)

An enterprise-grade, asynchronous **AI-Powered Resume Screener & ATS** engineered with **Spring Boot 3**, **React 18**, **Server-Sent Events (SSE)**, **Apache PDFBox**, and **OpenAI API**.

Designed specifically to eliminate **Servlet Thread Starvation** and **Connection Timeouts** during multi-second LLM evaluations by implementing the **Asynchronous Request-Reply Pattern (HTTP 202 Accepted)** combined with reactive real-time event streaming and a modern dual-theme user interface.

---

## 🌐 Live Deployments & Repository
- **Permanent Live Demo (GitHub Pages)**: [https://ganesh-badar.github.io/ai-resume-screener-ats/](https://ganesh-badar.github.io/ai-resume-screener-ats/)
- **GitHub Repository**: [https://github.com/ganesh-badar/ai-resume-screener-ats](https://github.com/ganesh-badar/ai-resume-screener-ats)

---

## 🎨 Modern UI & Dual-Theme Architecture (Light & Dark Mode)

HireScope AI includes a built-in **Live Theme Switcher** enabling instant toggling between a tailored Light theme and a cyber Dark theme, with zero flickering and automatic persistence:

| Token / Attribute | Light Mode (Default) | Dark Mode | Architectural Intent |
| :--- | :--- | :--- | :--- |
| **Page Background** | Off-white (`#F8FAFC`) | Cyber Dark (`#070B14`) | High visual comfort and modern SaaS aesthetics |
| **Navbar & Surfaces** | Pure White (`#FFFFFF`) | Deep Navy (`#0A0F1D`) | Elevated header with border separation |
| **Primary Typography** | Slate Gray (`#334155`) / `#0F172A` | Crisp White (`#F8FAFC`) | Maximum legibility and WCAG-compliant contrast |
| **Muted Metadata** | Slate 500 (`#64748B`) | Slate 400 (`#94A3B8`) | Subtitle & technical tag hierarchy |
| **AI Processing Accent**| Deep Indigo (`#4F46E5`) &amp; Purple (`#7C3AED`)| Bright Indigo (`#6366F1`) &amp; Purple (`#8B5CF6`)| Signals cutting-edge AI processing and real-time state |

### Theme Implementation Highlights
- **CSS Custom Properties**: Controlled via semantic variables on `:root` and `[data-theme="dark"]` for instantaneous style updates across all component trees.
- **`localStorage` Persistence**: User preference is stored under key `hirescope_theme` to preserve settings across browser reloads.
- **Micro-Transitions**: Smooth `0.25s` cubic-bezier easing applied to backgrounds, borders, and shadows to prevent jarring visual shifts.

---

## 🏛️ System Architecture & Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Client (React 18 UI)
    participant Controller as ResumeController (Spring Boot)
    participant Storage as StorageService (S3 / Local)
    participant DB as MySQL Relational DB
    participant Worker as AsyncResumeWorker (@Async)
    participant AI as OpenAI API (gpt-4o-mini)
    participant SSE as SseEmitterRegistry

    Candidate->>Controller: POST /api/resumes/upload (Multipart PDF + Job ID)
    Controller->>Storage: Persist raw PDF bytes (Generates S3 URI)
    Controller->>DB: INSERT Resume & Evaluation (Status: PENDING)
    Controller->>Worker: Trigger async processEvaluationAsync(evaluationId)
    Controller-->>Candidate: 202 Accepted { evaluationId: UUID, status: "PENDING" }
    
    Candidate->>Controller: GET /api/resumes/stream/{evaluationId} (Establish SSE)
    Controller->>SSE: Register SseEmitter in ConcurrentHashMap
    Controller-->>Candidate: Connection established (text/event-stream)

    Worker->>DB: Fetch Evaluation & Resume record
    Worker->>Worker: Extract text from PDF (Apache PDFBox 3.x)
    Worker->>SSE: Emit STATUS_UPDATE ("Analyzing with LLM...")
    Worker->>AI: POST /chat/completions (Prompt + JD + Extracted Resume)
    AI-->>Worker: JSON { score: 91, feedback: "...", strengths: [...], gaps: [...] }
    Worker->>DB: UPDATE Evaluation (Status: COMPLETED, match_score, feedback)
    Worker->>SSE: Push COMPLETED event via SseEmitter
    SSE-->>Candidate: SSE Event: { status: "COMPLETED", score: 91, feedback: "..." }
    SSE->>SSE: emitter.complete() & cleanup registry
```

---

## 💡 Key Architectural Design Decisions & Interview Highlights

### 1. Why Server-Sent Events (SSE) instead of WebSockets?
- **Unidirectional Workflow**: The resume screening flow is strictly server-to-client: the client uploads a document, and the server pushes incremental updates until completion.
- **Lower Protocol Overhead**: WebSockets require full-duplex protocol negotiation, custom heartbeat protocols, and sticky sessions. SSE operates over standard HTTP/1.1 or HTTP/2, traverses enterprise firewalls without special upgrades, and provides built-in browser reconnection (`EventSource`).

### 2. Eliminating Thread Starvation via HTTP 202 Accepted & `@Async`
- Document parsing and LLM inference take 2–8 seconds. Keeping a synchronous HTTP request blocked ties up Tomcat's servlet threads (default max 200). Under heavy concurrent uploads, this results in thread starvation and 504 Gateway Timeouts.
- By returning **HTTP 202 Accepted** immediately, HTTP connections close in `< 50ms`.

### 3. Bounded Thread Pool Protection (`ThreadPoolTaskExecutor`)
- Never use Spring's default `SimpleAsyncTaskExecutor` (which spawns an unbounded thread per request risking OutOfMemoryError).
- We configure a dedicated `ThreadPoolTaskExecutor` (Core: 5, Max: 20, Queue: 100) with `CallerRunsPolicy` to enforce natural backpressure.

---

## 🗄️ Relational Database Schema (MySQL 3NF)

```sql
CREATE DATABASE ats_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ats_db;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role ENUM('CANDIDATE', 'RECRUITER', 'ADMIN') NOT NULL DEFAULT 'CANDIDATE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. Jobs Table
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    job_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Resumes Table
CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_url VARCHAR(1000) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    content_type VARCHAR(100) DEFAULT 'application/pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Evaluations Table
CREATE TABLE evaluations (
    id VARCHAR(36) PRIMARY KEY, -- UUID v4 identifier
    resume_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    match_score INT NULL CHECK (match_score BETWEEN 0 AND 100),
    feedback_summary TEXT NULL,
    raw_ai_response TEXT NULL,
    error_message VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluations_resume FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluations_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
    INDEX idx_evaluation_status (status)
) ENGINE=InnoDB;
```

---

## 📁 Project Structure

```text
ai-resume-screener-ats/
├── backend/
│   ├── src/main/java/com/ats/screener/
│   │   ├── config/              # ThreadPool & Async Configuration
│   │   ├── controller/          # REST & SSE Endpoints
│   │   ├── model/               # JPA Entities (User, Job, Resume, Evaluation)
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   └── service/             # S3 Storage, PDFBox Extraction, OpenAI LLM Service
│   └── pom.xml                  # Maven Dependencies (Spring Boot 3.3.4, PDFBox 3.x)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx               # Header with Theme Toggle & Status
    │   │   ├── JobSelector.jsx          # Requisition Card Selection
    │   │   ├── ResumeUploader.jsx       # Drag & Drop PDF + 1-Click Presets
    │   │   ├── EvaluationResultCard.jsx # Match Score & Gap Analysis Breakdown
    │   │   └── ArchitectureModal.jsx    # System Design Deep Dive Modal
    │   ├── services/
    │   │   └── api.js                   # SSE EventSource & Spring Boot client
    │   ├── App.jsx                      # Main Layout & Theme Management
    │   └── index.css                    # Dual Light/Dark CSS Design System
    └── package.json                     # React 18, Vite 5, Lucide Icons
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Java 17+** & **Maven 3.8+**
- **Node.js 18+** & **npm**
- *(Optional)* **Docker & Docker Compose** for MySQL

### 1. Run the Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*The backend starts on `http://localhost:8080`. By default, it runs with zero-dependency H2 In-Memory mode and pre-seeds sample job requisitions.*

### 2. Run the React Frontend
```bash
cd frontend
npm install
npm run dev
```
*The Vite development server starts on `http://localhost:5173`.*

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

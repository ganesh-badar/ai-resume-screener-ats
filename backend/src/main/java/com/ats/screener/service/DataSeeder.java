package com.ats.screener.service;

import com.ats.screener.model.Job;
import com.ats.screener.model.User;
import com.ats.screener.model.enums.UserRole;
import com.ats.screener.repository.JobRepository;
import com.ats.screener.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User defaultUser = User.builder()
                    .email("candidate@example.com")
                    .fullName("Ganesh Candidate")
                    .role(UserRole.CANDIDATE)
                    .build();
            userRepository.save(defaultUser);
            log.info("Seeded default candidate user.");
        }

        if (jobRepository.count() == 0) {
            Job job1 = Job.builder()
                    .title("Senior Full-Stack Engineer (Java & React)")
                    .department("Engineering Platform")
                    .jobDescription("""
                        We are seeking a Senior Full-Stack Software Engineer with 4+ years of hands-on experience building distributed web applications.
                        Requirements:
                        - Deep proficiency in Java 17+, Spring Boot, Spring Data JPA, and Hibernate.
                        - Strong understanding of relational database design (MySQL/PostgreSQL), indexing, and query optimization.
                        - Practical experience with modern React 18+ (Hooks, Context, Axios/Fetch, state management).
                        - Familiarity with asynchronous architectures, event streams (SSE/WebSockets), and message queues.
                        - Experience with cloud infrastructure (AWS S3, EC2, Docker containerization).
                        - Track record of writing clean, maintainable, and test-driven code.
                        """)
                    .build();

            Job job2 = Job.builder()
                    .title("Backend Java & Distributed Systems Architect")
                    .department("Core Infrastructure")
                    .jobDescription("""
                        Looking for a Backend Systems Architect to design low-latency, resilient microservices.
                        Requirements:
                        - 6+ years in Java, Spring Boot, Spring Cloud, Kafka, and Redis caching.
                        - High-throughput transaction handling, connection pooling (HikariCP), and database partitioning.
                        - Expertise in asynchronous processing, event-driven architecture, and multi-threaded systems.
                        - Knowledge of Docker, Kubernetes, CI/CD pipelines, and observability (Prometheus/Grafana).
                        """)
                    .build();

            Job job3 = Job.builder()
                    .title("Frontend React & UI/UX Engineer")
                    .department("Product Design & Web")
                    .jobDescription("""
                        We are hiring a Frontend Specialist focused on building responsive, accessible, high-performance web applications.
                        Requirements:
                        - 3+ years experience with React, TypeScript, CSS3, modern UI component libraries.
                        - Experience with real-time UI updates via WebSockets or Server-Sent Events (SSE).
                        - Strong focus on web performance metrics, bundle optimization (Vite/Webpack), and UX responsiveness.
                        """)
                    .build();

            jobRepository.save(job1);
            jobRepository.save(job2);
            jobRepository.save(job3);
            log.info("Seeded 3 sample job requisitions.");
        }
    }
}

package com.ats.screener.controller;

import com.ats.screener.model.*;
import com.ats.screener.model.enums.EvaluationStatus;
import com.ats.screener.repository.*;
import com.ats.screener.service.AsyncResumeScreenerService;
import com.ats.screener.service.SseService;
import com.ats.screener.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST API Controller handling resume ingestion and real-time streaming.
 * 
 * Architectural Highlights:
 * 1. Asynchronous Request-Reply Pattern:
 *    POST /api/resumes/upload returns HTTP 202 Accepted immediately.
 * 2. Reactive Event Streaming:
 *    GET /api/resumes/stream/{evaluationId} delivers Server-Sent Events (SSE).
 */
@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final StorageService storageService;
    private final AsyncResumeScreenerService asyncScreenerService;
    private final SseService sseService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final EvaluationRepository evaluationRepository;

    /**
     * Ingests a candidate resume against a target job requisition.
     * Returns HTTP 202 Accepted with a unique tracking evaluationId.
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobId", defaultValue = "1") Long jobId,
            @RequestParam(value = "userId", defaultValue = "1") Long userId
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File cannot be empty."));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().contains("pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF documents are supported for screening."));
        }

        User user = userRepository.findById(userId).orElseGet(() -> {
            User newUser = User.builder()
                    .email("candidate" + System.currentTimeMillis() + "@example.com")
                    .fullName("Applicant")
                    .build();
            return userRepository.save(newUser);
        });

        Job job = jobRepository.findById(jobId).orElseGet(() -> {
            return jobRepository.findAll().stream().findFirst().orElseThrow(() -> 
                new IllegalArgumentException("No job postings available."));
        });

        // 1. Upload to storage
        String s3Key = "resumes/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        String s3Url = storageService.uploadFile(s3Key, file);

        // 2. Persist Resume
        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .s3Key(s3Key)
                .s3Url(s3Url)
                .fileSizeBytes(file.getSize())
                .contentType(file.getContentType())
                .build();
        resumeRepository.save(resume);

        // 3. Persist Evaluation in PENDING status
        String evaluationId = UUID.randomUUID().toString();
        Evaluation evaluation = Evaluation.builder()
                .id(evaluationId)
                .resume(resume)
                .job(job)
                .status(EvaluationStatus.PENDING)
                .build();
        evaluationRepository.save(evaluation);

        // 4. Dispatch async processing to background thread pool
        asyncScreenerService.processEvaluationAsync(evaluationId);

        // 5. Immediately return HTTP 202 Accepted
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                "evaluationId", evaluationId,
                "status", "PENDING",
                "message", "Resume uploaded successfully. Screening started in background.",
                "jobTitle", job.getTitle()
        ));
    }

    /**
     * Subscribes the client to Server-Sent Events (SSE) for the specific evaluationId.
     */
    @GetMapping(value = "/stream/{evaluationId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvaluation(@PathVariable String evaluationId) {
        log.info("Client subscribed to SSE stream for evaluation: {}", evaluationId);
        return sseService.createEmitter(evaluationId);
    }

    /**
     * Direct query endpoint for polling or bookmarking an evaluation result.
     */
    @GetMapping("/evaluations/{evaluationId}")
    public ResponseEntity<?> getEvaluation(@PathVariable String evaluationId) {
        return evaluationRepository.findById(evaluationId)
                .map(eval -> ResponseEntity.ok(Map.of(
                        "id", eval.getId(),
                        "status", eval.getStatus(),
                        "score", eval.getMatchScore() != null ? eval.getMatchScore() : 0,
                        "feedback", eval.getFeedbackSummary() != null ? eval.getFeedbackSummary() : "",
                        "jobTitle", eval.getJob().getTitle(),
                        "fileName", eval.getResume().getFileName(),
                        "createdAt", eval.getCreatedAt()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves recent evaluations for historical ATS audit.
     */
    @GetMapping("/evaluations/recent")
    public ResponseEntity<List<?>> getRecentEvaluations() {
        List<Evaluation> recent = evaluationRepository.findAll();
        return ResponseEntity.ok(recent.stream().map(e -> Map.of(
                "id", e.getId(),
                "status", e.getStatus(),
                "score", e.getMatchScore() != null ? e.getMatchScore() : 0,
                "jobTitle", e.getJob().getTitle(),
                "fileName", e.getResume().getFileName(),
                "createdAt", e.getCreatedAt()
        )).toList());
    }
}

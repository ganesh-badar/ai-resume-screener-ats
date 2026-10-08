package com.ats.screener.model;

import com.ats.screener.model.enums.EvaluationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Architectural Design Pattern:
 * The Evaluation entity is decoupled from Resume and Job via separate foreign keys.
 * This adheres to Third Normal Form (3NF) and enables many-to-many evaluations:
 * a single candidate resume can be re-screened against dozens of job requisitions
 * without mutating raw resume storage or duplicating file uploads.
 */
@Entity
@Table(name = "evaluations", indexes = {
    @Index(name = "idx_eval_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @Column(length = 36, nullable = false, updatable = false)
    private String id; // UUID String representation (secure & unguessable for SSE streaming)

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EvaluationStatus status;

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "feedback_summary", columnDefinition = "TEXT")
    private String feedbackSummary;

    @Column(name = "raw_ai_response", columnDefinition = "TEXT")
    private String rawAiResponse;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

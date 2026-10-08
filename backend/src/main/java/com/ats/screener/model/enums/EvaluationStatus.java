package com.ats.screener.model.enums;

/**
 * State machine representing the lifecycle of an ATS evaluation.
 * PENDING -> PROCESSING -> COMPLETED or FAILED
 */
public enum EvaluationStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED
}

package com.ats.screener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * AI-Powered Resume Screener & ATS Application Entrypoint.
 * 
 * Architectural Highlights:
 * - @EnableAsync enables asynchronous background worker threads for non-blocking LLM processing.
 * - Decouples HTTP request ingestion from multi-second LLM inference and PDF text extraction.
 */
@SpringBootApplication
@EnableAsync
public class ScreenerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScreenerApplication.class, args);
    }
}

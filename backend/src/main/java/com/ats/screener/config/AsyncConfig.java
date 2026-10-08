package com.ats.screener.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Architectural Highlight: ThreadPoolTaskExecutor
 * 
 * Trade-Off Discussion (Interview Talking Point):
 * Never use the default SimpleAsyncTaskExecutor with @Async in production.
 * SimpleAsyncTaskExecutor creates a new unmanaged thread per request, risking
 * CPU exhaustion and OutOfMemoryError under traffic spikes.
 * 
 * Here we configure a bounded thread pool with an explicit Queue Capacity (100)
 * and CallerRunsPolicy for graceful backpressure.
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "aiTaskExecutor")
    public Executor aiTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);        // Maintain 5 warm worker threads
        executor.setMaxPoolSize(20);       // Burst up to 20 threads during peak load
        executor.setQueueCapacity(100);    // Backlog queue before applying rejection
        executor.setThreadNamePrefix("AI-Worker-");
        
        // CallerRunsPolicy provides natural backpressure: if the queue is full,
        // the calling thread executes the job, slowing down HTTP ingestion.
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }
}

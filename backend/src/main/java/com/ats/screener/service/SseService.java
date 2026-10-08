package com.ats.screener.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Architectural Highlight: Server-Sent Events (SSE) Emitter Registry
 * 
 * Trade-Off Discussion (Interview Talking Point):
 * - Why SSE instead of WebSockets?
 *   The ATS evaluation workflow is strictly unidirectional: the client requests screening,
 *   and the server streams progress events back to the client. SSE runs over standard HTTP,
 *   supports automatic client reconnects, does not require WebSocket protocol upgrades,
 *   and operates reliably through corporate proxies.
 * - Thread-Safety:
 *   ConcurrentHashMap prevents race conditions between HTTP subscription threads
 *   and asynchronous worker threads completing evaluations.
 */
@Service
@Slf4j
public class SseService {

    // 5-minute timeout for AI processing streaming connection
    private static final Long EMITTER_TIMEOUT = 5 * 60 * 1000L;

    private final Map<String, SseEmitter> emitterMap = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(String evaluationId) {
        SseEmitter emitter = new SseEmitter(EMITTER_TIMEOUT);

        emitter.onCompletion(() -> {
            log.info("SSE Stream completed for evaluation: {}", evaluationId);
            emitterMap.remove(evaluationId);
        });

        emitter.onTimeout(() -> {
            log.warn("SSE Stream timed out for evaluation: {}", evaluationId);
            emitter.complete();
            emitterMap.remove(evaluationId);
        });

        emitter.onError(e -> {
            log.error("SSE Stream error for evaluation: {}", evaluationId, e);
            emitterMap.remove(evaluationId);
        });

        emitterMap.put(evaluationId, emitter);

        // Immediate handshake event to verify connection integrity
        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data(Map.of(
                            "evaluationId", evaluationId,
                            "status", "CONNECTED",
                            "message", "SSE stream established. Awaiting evaluation updates."
                    )));
        } catch (IOException e) {
            log.warn("Failed to send initial SSE handshake: {}", evaluationId);
            emitterMap.remove(evaluationId);
        }

        return emitter;
    }

    public void sendEvent(String evaluationId, String eventName, Object data) {
        SseEmitter emitter = emitterMap.get(evaluationId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
                log.info("Dispatched SSE [{}] for evaluationId: {}", eventName, evaluationId);
            } catch (IOException e) {
                log.warn("Client disconnected while sending SSE [{}]. Cleaning up emitter.", eventName);
                emitterMap.remove(evaluationId);
            }
        }
    }

    public void completeEmitter(String evaluationId) {
        SseEmitter emitter = emitterMap.remove(evaluationId);
        if (emitter != null) {
            try {
                emitter.complete();
            } catch (Exception ignored) {}
        }
    }
}

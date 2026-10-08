# 🏛️ Architecture & System Design Deep-Dive

## 1. Concurrency Model & Thread Starvation Elimination

### The Problem in Traditional Synchronous Systems
In standard Spring MVC applications running on Apache Tomcat:
- The servlet engine uses a bounded thread pool (`server.tomcat.threads.max=200`).
- If an endpoint handles file uploading, optical text extraction, and calls a third-party LLM (2–10 seconds per request):
  $$\text{Throughput Limit} = \frac{200 \text{ threads}}{5 \text{ seconds}} = 40 \text{ requests/second}$$
- At 40 RPS, all 200 Tomcat worker threads are blocked waiting on external I/O.
- Subsequent health checks, static assets, and user requests fail with **504 Gateway Timeout**.

### The Solution: Asynchronous Ingestion + SSE
1. **Ingest Thread**: Takes the `MultipartFile`, streams bytes to S3, writes a row to MySQL with status `PENDING`, dispatches task to `@Async`, and releases back to Tomcat's pool in `< 50ms`.
2. **Worker Pool (`ThreadPoolTaskExecutor`)**:
   - `corePoolSize = 5`
   - `maxPoolSize = 20`
   - `queueCapacity = 100`
   - `RejectedExecutionHandler = CallerRunsPolicy`
3. **Reactive Notification**: The worker thread notifies the client via `SseEmitter` once the LLM finishes.

---

## 2. Server-Sent Events vs WebSockets Comparison

| Architectural Attribute | Server-Sent Events (SSE) | WebSockets |
| :--- | :--- | :--- |
| **Directionality** | Unidirectional (Server &rarr; Client) | Bidirectional (Full Duplex) |
| **Transport Protocol** | Standard HTTP/1.1 or HTTP/2 | WebSocket Protocol (`ws://`, `wss://`) |
| **Browser Reconnection** | Built-in native auto-reconnect (`EventSource`) | Must be manually implemented in JS |
| **Firewall / Proxy Traversal** | Works without special proxy configuration | Often blocked or requires `Upgrade` header mapping |
| **Operational Complexity** | Low (Stateless HTTP request cycle) | High (Requires sticky sessions, ping/pong heartbeats) |

---

## 3. Horizontal Scaling & Distributed Path

In a multi-node production cluster:
1. **Queue Decoupling**: Replace local `@Async` with **Amazon SQS** or **RabbitMQ**. The ingest controller pushes messages to the queue.
2. **Distributed SSE Routing**: Use **Redis Pub/Sub** to broadcast completion events across all Spring Boot nodes so whichever instance holds the active `SseEmitter` can deliver the payload to the user.

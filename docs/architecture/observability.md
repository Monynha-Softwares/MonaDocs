---
title: Observability
description: Tracing, metrics, and logging guidance for services and client apps.
---

## Purpose

This document gives practical guidance to add observability to services and frontends used across Monynha projects: tracing, metrics, and logs. It focuses on implementable recipes (OpenTelemetry, Prometheus, Grafana, Jaeger/Loki) and short examples for Node/TypeScript services and client apps.

## Goals

- Provide reproducible instrumentation steps for traces, metrics and logs.
- Show minimal local dev setup (Docker) and production export patterns (OTLP, Prometheus remote_write).
- Recommend alerting and retention defaults.

## Overview

- Traces: OpenTelemetry (OTel) -> OTLP -> backend (Jaeger/Tempo/OTLP collector)
- Metrics: Prometheus exposition (/metrics) or OTLP remote_write -> Prometheus/Gateway
- Logs: Structured JSON logs -> Loki/ELK/Cloud logging

## Quick architecture (recommended)

1. Instrument code with OpenTelemetry for traces and metrics.
2. Export traces/metrics via OTLP to an OpenTelemetry Collector.
3. Collector forwards traces to Tempo/Jaeger, metrics to Prometheus remote write or a metrics backend, and logs to Loki/ELK.

## Node / TypeScript (minimal trace + metrics)

Install the SDK and instrumentations (example):

```bash
yarn add @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http @opentelemetry/exporter-metrics-otlp-http
```

Create an `otel.js` bootstrap that runs before your app (or use `node --require`). Minimal example:

```js
// otel.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const traceExporter = new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_TRACES || 'http://localhost:4318/v1/traces' });
const metricExporter = new OTLPMetricExporter({ url: process.env.OTEL_EXPORTER_OTLP_METRICS || 'http://localhost:4318/v1/metrics' });

const sdk = new NodeSDK({
  traceExporter,
  metricExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
  .then(() => console.log('OpenTelemetry initialized'))
  .catch((err) => console.error('OTEL init error', err));

process.on('SIGTERM', () => {
  sdk.shutdown().then(() => console.log('OTEL shutdown complete')).catch(()=>{});
});
```

Start your service with `node -r ./otel.js server.js` or add the bootstrap into your start script.

### Prisma: add spans to DB calls

Use a Prisma middleware to create spans around queries (example using @opentelemetry/api):

```js
const { trace } = require('@opentelemetry/api');
prisma.$use(async (params, next) => {
  const tracer = trace.getTracer('prisma');
  return tracer.startActiveSpan(`prisma.${params.model}.${params.action}`, async (span) => {
    try {
      return await next(params);
    } finally {
      span.end();
    }
  });
});
```

## Frontend / Flutter (traces & metrics)

- Mobile & web frontends should emit telemetry relevant to UX flows (navigation, API latency, feature toggles). Use lightweight sampling (e.g., 1-5%) for production by default.
- For Flutter, use community OpenTelemetry Dart packages (or the project's preferred vendor SDK). Export traces to an OTLP collector via gRPC/HTTP.

Minimal Flutter snippet (conceptual): create spans for top-level routes and for network requests. Refer to the chosen Dart OTel package docs for exact APIs.

## Local dev (docker-compose)

Use the OpenTelemetry Collector and a Prometheus + Grafana + Jaeger stack locally. Example components:

- otel-collector
- prometheus
- grafana
- jaeger/tempo

Keep the Collector config minimal in dev (receive OTLP, export to Jaeger & Prometheus receiver).

## Metrics: naming and conventions

- Use a predictable naming scheme: `service.<service_name>.<instrument>.<unit>` (e.g. `service.api.request_duration_seconds`).
- Distinguish counters vs gauges vs histograms. Use labels/tags sparingly and with cardinality limits.

## Dashboards and alerts

- Create a small set of standard dashboards: API latency (p50/p95/p99), error rate, request rate, DB query time, CPU/memory, queue backlog.
- Suggested alert thresholds (examples):
  - Error rate > 1% sustained for 5m
  - p95 latency > X ms (service specific)
  - Prometheus target down or scrape failing

## Sampling & cost control

- Use client and server side sampling. For high-volume endpoints prefer head-based sampling with deterministic rules.
- Consider exporting only sampled traces to long-term storage and sending metrics for every request.

## Logs

- Prefer structured logs (JSON) with a small set of fields: timestamp, level, service, env, trace_id, span_id, message, error.
- Correlate logs with traces using trace_id/span_id.

## Retention & storage recommendations

- Traces: keep raw traces for ~7-14 days; store aggregated traces longer if needed.
- Metrics: Prometheus TSDB retention depends on capacity; consider remote_write to managed long-term storage for historical metrics.
- Logs: retention 30-90 days depending on compliance and cost.

## Operational checklist

Before shipping observability changes to prod:

1. Verify traces/metrics are visible in dev environment (local Collector → Jaeger/Grafana).
2. Confirm labels cardinality is bounded.
3. Add at least one dashboard and alert for the changed service.
4. Run a short load test and confirm ingestion and storage behave as expected.

## References & further reading

- OpenTelemetry docs: [OpenTelemetry](https://opentelemetry.io)
- Prometheus best practices: [Prometheus naming guidelines](https://prometheus.io/docs/practices/naming/)
- Grafana dashboards: create small, actionable views first.

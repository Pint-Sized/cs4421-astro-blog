# ADR-001: Transition from Static Site to Server-Rendered Node.js

- **Status:** Accepted
- **Date:** 2026-10-28

## Context

The site currently builds as static HTML. Static hosting cannot execute
request-time Node.js code, which is needed for dynamic API routes such as
`/api/health` and future `/api/feedback` functionality. It also cannot report
the running process's health or emit request-time diagnostics.

## Decision

Configure Astro to render on demand using the community `astro-aws-amplify`
adapter. Serve pages and the health endpoint dynamically, and log each handled
request as a structured JSON object. Use Amplify Hosting's SSR compute for
production deployment.

## Consequences

- **Positive:** Enables dynamic REST endpoints, process health reporting, and
  request-level structured logs without managing container infrastructure.
- **Negative:** Requires server compute, adding cost and operational complexity
  compared with static hosting; the deployment adapter is community-maintained.
- **Deployment note:** The adapter requires Amplify SSR compute with the
  Amazon Linux 2023 custom image setting.

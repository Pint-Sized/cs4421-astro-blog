# ADR-001: Transition from Static Site to Server-Rendered Node.js

- **Status:** Accepted
- **Date:** 2026-10-28

## Context

The site currently builds as static HTML. Static hosting cannot execute
request-time Node.js code, which is needed for dynamic API routes such as
`/api/health` and future `/api/feedback` functionality. It also cannot report
the running process's health or emit request-time diagnostics.

## Decision

Configure Astro to render on demand using the official `@astrojs/node` adapter
in standalone mode for container deployments. Also support the community
`astro-aws-amplify` adapter as a build-time option for Amplify Hosting. Serve
pages and the health endpoint dynamically, and log each handled request as a
structured JSON object.

## Consequences

- **Positive:** Enables dynamic REST endpoints, process health reporting, and
  request-level structured logs; Docker images can run on container platforms.
- **Negative:** Requires server compute, adding cost and operational complexity
  compared with static hosting. Amplify SSR uses a community-maintained adapter.
- **Deployment note:** Standalone Node is the default build. Set
  `ASTRO_ADAPTER=amplify` for the Amplify SSR build; that runtime also needs the
  Amplify Amazon Linux 2023 custom image setting.

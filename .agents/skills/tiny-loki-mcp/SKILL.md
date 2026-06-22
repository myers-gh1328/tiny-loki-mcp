---
name: tiny-loki-mcp
description: Work on tiny-loki-mcp, a generic open-source read-only MCP server for Grafana Loki.
---

Use this skill when changing `tiny-loki-mcp`.

Rules:

- Keep the project generic and open-source clean.
- Do not add private hostnames, domains, IPs, usernames, repo names, or paths.
- Do not expose Loki write, delete, admin, or unbounded query APIs.
- Keep every MCP tool description useful to a cold-start model.
- Keep result limits, lookback windows, and request timeouts bounded.

Validation:

```bash
npm ci
npm test
rg -n "aegir|nanobot|pihole|printpi|phish|dradi|192\\.168|aegirtech|aegirscuba" .
```

# Agent Guidance

This is an open-source MCP server repo. Keep it generic and read-only.

## Boundaries

- Do not add private hostnames, domains, IP addresses, usernames, repo names, or
  deployment paths.
- Do not add secrets, tokens, credentials, or private config.
- Do not expose Loki write, delete, admin, or unbounded query behavior.
- Keep tool descriptions clear enough for a cold-start model to choose the right
  tool.
- Keep query lookback and result limits bounded.

## Checks

Run:

```bash
npm ci
npm test
```

Before publishing changes, scan for accidental private references.

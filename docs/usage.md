# Usage

`tiny-loki-mcp` exposes read-only Grafana Loki queries as Model Context Protocol
tools.

## Tools

- `loki_labels`: list label names.
- `loki_label_values`: list values for one label.
- `loki_query`: run a bounded LogQL range query.
- `loki_recent`: fetch recent logs by optional host and service labels.

## Configuration

Set environment variables for the MCP process:

```bash
LOKI_URL=http://127.0.0.1:3100
LOKI_MAX_LIMIT=500
LOKI_MAX_LOOKBACK_SECONDS=86400
LOKI_TIMEOUT_MS=10000
```

## Run

```bash
npm install
npm run build
LOKI_URL=http://127.0.0.1:3100 node dist/index.js
```

## MCP Client Config

```json
{
  "mcpServers": {
    "tiny-loki": {
      "command": "node",
      "args": ["/path/to/tiny-loki-mcp/dist/index.js"],
      "env": {
        "LOKI_URL": "http://127.0.0.1:3100"
      }
    }
  }
}
```

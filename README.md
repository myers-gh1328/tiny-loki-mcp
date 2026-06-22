# tiny-loki-mcp

`tiny-loki-mcp` is a small read-only Model Context Protocol server for Grafana
Loki. It exposes a narrow set of tools for agents that need to inspect recent
logs without learning Loki's HTTP API.

## Tools

- `loki_labels`: list available label names.
- `loki_label_values`: list values for one label.
- `loki_query`: run a bounded LogQL range query.
- `loki_recent`: fetch recent logs by optional host and service labels.

All tools are read-only. The server does not expose Loki delete, admin, or push
APIs.

## Configuration

Environment variables:

- `LOKI_URL`: Loki base URL. Defaults to `http://127.0.0.1:3100`.
- `LOKI_MAX_LIMIT`: maximum entries per query. Defaults to `500`.
- `LOKI_MAX_LOOKBACK_SECONDS`: maximum lookback window. Defaults to `86400`.
- `LOKI_TIMEOUT_MS`: HTTP request timeout. Defaults to `10000`.

## Run

```bash
npm install
npm run build
LOKI_URL=http://127.0.0.1:3100 node dist/index.js
```

## MCP Client Example

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

## Safety

The server caps query limits and lookback windows. It returns compact records
with labels, timestamp, and line content instead of raw Loki responses.

## License

MIT

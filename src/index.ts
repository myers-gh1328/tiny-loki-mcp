#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { LokiClient } from "./client.js";
import { loadConfig } from "./config.js";
import { buildRecentQuery } from "./logql.js";

const config = loadConfig();
const loki = new LokiClient(config);

const server = new McpServer({
  name: "tiny-loki-mcp",
  version: "0.1.0",
});

server.tool(
  "loki_labels",
  "List Loki label names. Use this before querying when you need to discover available dimensions such as host, service, or level. This is read-only and returns only label names.",
  {},
  async () => {
    const labels = await loki.labels();
    return jsonResult({ labels });
  },
);

server.tool(
  "loki_label_values",
  "List values for one Loki label, such as host or service. Use this to discover valid filter values before running a log query. This is read-only.",
  {
    label: z
      .string()
      .min(1)
      .describe("Label name to inspect, for example host, service, or level."),
  },
  async ({ label }) => {
    const values = await loki.labelValues(label);
    return jsonResult({ label, values });
  },
);

server.tool(
  "loki_query",
  "Run a bounded LogQL range query and return compact log records. Use this when you already know the LogQL selector or need text filters. Do not use this for unbounded or long-history searches; since and limit are capped by server configuration.",
  {
    query: z
      .string()
      .min(1)
      .describe('Bounded LogQL query, for example {host="example"} |= "error".'),
    since: z
      .string()
      .default("30m")
      .describe("Lookback duration such as 30m, 2h, or 1d."),
    limit: z
      .number()
      .int()
      .positive()
      .max(config.maxLimit)
      .default(100)
      .describe("Maximum log entries to return."),
  },
  async ({ query, since, limit }) => {
    const records = await loki.queryRange({ query, since, limit });
    return jsonResult({ query, since, limit, records });
  },
);

server.tool(
  "loki_recent",
  "Fetch recent logs by optional host and service labels. Use this for common troubleshooting when you do not need raw LogQL. At least one of host or service should normally be supplied to avoid broad queries.",
  {
    host: z.string().optional().describe("Optional host label to filter by."),
    service: z.string().optional().describe("Optional service label to filter by."),
    since: z
      .string()
      .default("30m")
      .describe("Lookback duration such as 30m, 2h, or 1d."),
    limit: z
      .number()
      .int()
      .positive()
      .max(config.maxLimit)
      .default(100)
      .describe("Maximum log entries to return."),
  },
  async ({ host, service, since, limit }) => {
    const query = buildRecentQuery({ host, service });
    const records = await loki.queryRange({ query, since, limit });
    return jsonResult({ query, host, service, since, limit, records });
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);

function jsonResult(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

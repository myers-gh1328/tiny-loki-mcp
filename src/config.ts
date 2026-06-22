export type ServerConfig = {
  lokiUrl: string;
  maxLimit: number;
  maxLookbackSeconds: number;
  timeoutMs: number;
};

export function loadConfig(env = process.env): ServerConfig {
  return {
    lokiUrl: stripTrailingSlash(env.LOKI_URL ?? "http://127.0.0.1:3100"),
    maxLimit: parsePositiveInt(env.LOKI_MAX_LIMIT, 500),
    maxLookbackSeconds: parsePositiveInt(env.LOKI_MAX_LOOKBACK_SECONDS, 86400),
    timeoutMs: parsePositiveInt(env.LOKI_TIMEOUT_MS, 10000),
  };
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected positive integer, got ${value}.`);
  }
  return parsed;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

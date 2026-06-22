import { ServerConfig } from "./config.js";
import { rangeToNanoseconds } from "./time.js";

export type LokiLogRecord = {
  timestamp: string;
  labels: Record<string, string>;
  line: string;
};

type LokiResponse<T> = {
  status: string;
  data: T;
  error?: string;
};

type QueryRangeData = {
  resultType: string;
  result: Array<{
    stream: Record<string, string>;
    values: Array<[string, string]>;
  }>;
};

export class LokiClient {
  constructor(private readonly config: ServerConfig) {}

  async labels(): Promise<string[]> {
    const response = await this.get<LokiResponse<string[]>>("/loki/api/v1/labels");
    return response.data;
  }

  async labelValues(label: string): Promise<string[]> {
    const safeLabel = encodeURIComponent(label);
    const response = await this.get<LokiResponse<string[]>>(
      `/loki/api/v1/label/${safeLabel}/values`,
    );
    return response.data;
  }

  async queryRange(input: {
    query: string;
    since: string;
    limit: number;
  }): Promise<LokiLogRecord[]> {
    const limit = Math.min(input.limit, this.config.maxLimit);
    const range = rangeToNanoseconds(
      input.since,
      this.config.maxLookbackSeconds,
    );
    const params = new URLSearchParams({
      query: input.query,
      start: range.start,
      end: range.end,
      limit: String(limit),
      direction: "backward",
    });
    const response = await this.get<LokiResponse<QueryRangeData>>(
      `/loki/api/v1/query_range?${params.toString()}`,
    );

    const records: LokiLogRecord[] = [];
    for (const result of response.data.result) {
      for (const [timestamp, line] of result.values) {
        records.push({ timestamp, labels: result.stream, line });
      }
    }
    return records.slice(0, limit);
  }

  private async get<T>(path: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const url = `${this.config.lokiUrl}${path}`;

    try {
      const response = await fetch(url, { signal: controller.signal });
      const body = (await response.json()) as LokiResponse<unknown>;
      if (!response.ok || body.status === "error") {
        throw new Error(
          `Loki request failed (${response.status}) for ${url}: ${
            body.error ?? response.statusText
          }`,
        );
      }
      return body as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Could not query Loki at ${this.config.lokiUrl}: ${error.message}`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

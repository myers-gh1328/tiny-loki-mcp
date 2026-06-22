export function parseDurationSeconds(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value.trim());
  if (!match) {
    throw new Error("Duration must look like 30s, 15m, 2h, or 1d.");
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier =
    unit === "s" ? 1 : unit === "m" ? 60 : unit === "h" ? 3600 : 86400;
  return amount * multiplier;
}

export function rangeToNanoseconds(
  since: string,
  maxLookbackSeconds: number,
  nowMs = Date.now(),
): { start: string; end: string; seconds: number } {
  const seconds = parseDurationSeconds(since);
  if (seconds > maxLookbackSeconds) {
    throw new Error(
      `Requested lookback ${since} exceeds maximum ${maxLookbackSeconds}s.`,
    );
  }

  const endMs = nowMs;
  const startMs = endMs - seconds * 1000;
  return {
    start: String(BigInt(startMs) * 1_000_000n),
    end: String(BigInt(endMs) * 1_000_000n),
    seconds,
  };
}

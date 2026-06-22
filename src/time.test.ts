import assert from "node:assert/strict";
import test from "node:test";

import { parseDurationSeconds, rangeToNanoseconds } from "./time.js";

test("parseDurationSeconds parses supported units", () => {
  assert.equal(parseDurationSeconds("30s"), 30);
  assert.equal(parseDurationSeconds("15m"), 900);
  assert.equal(parseDurationSeconds("2h"), 7200);
  assert.equal(parseDurationSeconds("1d"), 86400);
});

test("rangeToNanoseconds rejects excessive lookback", () => {
  assert.throws(() => rangeToNanoseconds("2d", 86400), /exceeds maximum/);
});

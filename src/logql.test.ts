import assert from "node:assert/strict";
import test from "node:test";

import { buildRecentQuery, escapeLabelValue } from "./logql.js";

test("escapeLabelValue escapes quotes and slashes", () => {
  assert.equal(escapeLabelValue('a"b\\c'), 'a\\"b\\\\c');
});

test("buildRecentQuery builds host and service selector", () => {
  assert.equal(
    buildRecentQuery({ host: "host-a", service: "svc" }),
    '{host="host-a",service="svc"}',
  );
});

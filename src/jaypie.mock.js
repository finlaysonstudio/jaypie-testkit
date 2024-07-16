import { beforeAll, vi } from "vitest";

import { log } from "@jaypie/core";
import { spyLog } from "./mockLog.module.js";

export * from "@jaypie/aws";
export * from "@jaypie/core";
export * from "@jaypie/express";
export * from "@jaypie/datadog";
export * from "@jaypie/lambda";
export * from "@jaypie/mongoose";

beforeAll(() => {
  spyLog(log);
});

// afterEach(() => {
// This is not necessary because the log isn't being used outside tests:
// restoreLog(log);
// The is the client's responsibility:
// vi.clearAllMocks();
// });

export const connect = vi.fn(() => {
  return true;
});

export const disconnect = vi.fn(() => {
  return true;
});

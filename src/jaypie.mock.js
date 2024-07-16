import { getMessages as originalGetMessages } from "@jaypie/aws";
import { uuid as originalUuid } from "@jaypie/core";
import { JAYPIE, log } from "@jaypie/core";
import { beforeAll, vi } from "vitest";

import { spyLog } from "./mockLog.module.js";

//
//
// Setup
//

const TAG = JAYPIE.LIB.TESTKIT;

// Export all the modules from Jaypie packages:

export * from "@jaypie/aws";
export * from "@jaypie/core";
export * from "@jaypie/express";
export * from "@jaypie/datadog";
export * from "@jaypie/lambda";
export * from "@jaypie/mongoose";

// Spy on log:

beforeAll(() => {
  spyLog(log);
});

// afterEach(() => {
// This is not necessary because the log isn't being used outside tests:
// restoreLog(log);
// The is the client's responsibility:
// vi.clearAllMocks();
// });

//
//
// Mock Functions
//

// @jaypie/aws

export const getMessages = vi.fn((...params) => originalGetMessages(...params));

export const getSecret = vi.fn(() => {
  return `_MOCK_SECRET_[${TAG}]`;
});

export const sendBatchMessages = vi.fn(() => {
  // TODO: better default value
  return { value: `_MOCK_BATCH_MESSAGES_[${TAG}]` };
});

export const sendMessage = vi.fn(() => {
  // TODO: better default value
  return { value: `_MOCK_MESSAGE_[${TAG}]` };
});

// @jaypie/core Functions

export const envBoolean = vi.fn(() => {
  return true;
});

export const sleep = vi.fn(() => {
  return true;
});

export const uuid = vi.fn(originalUuid);

// @jaypie/datadog

export const submitMetric = vi.fn(() => {
  return true;
});

export const submitMetricSet = vi.fn(() => {
  return true;
});

// @jaypie/mongoose

export const connect = vi.fn(() => {
  return true;
});

export const connectFromSecretEnv = vi.fn(() => {
  return true;
});

export const disconnect = vi.fn(() => {
  return true;
});

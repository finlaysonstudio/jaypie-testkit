import { getMessages as originalGetMessages } from "@jaypie/aws";
import { force, uuid as originalUuid } from "@jaypie/core";
import { BadRequestError, JAYPIE, log, UnavailableError } from "@jaypie/core";
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

export const jaypieHandler = vi.fn(
  (
    handler,
    {
      setup = [],
      teardown = [],
      unavailable = force.boolean(process.env.PROJECT_UNAVAILABLE),
      validate = [],
    } = {},
  ) => {
    return async (...args) => {
      let result;
      let thrownError;
      if (unavailable) throw new UnavailableError();
      for (const validator of validate) {
        if (typeof validator === "function") {
          const valid = await validator(...args);
          if (valid === false) {
            throw new BadRequestError();
          }
        }
      }
      try {
        for (const setupFunction of setup) {
          if (typeof setupFunction === "function") {
            await setupFunction(...args);
          }
        }
        result = handler(...args);
      } catch (error) {
        thrownError = error;
      }
      for (const teardownFunction of teardown) {
        if (typeof teardownFunction === "function") {
          try {
            await teardownFunction(...args);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
      }
      if (thrownError) {
        throw thrownError;
      }
      return result;
    };
  },
);

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

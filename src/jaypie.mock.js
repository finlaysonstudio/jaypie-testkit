import { getMessages as originalGetMessages } from "@jaypie/aws";
import { force, uuid as originalUuid } from "@jaypie/core";
import {
  BadRequestError,
  HTTP,
  JAYPIE,
  log,
  UnavailableError,
} from "@jaypie/core";
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

// @jaypie/express

export const expressHandler = vi.fn((handler, props = {}) => {
  if (typeof handler !== "function") {
    throw new BadRequestError("handler must be a function");
  }
  if (!props) {
    props = {};
  }
  props.setup = force.array(props.setup); // allows a single item
  props.teardown = force.array(props.teardown); // allows a single item
  if (!Array.isArray(props.setup)) {
    props.setup = [];
  }
  if (props.locals === null) {
    throw new BadRequestError("locals cannot be null");
  }
  if (props.locals) {
    if (typeof props.locals !== "object" || Array.isArray(props.locals)) {
      throw new BadRequestError("locals must be an object");
    }
    // Locals
    const keys = Object.keys(props.locals);
    if (keys.length > 0) {
      props.setup.push((req = {}) => {
        if (typeof req !== "object") {
          throw new BadRequestError("req must be an object");
        }
        // Set req.locals if it doesn't exist
        if (!req.locals) req.locals = {};
        if (typeof req.locals !== "object" || Array.isArray(req.locals)) {
          throw new BadRequestError("req.locals must be an object");
        }
        if (!req.locals._jaypie) req.locals._jaypie = {};
      });
      const localsSetup = async (localsReq, localsRes) => {
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          if (typeof props.locals[key] === "function") {
            // eslint-disable-next-line no-await-in-loop
            localsReq.locals[key] = await props.locals[key](
              localsReq,
              localsRes,
            );
          } else {
            localsReq.locals[key] = props.locals[key];
          }
        }
      };
      props.setup.push(localsSetup);
    }
  }
  const jaypieFunction = jaypieHandler(handler, props);
  return async (req, res = {}, ...extra) => {
    // For mocking, let's make sure res json, send, and status are functions
    const status = HTTP.CODE.OK;
    if (res && typeof res.status === "function") {
      res.status(200);
    }
    const response = jaypieFunction(req, res, ...extra);
    if (response) {
      if (typeof response === "object") {
        if (typeof response.json === "function") {
          if (res && typeof res.json === "function") {
            res.json(response.json());
          }
        } else {
          if (res && typeof res.status === "function") {
            res.status(status).json(response);
          }
        }
      } else if (typeof response === "string") {
        try {
          if (res && typeof res.status === "function") {
            res.status(status).json(JSON.parse(response));
          }
        } catch (error) {
          if (res && typeof res.status === "function") {
            res.status(status).send(response);
          }
        }
      } else if (response === true) {
        if (res && typeof res.status === "function") {
          res.status(HTTP.CODE.CREATED).send();
        }
      } else {
        if (res && typeof res.status === "function") {
          res.status(status).send(response);
        }
      }
    } else {
      // No response
      if (res && typeof res.status === "function") {
        res.status(HTTP.CODE.NO_CONTENT).send();
      }
    }
    return response;
  };
});

// @jaypie/lambda

// For testing, this is the same as the jaypieHandler
export const lambdaHandler = vi.fn((handler, props = {}) => {
  return jaypieHandler(handler, props);
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

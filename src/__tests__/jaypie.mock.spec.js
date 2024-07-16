import { afterEach, describe, expect, it, vi } from "vitest";

import { mongoose as expectedMongoose } from "@jaypie/mongoose";

import matchers from "../matchers.module.js";
import sqsTestRecords from "../sqsTestRecords.function.js";

// Subject
import {
  connect,
  connectFromSecretEnv,
  disconnect,
  envBoolean,
  getMessages,
  getSecret,
  mongoose,
  sendBatchMessages,
  sendMessage,
  sleep,
  submitMetric,
  submitMetricSet,
  uuid,
} from "../jaypie.mock.js";

// Add custom matchers
expect.extend(matchers);

//
//
// Mock modules
//

afterEach(() => {
  vi.clearAllMocks();
});

//
//
// Run tests
//

describe("Jaypie Mock", () => {
  it("Exports mocks we expect", async () => {
    expect(connect).toBeFunction();
    expect(connect).not.toHaveBeenCalled();
    expect(disconnect).toBeFunction();
    expect(disconnect).not.toHaveBeenCalled();
  });
  describe("Jaypie Packages", () => {
    describe("Jaypie AWS", () => {
      it("Mocks expected function", () => {
        expect(getMessages).not.toHaveBeenCalled();
        expect(getSecret).not.toHaveBeenCalled();
        expect(sendBatchMessages).not.toHaveBeenCalled();
        expect(sendMessage).not.toHaveBeenCalled();
      });
      it("Mocks return appropriate values", () => {
        expect(getSecret()).toBeString();
        expect(sendBatchMessages()).toBeObject();
        expect(sendMessage()).toBeObject();
      });
      it("sqsTestRecords mock returns appropriate values", () => {
        // Arrange
        const testRecords = sqsTestRecords(
          { MessageId: 1, Body: "Hello, World!" },
          { MessageId: 2, Body: "Goodbye, World!" },
        );
        // Assure
        expect(getMessages).not.toHaveBeenCalled();
        expect(testRecords).toBeObject();
        expect(testRecords.Records).toBeArray();
        expect(testRecords.Records[0].body).toBeString();
        // Act
        const messages = getMessages(testRecords);
        // Assert
        expect(getMessages).toHaveBeenCalled();
        expect(messages).toBeArray();
        expect(messages).toHaveLength(2);
        expect(messages[0].Body).toBe("Hello, World!");
        expect(messages[1].MessageId).toBe(2);
      });
      // it("Utility functions remain unaltered", () => {});
    });
    describe("Jaypie Mongoose", () => {
      it("Mocks expected function", () => {
        expect(connect).not.toHaveBeenCalled();
        expect(connectFromSecretEnv).not.toHaveBeenCalled();
        expect(disconnect).not.toHaveBeenCalled();
      });
      it("Mocks return appropriate values", () => {
        expect(connect()).toBeTrue();
        expect(connectFromSecretEnv()).toBeTrue();
        expect(disconnect()).toBeTrue();
      });
      it("Mongoose is unaltered (for now)", () => {
        expect(mongoose).toBe(expectedMongoose);
      });
      it.todo("Mocks mongoose", () => {
        expect(vi.isMockFunction(mongoose)).toBeTrue();
        expect(vi.isMockFunction(mongoose.connect)).toBeTrue();
      });
    });
    describe("Jaypie Datadog", () => {
      it("Mocks expected function", () => {
        expect(vi.isMockFunction(submitMetric)).toBeTrue();
        expect(vi.isMockFunction(submitMetricSet)).toBeTrue();
      });
      it("Mocks return appropriate values", () => {
        expect(submitMetric()).toBeTrue();
        expect(submitMetricSet()).toBeTrue();
      });
    });
    describe("Jaypie Core Utilities", () => {
      it("Mocks expected function", () => {
        expect(vi.isMockFunction(envBoolean)).toBeTrue();
        expect(vi.isMockFunction(sleep)).toBeTrue();
        expect(vi.isMockFunction(uuid)).toBeTrue();
      });
      it("Mocks return appropriate values", () => {
        expect(envBoolean()).toBeTrue();
        expect(sleep()).toBeTrue();
        expect(uuid()).toBeString();
        expect(uuid()).toMatchUuid();
        uuid.mockReturnValueOnce("1234");
        expect(uuid()).not.toMatchUuid();
      });
    });
  }); // END describe Jaypie Packages
});

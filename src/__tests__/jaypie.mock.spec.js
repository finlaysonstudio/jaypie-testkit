import { afterEach, describe, expect, it, vi } from "vitest";

// Subject
import {
  connect,
  disconnect,
  getMessages,
  getSecret,
  sendBatchMessages,
  sendMessage,
} from "../jaypie.mock.js";

import sqsTestRecords from "../sqsTestRecords.function.js";

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
  });
});

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
        // expect(getMessages()).toBeObject();
        expect(getSecret()).toBeString();
        expect(sendBatchMessages()).toBeObject();
        expect(sendMessage()).toBeObject();
      });
      // it("Utility functions remain unaltered", () => {});
    });
  });
});

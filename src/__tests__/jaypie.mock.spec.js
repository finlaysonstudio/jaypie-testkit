import { afterEach, describe, expect, it, vi } from "vitest";

// Subject
import { connect, disconnect } from "../jaypie.mock.js";

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
});

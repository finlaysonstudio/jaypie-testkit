import { describe, expect, it } from "vitest";

// Subject
import { matchers, mockLogFactory, restoreLog, spyLog } from "../index.js";

//
//
// Run tests
//

describe("Index", () => {
  it("Exports functions", () => {
    expect(mockLogFactory).toBeFunction();
    expect(restoreLog).toBeFunction();
    expect(spyLog).toBeFunction();
  });
  it("Exports matchers", () => {
    expect(matchers).toBeObject();
  });
});

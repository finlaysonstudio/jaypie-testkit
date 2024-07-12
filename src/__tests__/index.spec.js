import { describe, expect, it } from "vitest";

// Subject
import {
  RE_BASE64_PATTERN,
  jsonApiErrorSchema,
  jsonApiSchema,
  matchers,
  mockLogFactory,
  restoreLog,
  spyLog,
  sqsTestRecords,
} from "../index.js";

//
//
// Run tests
//

describe("Index", () => {
  it("Exports functions", () => {
    expect(mockLogFactory).toBeFunction();
    expect(restoreLog).toBeFunction();
    expect(spyLog).toBeFunction();
    expect(sqsTestRecords).toBeFunction();
  });
  it("Exports matchers", () => {
    expect(jsonApiErrorSchema).toBeObject();
    expect(jsonApiSchema).toBeObject();
    expect(matchers).toBeObject();
  });
  describe("Constants", () => {
    describe("Base64", () => {
      it("Is a regex", () => {
        expect("abcd12345JKL+/").toMatch(RE_BASE64_PATTERN);
        expect("taco town").not.toMatch(RE_BASE64_PATTERN);
      });
    });
  });
});

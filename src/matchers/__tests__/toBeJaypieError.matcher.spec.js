// eslint-disable-next-line no-unused-vars
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ConfigurationError } from "@jaypie/core";

// Subject
import toBeJaypieError from "../toBeJaypieError.matcher.js";

//
//
// Mock constants
//

//
//
// Mock modules
//

//
//
// Mock environment
//

const DEFAULT_ENV = process.env;
beforeEach(() => {
  process.env = { ...process.env };
});
afterEach(() => {
  process.env = DEFAULT_ENV;
});

//
//
// Run tests
//

describe("To Be Jaypie Error Matcher", () => {
  it("Is a function", () => {
    expect(toBeJaypieError).toBeFunction();
  });
  it("Matches instances of Jaypie error objects", () => {
    const error = new ConfigurationError();
    const result = toBeJaypieError(error);
    expect(result.message).toBeFunction();
    expect(result.message()).toBeString();
    expect(result.pass).toBeTrue();
  });
  it("Rejects instances of plain error objects", () => {
    const error = new Error(
      "If this is your first night at Fight Club, you have to fight",
    );
    const result = toBeJaypieError(error);
    expect(result.message).toBeFunction();
    expect(result.message()).toBeString();
    expect(result.pass).toBeFalse();
  });
  it.todo("Matches plain old json errors");
  it.todo("Rejects if non-object passed");
  it.todo("Rejects if no errors array");
  it.todo("Rejects if errors array is empty");
  it.todo("Must match the entire json:api error schema");
});

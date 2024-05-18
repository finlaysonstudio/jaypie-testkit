import { ConfigurationError } from "@jaypie/core";
import { describe, expect, it } from "vitest";

// Subject
import toThrowJaypieError from "../toThrowJaypieError.matcher.js";

expect.extend({ toThrowJaypieError });

//
//
// Mock functions
//

const plainFunction = () => {
  return "Hello, World!";
};

const errorFunction = () => {
  throw new Error("This is an error");
};

const jaypieErrorFunction = () => {
  throw new ConfigurationError("This is a Jaypie error");
};

const asyncPlainFunction = async () => {
  return "Hello, World!";
};

const asyncErrorFunction = async () => {
  throw new Error("This is an error");
};

const asyncJaypieErrorFunction = async () => {
  throw new ConfigurationError("This is a Jaypie error");
};

//
//
// Run tests
//

describe("To Throw Jaypie Error Matcher", () => {
  it("Works", () => {
    const response = toThrowJaypieError(plainFunction);
    expect(response).not.toBeUndefined();
  });
  describe("Matcher Function", () => {
    describe("Error Cases", () => {
      it("Always fails non-functions", async () => {
        const result = await toThrowJaypieError("Hello, World!");
        expect(result.message).toBeFunction();
        expect(result.message()).toBeString();
        expect(result.pass).toBeFalse();
      });
    });
    describe("Rejection Cases", () => {
      it("Rejects functions that do not error", async () => {
        const result = await toThrowJaypieError(plainFunction);
        expect(result.message).toBeFunction();
        expect(result.message()).toBeString();
        expect(result.pass).toBeFalse();
      });
      it("Rejects functions with plain errors", async () => {
        const result = await toThrowJaypieError(errorFunction);
        expect(result.message).toBeFunction();
        expect(result.message()).toBeString();
        expect(result.pass).toBeFalse();
      });
    });
    describe("Acceptance Cases", () => {
      it("Accepts functions with Jaypie errors", async () => {
        const result = await toThrowJaypieError(jaypieErrorFunction);
        expect(result.message).toBeFunction();
        expect(result.message()).toBeString();
        expect(result.pass).toBeTrue();
      });
    });
  });
  describe("Extending Expect", () => {
    it("Extends expect", () => {
      expect(expect().toThrowJaypieError).toBeFunction();
    });
    it("Works with expect", () => {
      expect(errorFunction).not.toThrowJaypieError();
      expect(plainFunction).not.toThrowJaypieError();
      expect(jaypieErrorFunction).toThrowJaypieError();
    });
    it("Works with async", async () => {
      expect(errorFunction).not.toThrowJaypieError();
      expect(plainFunction).not.toThrowJaypieError();
      expect(jaypieErrorFunction).toThrowJaypieError();
      expect(asyncErrorFunction).not.toThrowJaypieError();
      expect(asyncPlainFunction).not.toThrowJaypieError();
      expect(asyncJaypieErrorFunction).toThrowJaypieError();
    });
    it("Works with async expect", async () => {
      await expect(errorFunction).not.toThrowJaypieError();
      await expect(plainFunction).not.toThrowJaypieError();
      await expect(jaypieErrorFunction).toThrowJaypieError();
      await expect(asyncErrorFunction).not.toThrowJaypieError();
      await expect(asyncPlainFunction).not.toThrowJaypieError();
      await expect(asyncJaypieErrorFunction).toThrowJaypieError();
    });
    it("Always fails non-functions", () => {
      expect("Hello, World!").not.toThrowJaypieError();
    });
  });
});

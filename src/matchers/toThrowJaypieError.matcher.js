import { isJaypieError } from "@jaypie/core";

//
//
// Main
//

const toThrowJaypieError = async (received, expected) => {
  const isAsync =
    received.constructor.name === "AsyncFunction" ||
    received.constructor.name === "Promise";

  // If expected is a function, call it
  if (typeof expected === "function") {
    expected = expected();
  }

  try {
    const result = received();

    if (isAsync) {
      await result;
    }

    // If no error is thrown, fail the test
    return {
      pass: false,
      message: () =>
        "Expected function to throw a JaypieError, but it did not throw.",
    };
  } catch (error) {
    if (isJaypieError(error)) {
      // If expected is also a JaypieError, check if the error matches
      if (isJaypieError(expected)) {
        // If the error does not match, fail the test
        if (error._type !== expected._type) {
          return {
            pass: false,
            message: () =>
              `Expected function to throw "${expected._type}", but it threw "${error._type}"`,
          };
        }
      }
      return {
        pass: true,
        message: () =>
          `Expected function not to throw a JaypieError, but it threw ${error}`,
      };
    }

    return {
      pass: false,
      message: () =>
        `Expected function to throw a JaypieError, but it threw ${error}`,
    };
  }
};

//
//
// Export
//

export default toThrowJaypieError;

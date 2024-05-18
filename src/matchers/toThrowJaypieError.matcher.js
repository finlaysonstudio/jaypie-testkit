//
//
// Main
//

const toThrowJaypieError = async (received) => {
  const isAsync =
    received.constructor.name === "AsyncFunction" ||
    received.constructor.name === "Promise";

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
    if (
      error &&
      error.isProjectError === true &&
      typeof error.json === "function"
    ) {
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

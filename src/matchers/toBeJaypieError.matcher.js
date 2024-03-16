//
//
// Constants
//

//
//
// Helper Functions
//

function isErrorObjectJaypieError(error) {
  if (error.isProjectError) {
    return {
      message: () => `expected "${error}" not to be a Jaypie error`,
      pass: true,
    };
  }
  return {
    message: () => `expected "${error}" to be a Jaypie error`,
    pass: false,
  };
}

//
//
// Main
//

const toBeJaypieError = (received) => {
  // See if it is an instance of error:
  if (received instanceof Error) {
    return isErrorObjectJaypieError(received);
  }

  const pass =
    received.errors &&
    Array.isArray(received.errors) &&
    received.errors.length > 0;
  if (pass) {
    return {
      message: () => `expected ${received} not to be a Jaypie error`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected ${received} to be a Jaypie error`,
      pass: false,
    };
  }
};

//
//
// Export
//

export default toBeJaypieError;

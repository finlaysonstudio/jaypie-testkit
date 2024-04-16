//
//
// Constants
//

//
//
// Helper Functions
//

//
//
// Main
//

const toBeClass = (received) => {
  let pass = false;
  if (typeof received === "function") {
    try {
      // eslint-disable-next-line new-cap, no-new
      new received();
      pass = true;
    } catch (e) {
      pass = false;
    }
  }
  if (pass) {
    return {
      message: () => `expected ${received} not to be a class`,
      pass: true,
    };
  }
  return {
    message: () => `expected ${received} to be a class`,
    pass: false,
  };
};

//
//
// Export
//

export default toBeClass;

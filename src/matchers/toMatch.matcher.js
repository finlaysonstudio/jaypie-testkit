import { RE_UUID_PATTERN } from "../constants.js";

//
//
// Main
//

/**
 * Determines if subject matches a UUID pattern.
 * Does _NOT_ check if the UUID is valid.
 * @param {String} subject
 */
const toMatchUuid = (subject) => {
  if (RE_UUID_PATTERN.test(subject)) {
    return {
      message: () => `expected "${subject}" not to match a UUID`,
      pass: true,
    };
  }
  return {
    message: () => `expected "${subject}" to match a UUID`,
    pass: false,
  };
};

//
//
// Export
//

export { toMatchUuid };

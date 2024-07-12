import { RE_UUID_PATTERN } from "../constants.js";

//
//
// Helper
//

function forSubjectToMatchPattern(
  subject,
  pattern,
  { patternName = "pattern" } = {},
) {
  if (pattern.test(subject)) {
    return {
      message: () => `expected "${subject}" not to match ${patternName}`,
      pass: true,
    };
  }
  return {
    message: () => `expected "${subject}" to match ${patternName}`,
    pass: false,
  };
}

//
//
// Main
//

/**
 * Determines if subject matches a UUID pattern.
 * Does _NOT_ check if the UUID is valid.
 * @param {String} subject
 */
export const toMatchUuid = (subject) =>
  forSubjectToMatchPattern(subject, RE_UUID_PATTERN, {
    patternName: "UUID",
  });

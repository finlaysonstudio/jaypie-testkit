import { matchers as jsonSchemaMatchers } from "jest-json-schema";

import toBeJaypieError from "./matchers/toBeJaypieError.matcher.js";

//
//
// Export
//

export default {
  toBeJaypieError,
  toBeValidSchema: jsonSchemaMatchers.toBeValidSchema,
  toMatchSchema: jsonSchemaMatchers.toMatchSchema,
};

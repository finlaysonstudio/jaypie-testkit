import { matchers as jsonSchemaMatchers } from "jest-json-schema";

import toBeClass from "./matchers/toBeClass.matcher.js";
import toBeJaypieError from "./matchers/toBeJaypieError.matcher.js";

//
//
// Export
//

export default {
  toBeClass,
  toBeJaypieError,
  toBeValidSchema: jsonSchemaMatchers.toBeValidSchema,
  toMatchSchema: jsonSchemaMatchers.toMatchSchema,
};

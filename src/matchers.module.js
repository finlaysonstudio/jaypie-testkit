import { matchers as jsonSchemaMatchers } from "jest-json-schema";

//
//
// Export
//

export default {
  toBeValidSchema: jsonSchemaMatchers.toBeValidSchema,
  toMatchSchema: jsonSchemaMatchers.toMatchSchema,
};

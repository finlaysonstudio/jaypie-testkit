import { matchers as jsonSchemaMatchers } from "jest-json-schema";

import toBeCalledWithInitialParams from "./matchers/toBeCalledWithInitialParams.matcher.js";
import toBeClass from "./matchers/toBeClass.matcher.js";
import toBeJaypieError from "./matchers/toBeJaypieError.matcher.js";
import toThrowJaypieError, {
  toThrowBadRequestError,
  toThrowConfigurationError,
  toThrowForbiddenError,
  toThrowInternalError,
  toThrowNotFoundError,
  toThrowUnauthorizedError,
} from "./matchers/toThrowJaypieError.matcher.js";

import {
  toMatchBase64,
  toMatchJwt,
  toMatchMongoId,
  toMatchSignedCookie,
  toMatchUuid4,
  toMatchUuid5,
  toMatchUuid,
} from "./matchers/toMatch.matcher.js";

//
//
// Export
//

export default {
  toBeCalledWithInitialParams,
  toBeClass,
  toBeJaypieError,
  toBeValidSchema: jsonSchemaMatchers.toBeValidSchema,
  toMatchBase64,
  toMatchJwt,
  toMatchMongoId,
  toMatchSchema: jsonSchemaMatchers.toMatchSchema,
  toMatchSignedCookie,
  toMatchUuid4,
  toMatchUuid5,
  toMatchUuid,
  toThrowBadRequestError,
  toThrowConfigurationError,
  toThrowForbiddenError,
  toThrowInternalError,
  toThrowJaypieError,
  toThrowNotFoundError,
  toThrowUnauthorizedError,
};

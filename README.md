# Jaypie Testkit 🐦‍⬛🫒

Test utilities built for Jaypie

## 📋 Usage

### Installation

```bash
npm install --save-dev @jaypie/testkit
```

### Example

#### Log Spying

```javascript
import { restoreLog, spyLog } from "@jaypie/testkit";
import { log } from "@jaypie/core";

beforeEach(() => {
  spyLog(log);
});
afterEach(() => {
  restoreLog(log);
  vi.clearAllMocks();
});

test("log", () => {
  log.warn("Danger");
  expect(log.warn).toHaveBeenCalled();
  expect(log.error).not.toHaveBeenCalled();
});
```

👺 Logging Conventions:

* Only use `log.trace` or `log.var` during "happy path"
* Use `log.debug` for edge cases
* Now you can add an "observability" test that will fail as soon as new code triggers an unexpected edge condition

```javascript
describe("Observability", () => {
  it("Does not log above trace", async () => {
    // Arrange
    // TODO: "happy path" setup
    // Act
    await myNewFunction(); // TODO: add any "happy path" parameters
    // Assert
    expect(log.debug).not.toHaveBeenCalled();
    expect(log.info).not.toHaveBeenCalled();
    expect(log.warn).not.toHaveBeenCalled();
    expect(log.error).not.toHaveBeenCalled();
    expect(log.fatal).not.toHaveBeenCalled();
  });
});
```

> 👺 Follow the "arrange, act, assert" pattern

#### Test Matchers

testSetup.js

```javascript
import { matchers as jaypieMatchers } from "@jaypie/testkit";
import * as extendedMatchers from "jest-extended";
import { expect } from "vitest";

expect.extend(extendedMatchers);
expect.extend(jaypieMatchers);
```

test.spec.js

```javascript
import { ConfigurationError } from "@jaypie/core";

const error = new ConfigurationError();
const json = error.json();
expect(error).toBeJaypieError();
expect(json).toBeJaypieError();
```

## 📖 Reference

```
import { 
  LOG,
  jsonApiErrorSchema,
  jsonApiSchema,
  matchers,
  mockLogFactory,
  restoreLog,
  spyLog,
} from '@jaypie/testkit'
```

### `LOG`

`LOG` constant provided by `@jaypie/core` for convenience

```javascript
import { log } from "@jaypie/core";
import { LOG } from "@jaypie/testkit";

const libLogger = log.lib({ level: LOG.LEVEL.WARN, lib: "myLib" });
```

### `jsonApiErrorSchema`

A [JSON Schema](https://json-schema.org/) validator for the [JSON:API](https://jsonapi.org/) error schema. Powers the `toBeJaypieError` matcher (via `toMatchSchema`).

### `jsonApiSchema`

A [JSON Schema](https://json-schema.org/) validator for the [JSON:API](https://jsonapi.org/) data schema.

### `matchers`

```javascript
export default {
  toBeCalledWithInitialParams,
  toBeClass,
  toBeJaypieError,
  toBeValidSchema: jsonSchemaMatchers.toBeValidSchema,
  toMatchSchema: jsonSchemaMatchers.toMatchSchema,
  toThrowBadRequestError,
  toThrowConfigurationError,
  toThrowForbiddenError,
  toThrowInternalError,
  toThrowJaypieError,
  toThrowNotFoundError,
  toThrowUnauthorizedError,
};
```

testSetup.js

```javascript
import { matchers as jaypieMatchers } from "@jaypie/testkit";
import * as extendedMatchers from "jest-extended";
import { expect } from "vitest";

expect.extend(extendedMatchers);
expect.extend(jaypieMatchers);
```

#### `expect(subject).toBeJaypieError()`

Validates instance objects:

```javascript
try {
  throw new Error("Sorpresa!");
} catch (error) {
  expect(error).not.toBeJaypieError();
}
```

Validates plain old JSON:

```javascript
expect({ errors: [ { status, title, detail } ] }).toBeJaypieError();
```

Jaypie errors, which are `ProjectErrors`, all have a `.json()` to convert

#### `expect(subject).toBeValidSchema()`

```javascript
import { jsonApiErrorSchema, jsonApiSchema } from "@jaypie/testkit";

expect(jsonApiErrorSchema).toBeValidSchema();
expect(jsonApiSchema).toBeValidSchema();
expect({ project: "mayhem" }).not.toBeValidSchema();
```

From `jest-json-schema` [toBeValidSchema.js](https://github.com/americanexpress/jest-json-schema/blob/main/matchers/toBeValidSchema.js) (not documented in README)

#### `expect(subject).toMatchSchema(schema)`

```javascript
import { jsonApiErrorSchema, jsonApiSchema } from "@jaypie/testkit";
import { ConfigurationError } from "@jaypie/core";

const error = new ConfigurationError();
const json = error.json();
expect(json).toMatchSchema(jsonApiErrorSchema);
expect(json).not.toMatchSchema(jsonApiSchema);
```

From `jest-json-schema`; see [README](https://github.com/americanexpress/jest-json-schema?tab=readme-ov-file#tomatchschemaschema)

### `mockLogFactory()`

Creates a mock of the `log` provided by `@jaypie/core`.

```javascript
import { mockLogFactory } from "@jaypie/testkit";

const log = mockLogFactory();
log.warn("Danger");
expect(log.warn).toHaveBeenCalled();
expect(log.error).not.toHaveBeenCalled();
```

### `restoreLog(log)`

Restores the `log` provided by `@jaypie/core`, commonly performed `afterEach` with `spyLog` in `beforeEach`. See example with `spyLog`.

### `spyLog(log)`

Spies on the `log` provided by `@jaypie/core`, commonly performed `beforeEach` with `restoreLog` in `afterEach`.

```javascript
import { restoreLog, spyLog } from "@jaypie/testkit";
import { log } from "@jaypie/core";

beforeEach(() => {
  spyLog(log);
});
afterEach(() => {
  restoreLog(log);
  vi.clearAllMocks();
});

test("log", () => {
  log.warn("Danger");
  expect(log.warn).toHaveBeenCalled();
  expect(log.error).not.toHaveBeenCalled();
});
```

### `sqsTestRecords(message, message, ...)` or `sqsTestRecords([...])`

Generates an event object for testing SQS Lambda functions with as many messages as provided. Note, test will accept more than ten messages, but AWS will only send ten at a time.

```javascript
import { sqsTestRecords } from "@jaypie/testkit";

const event = sqsTestRecords(
  { MessageId: "1", Body: "Hello, World!" },
  { MessageId: "2", Body: "Goodbye, World!" }
);
```

## 🌠 Wishlist

* matcher toBeHttpStatus
* matcher toBeJaypieAny
* matcher toBeJaypieData
* matcher toBeJaypieDataObject
* matcher toBeJaypieDataArray
* matcher toThrowJaypieError
* ...@knowdev/jest

## 📝 Changelog

| Date       | Version | Summary        |
| ---------- | ------- | -------------- |
|  3/20/2024 |   1.0.2 | Export `LOG`   |
|  3/16/2024 |   1.0.0 | Artists ship   |
|  3/15/2024 |   0.1.0 | Initial deploy |
|  3/15/2024 |   0.0.1 | Initial commit |

## 📜 License

Published by Finlayson Studio. All rights reserved

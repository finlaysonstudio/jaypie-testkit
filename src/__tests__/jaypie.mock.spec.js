import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mongoose as expectedMongoose } from "@jaypie/mongoose";

import matchers from "../matchers.module.js";
import sqsTestRecords from "../sqsTestRecords.function.js";

// Subject
import {
  connect,
  connectFromSecretEnv,
  disconnect,
  envBoolean,
  getMessages,
  getSecret,
  HTTP,
  jaypieHandler,
  log,
  mongoose,
  ProjectError,
  sendBatchMessages,
  sendMessage,
  sleep,
  submitMetric,
  submitMetricSet,
  uuid,
} from "../jaypie.mock.js";

// Add custom matchers
expect.extend(matchers);

//
//
// Mock modules
//

afterEach(() => {
  vi.clearAllMocks();
});

//
//
// Run tests
//

describe("Jaypie Mock", () => {
  it("Exports constants we expect", async () => {
    expect(HTTP).toBeObject();
    expect(HTTP.CODE.INTERNAL_ERROR).toBe(500);
  });
  describe("Jaypie Packages", () => {
    describe("Jaypie AWS", () => {
      it("Mocks expected function", () => {
        expect(getMessages).not.toHaveBeenCalled();
        expect(getSecret).not.toHaveBeenCalled();
        expect(sendBatchMessages).not.toHaveBeenCalled();
        expect(sendMessage).not.toHaveBeenCalled();
      });
      it("Mocks return appropriate values", () => {
        expect(getSecret()).toBeString();
        expect(sendBatchMessages()).toBeObject();
        expect(sendMessage()).toBeObject();
      });
      it("sqsTestRecords mock returns appropriate values", () => {
        // Arrange
        const testRecords = sqsTestRecords(
          { MessageId: 1, Body: "Hello, World!" },
          { MessageId: 2, Body: "Goodbye, World!" },
        );
        // Assure
        expect(getMessages).not.toHaveBeenCalled();
        expect(testRecords).toBeObject();
        expect(testRecords.Records).toBeArray();
        expect(testRecords.Records[0].body).toBeString();
        // Act
        const messages = getMessages(testRecords);
        // Assert
        expect(getMessages).toHaveBeenCalled();
        expect(messages).toBeArray();
        expect(messages).toHaveLength(2);
        expect(messages[0].Body).toBe("Hello, World!");
        expect(messages[1].MessageId).toBe(2);
      });
      // it("Utility functions remain unaltered", () => {});
    });
    describe("Jaypie Core Utilities", () => {
      it("Mocks expected function", () => {
        expect(vi.isMockFunction(envBoolean)).toBeTrue();
        expect(vi.isMockFunction(sleep)).toBeTrue();
        expect(vi.isMockFunction(uuid)).toBeTrue();
      });
      it("Mocks return appropriate values", () => {
        expect(envBoolean()).toBeTrue();
        expect(sleep()).toBeTrue();
        expect(uuid()).toBeString();
        expect(uuid()).toMatchUuid();
        uuid.mockReturnValueOnce("1234");
        expect(uuid()).not.toMatchUuid();
      });
      describe("Jaypie Handler", () => {
        describe("Base Cases", () => {
          it("Works", () => {
            expect(jaypieHandler).toBeDefined();
            expect(jaypieHandler).toBeFunction();
          });
        });
        describe("Observability", () => {
          it("Does not log", async () => {
            // Arrange
            const handler = jaypieHandler(() => {});
            // Act
            await handler();
            // Assert
            expect(log.trace).not.toHaveBeenCalled();
            expect(log.debug).not.toHaveBeenCalled();
            expect(log.info).not.toHaveBeenCalled();
            expect(log.warn).not.toHaveBeenCalled();
            expect(log.error).not.toHaveBeenCalled();
            expect(log.fatal).not.toHaveBeenCalled();
          });
        });
        describe("Happy Paths", () => {
          it("Calls a function I pass it", async () => {
            // Arrange
            const mockFunction = vi.fn(() => 12);
            const handler = jaypieHandler(mockFunction);
            const args = [1, 2, 3];
            // Act
            await handler(...args);
            // Assert
            expect(mockFunction).toHaveBeenCalledTimes(1);
            expect(mockFunction).toHaveBeenCalledWith(...args);
          });
          it("Throws the error my function throws", async () => {
            // Arrange
            const mockFunction = vi.fn(() => {
              throw new Error("Sorpresa!");
            });
            const handler = jaypieHandler(mockFunction);
            // Act
            try {
              await handler();
            } catch (error) {
              // Assert
              expect(error.message).toBe("Sorpresa!");
            }
            expect.assertions(1);
          });
          it("Works if async/await is used", async () => {
            // Arrange
            const mockFunction = vi.fn(async () => 12);
            const handler = jaypieHandler(mockFunction);
            // Act
            await handler();
            // Assert
            expect(mockFunction).toHaveBeenCalledTimes(1);
          });
          it("Returns what the function returns", async () => {
            // Arrange
            const mockFunction = vi.fn(() => 42);
            const handler = jaypieHandler(mockFunction);
            // Act
            const result = await handler();
            // Assert
            expect(result).toBe(42);
          });
          it("Returns what async functions resolve", async () => {
            // Arrange
            const mockFunction = vi.fn(async () => 42);
            const handler = jaypieHandler(mockFunction);
            // Act
            const result = await handler();
            // Assert
            expect(result).toBe(42);
          });
        });
        describe("Features", () => {
          describe("Lifecycle Functions", () => {
            describe("Unavailable mode", () => {
              it("Works as normal when process.env.PROJECT_UNAVAILABLE is set to false", async () => {
                // Arrange
                const handler = jaypieHandler(() => {});
                // Act
                await handler();
                // Assert
                expect(log.warn).not.toHaveBeenCalled();
              });
              it("Will throw 503 UnavailableError if process.env.PROJECT_UNAVAILABLE is set to true", async () => {
                // Arrange
                process.env.PROJECT_UNAVAILABLE = "true";
                const handler = jaypieHandler(() => {});
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(error.isProjectError).toBeTrue();
                  expect(error.status).toBe(HTTP.CODE.UNAVAILABLE);
                }
                expect.assertions(2);
                delete process.env.PROJECT_UNAVAILABLE;
              });
              it("Will throw 503 UnavailableError if unavailable=true is passed to the handler", async () => {
                // Arrange
                const handler = jaypieHandler(() => {}, { unavailable: true });
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(error.isProjectError).toBeTrue();
                  expect(error.status).toBe(HTTP.CODE.UNAVAILABLE);
                }
                expect.assertions(2);
              });
            });
            describe("Validate", () => {
              it("Calls validate functions in order", async () => {
                // Arrange
                const mockValidator1 = vi.fn(async () => {});
                const mockValidator2 = vi.fn(async () => {});
                const handler = jaypieHandler(() => {}, {
                  validate: [mockValidator1, mockValidator2],
                });
                // Act
                await handler();
                // Assert
                expect(mockValidator1).toHaveBeenCalledTimes(1);
                expect(mockValidator2).toHaveBeenCalledTimes(1);
                expect(mockValidator1).toHaveBeenCalledBefore(mockValidator2);
              });
              it("Thrown validate errors throw out", async () => {
                // Arrange
                const handler = jaypieHandler(() => {}, {
                  validate: [
                    async () => {
                      throw new Error("Sorpresa!");
                    },
                  ],
                });
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(error.isProjectError).toBeUndefined();
                  expect(error.status).toBeUndefined();
                }
                expect.assertions(2);
              });
              it("Returning false throws a bad request error", async () => {
                // Arrange
                const handler = jaypieHandler(() => {}, {
                  validate: [
                    async () => {
                      return false;
                    },
                  ],
                });
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(error.isProjectError).toBeTrue();
                  expect(error.status).toBe(HTTP.CODE.BAD_REQUEST);
                }
                expect.assertions(2);
              });
              it("Will skip any validate functions that are not functions", async () => {
                // Arrange
                const handler = jaypieHandler(() => {}, {
                  validate: [null, undefined, 42, "string", {}, []],
                });
                // Act
                await expect(handler()).resolves.not.toThrow();
              });
            });
            describe("Setup", () => {
              it("Calls setup functions in order", async () => {
                // Arrange
                const mockSetup1 = vi.fn(async () => {});
                const mockSetup2 = vi.fn(async () => {});
                const handler = jaypieHandler(() => {}, {
                  setup: [mockSetup1, mockSetup2],
                });
                // Act
                await handler();
                // Assert
                expect(mockSetup1).toHaveBeenCalledTimes(1);
                expect(mockSetup2).toHaveBeenCalledTimes(1);
                expect(mockSetup1).toHaveBeenCalledBefore(mockSetup2);
              });
              it("Thrown setup errors throw out", async () => {
                // Arrange
                const handler = jaypieHandler(() => {}, {
                  setup: [
                    async () => {
                      throw new Error("Sorpresa!");
                    },
                  ],
                });
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(error.isProjectError).toBeUndefined();
                  expect(error.status).toBeUndefined();
                  expect(error.message).toBe("Sorpresa!");
                }
                expect.assertions(3);
              });
              it("Will skip any setup functions that are not functions", async () => {
                // Arrange
                const handler = jaypieHandler(() => {}, {
                  setup: [null, undefined, 42, "string", {}, []],
                });
                // Act
                await expect(handler()).resolves.not.toThrow();
              });
            });
            describe("Teardown", () => {
              it("Calls teardown functions in order", async () => {
                // Arrange
                const mockTeardown1 = vi.fn(async () => {});
                const mockTeardown2 = vi.fn(async () => {});
                const handler = jaypieHandler(() => {}, {
                  teardown: [mockTeardown1, mockTeardown2],
                });
                // Act
                await handler();
                // Assert
                expect(mockTeardown1).toHaveBeenCalledTimes(1);
                expect(mockTeardown2).toHaveBeenCalledTimes(1);
                expect(mockTeardown1).toHaveBeenCalledBefore(mockTeardown2);
              });
              it("Calls all functions even on error", async () => {
                // Arrange
                const mockTeardown1 = vi.fn(async () => {});
                const mockTeardown2 = vi.fn(async () => {
                  throw new Error("Sorpresa!");
                });
                const mockTeardown3 = vi.fn(async () => {});
                const handler = jaypieHandler(() => {}, {
                  teardown: [mockTeardown1, mockTeardown2, mockTeardown3],
                });
                // Act
                await handler();
                // Assert
                expect(mockTeardown1).toHaveBeenCalledTimes(1);
                expect(mockTeardown2).toHaveBeenCalledTimes(1);
                expect(mockTeardown3).toHaveBeenCalledTimes(1);
              });
              it("Will call teardown functions even if setup throws an error", async () => {
                // Arrange
                const mockTeardown1 = vi.fn(async () => {});
                const mockTeardown2 = vi.fn(async () => {});
                const handler = jaypieHandler(() => {}, {
                  setup: [
                    async () => {
                      throw new Error("Sorpresa!");
                    },
                  ],
                  teardown: [mockTeardown1, mockTeardown2],
                });
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(mockTeardown1).toHaveBeenCalledTimes(1);
                  expect(mockTeardown2).toHaveBeenCalledTimes(1);
                }
                expect.assertions(2);
              });
              it("Will call teardown functions even if the handler throws an error", async () => {
                // Arrange
                const mockTeardown1 = vi.fn(async () => {});
                const mockTeardown2 = vi.fn(async () => {});
                const handler = jaypieHandler(
                  () => {
                    throw new Error("Sorpresa!");
                  },
                  {
                    teardown: [mockTeardown1, mockTeardown2],
                  },
                );
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(mockTeardown1).toHaveBeenCalledTimes(1);
                  expect(mockTeardown2).toHaveBeenCalledTimes(1);
                }
                expect.assertions(2);
              });
              it("Will NOT call teardown functions if validate throws an error", async () => {
                // Arrange
                const mockTeardown1 = vi.fn(async () => {});
                const mockTeardown2 = vi.fn(async () => {});
                const handler = jaypieHandler(() => {}, {
                  validate: [
                    async () => {
                      throw new Error("Sorpresa!");
                    },
                  ],
                  teardown: [mockTeardown1, mockTeardown2],
                });
                // Act
                try {
                  await handler();
                } catch (error) {
                  // Assert
                  expect(mockTeardown1).not.toHaveBeenCalled();
                  expect(mockTeardown2).not.toHaveBeenCalled();
                }
                expect.assertions(2);
              });
              it("Will skip any teardown functions that are not functions", async () => {
                // Arrange
                const handler = jaypieHandler(() => {}, {
                  teardown: [null, undefined, 42, "string", {}, []],
                });
                // Act
                await expect(handler()).resolves.not.toThrow();
              });
            });
          });
        });
        describe("Edge Cases", () => {
          it("Literally waits if I pass it a timeout", async () => {
            // Arrange
            const handler = jaypieHandler(async () => {
              // 200ms is unnoticeable to us, but will catch anything that tries to log after the fact
              await new Promise((resolve) => setTimeout(resolve, 200));
            });
            // Act
            const start = Date.now();
            await handler();
            const end = Date.now();
            // Assert
            expect(end - start).toBeGreaterThanOrEqual(194); // Allowing a tiny amount of breathing room
          });
          it("Throws an unhandled error if async throws after a delay", async () => {
            // Arrange
            const handler = jaypieHandler(async () => {
              // 200ms is unnoticeable to us, but will catch anything that tries to log after the fact
              await new Promise((resolve) => setTimeout(resolve, 200));
              throw new Error("Sorpresa!");
            });
            // Act
            try {
              await handler();
            } catch (error) {
              // Assert
              expect(error.isProjectError).toBeUndefined();
            }
            expect.assertions(1);
          });
        });
      });
    });
    describe("Jaypie Datadog", () => {
      it("Mocks expected function", () => {
        expect(vi.isMockFunction(submitMetric)).toBeTrue();
        expect(vi.isMockFunction(submitMetricSet)).toBeTrue();
      });
      it("Mocks return appropriate values", () => {
        expect(submitMetric()).toBeTrue();
        expect(submitMetricSet()).toBeTrue();
      });
    });
    describe("Jaypie Errors", () => {
      it.todo("Knows if it was thrown");
    });
    describe("Jaypie Logger", () => {
      it.todo("Provides mock functions we expect");
    });
    describe("Jaypie Mongoose", () => {
      it("Mocks expected function", () => {
        expect(connect).not.toHaveBeenCalled();
        expect(connectFromSecretEnv).not.toHaveBeenCalled();
        expect(disconnect).not.toHaveBeenCalled();
      });
      it("Mocks return appropriate values", () => {
        expect(connect()).toBeTrue();
        expect(connectFromSecretEnv()).toBeTrue();
        expect(disconnect()).toBeTrue();
      });
      it("Mongoose is unaltered (for now)", () => {
        expect(mongoose).toBe(expectedMongoose);
      });
      it.todo("Mocks mongoose", () => {
        expect(vi.isMockFunction(mongoose)).toBeTrue();
        expect(vi.isMockFunction(mongoose.connect)).toBeTrue();
      });
    });
  }); // END describe Jaypie Packages
});

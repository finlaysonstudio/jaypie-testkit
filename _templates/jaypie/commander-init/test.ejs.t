---
to: <%= path %>/__tests__/<%= name %><%= dotSubtype %>.spec.js
---
// eslint-disable-next-line no-unused-vars
import { describe, expect, it } from "vitest";

// Subject
// import { functionName } from "../<%= name %><%= dotSubtype %>.js";

//
//
// Run tests
//

describe("<%= Name %>", () => {
  it("Exports functions we expect", () => {
    // expect(functionName).toBeFunction();
  });
});

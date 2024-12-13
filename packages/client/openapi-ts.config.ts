// openapi-ts.config.ts

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "http://localhost:3000/swagger/json",
  output: {
    path: "./generated",
    format: "prettier",
    clean: true,
  },
  experimentalParser: true,
});

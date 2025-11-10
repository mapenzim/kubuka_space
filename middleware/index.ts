// middleware/index.ts
if (process.env.NODE_ENV === "production") {
  // Edge-compatible middleware (Accelerate)
  module.exports = require("./middleware.edge");
} else {
  // Local development middleware (Node + adapter-pg)
  module.exports = require("./middleware.dev");
}

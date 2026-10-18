import app from "./src/app.js";
import { config } from "./src/config/env.js";

const server = app.listen(config.port, () => {
  console.log(`🚀 Level 1 Server running on http://localhost:${config.port}`);
});

// Graceful shutdown handlers
process.once("SIGUSR2", () => {
  server.close(() => {
    process.kill(process.pid, "SIGUSR2");
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    process.exit(0);
  });
});
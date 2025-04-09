import { RunExpressServer } from "@/_server";
import { log } from "@/shared";

const server = new RunExpressServer();

server.start();

process.on("SIGINT", () => {
  log.warn("SIGINT received! Gracefully shutting down...");
  server.shutdown();
});

process.on("SIGTERM", () => {
  log.warn("SIGTERM received! Gracefully shutting down...");
  server.shutdown();
});

process.on("uncaughtException", (err) => {
  log.error("Uncaught Exception:", err);
  server.shutdown();
});

process.on("unhandledRejection", (reason) => {
  log.error("Unhandled Rejection:", reason);
  server.shutdown();
});

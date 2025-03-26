import { createServer, Server } from "http";
import { APP_MODE, connectDB, PORT } from "@/shared";
import { app, readyToServe } from "@/app";
import Controllers from "@/controllers";
import mongoose from "mongoose";

let server: Server | undefined;

const startServer = async () => {
  console.log(`Server has been started in '${APP_MODE}' mode! ✅`);
  try {
    const connect = await connectDB();
    connect ? readyToServe() : app.use(Controllers.Common.serverDown);

    server = createServer(app);
    server.listen(PORT, () => {
      console.log(`Server Listening: http://localhost:${PORT}`);
    });
  } catch (error: unknown) {
    console.log(
      `Failed to start the Server ❌`,
      error instanceof Error && error.message
    );
    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  try {
    if (server) {
      server.close(async (err) => {
        console.log("Server Shutdown");
        if (!err) {
          try {
            await mongoose.connection.close(false);
            console.log("Database disconnected! ❌");
          } catch (dbError) {
            console.error("Error disconnecting from database:", dbError);
          }
          process.exit(0);
        } else {
          console.error("Error closing server:", err);
          process.exit(1);
        }
      });
    } else {
      console.log("Server was not running, database shutdown only");
      try {
        await mongoose.connection.close(false);
        console.log("Database disconnected! ❌");
      } catch (dbError) {
        console.error("Error disconnecting from database:", dbError);
      }
      process.exit(0);
    }
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown();
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutdown();
});

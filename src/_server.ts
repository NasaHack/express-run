import { createServer, Server } from "http";
import { connectMongoDB, log, config, Config } from "@/shared";
import { app, appBootstrap } from "@/_app";
import mongoose from "mongoose";
import { serverDownResponse } from "@/segments/common";

export class RunExpressServer {
  protected config: Config;
  protected server: Server;
  protected isServerShuttingDown = false;

  constructor() {
    this.config = config;
    this.server = createServer(app);
  }

  start = async () => {
    log.info(`Server has been started in '${this.config.appMode}' mode!`);
    try {
      const connect = await connectMongoDB();

      if (connect) {
        appBootstrap();
      } else {
        app.use(serverDownResponse);
        log.error("Database Connection Failed!");
      }

      this.server.listen(this.config.port, () => {
        log.info(`Server Listening: http://localhost:${this.config.port}`);
      });
    } catch (error) {
      log.error(`Failed to start the Server`, error instanceof Error && error);
      process.exit(1);
    }
  };

  shutdown = async () => {
    if (this.isServerShuttingDown) {
      log.warn("Server is already shutting down...");
      return;
    }

    this.isServerShuttingDown = true;

    const forceExit = setTimeout(() => {
      log.warn("Forcefully shutting down due to timeout...");
      process.exit(1);
    }, 10000);

    try {
      log.info("Shutting down server...");

      await new Promise<void>((resolve, reject) => {
        if (this.server.listening) {
          this.server.close((err) => {
            if (err) {
              log.error("Error closing server:", err);
              reject(err);
              process.exit(1);
            } else {
              log.info("Server has been closed");
              resolve();
            }
          });
        } else {
          resolve();
        }
      });

      await mongoose.connection.close(false);
      log.info("Database disconnected");

      clearTimeout(forceExit);
      process.exit(0);
    } catch (error) {
      log.error("Error during shutdown:", error);
      clearTimeout(forceExit);
      process.exit(1);
    }
  };
}

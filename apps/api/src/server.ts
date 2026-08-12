import "dotenv/config";

import type { Server } from "node:http";

import app from "./app.js";
import {
    connectDatabase,
    disconnectDatabase,
} from "./config/database.js";
import { env } from "./config/env.js";

let server: Server | undefined;

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();

        server = app.listen(env.PORT, () => {
            console.log(
                `[server] API running on http://localhost:${env.PORT}`
            );
        });
    } catch (error) {
        console.error("[server] Startup failed:", error);

        process.exit(1);
    }
};

const shutdown = async (
    signal: string
): Promise<void> => {
    console.log(`[server] ${signal} received`);

    if (!server) {
        await disconnectDatabase();
        process.exit(0);
    }

    server.close(async () => {
        try {
            await disconnectDatabase();

            process.exit(0);
        } catch (error) {
            console.error(
                "[server] Graceful shutdown failed:",
                error
            );

            process.exit(1);
        }
    });
};

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

void startServer();

import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
    const databaseConnected =
        mongoose.connection.readyState === 1;

    res
        .status(databaseConnected ? 200 : 503)
        .json({
            success: databaseConnected,

            services: {
                api: "running",

                database: databaseConnected
                    ? "connected"
                    : "disconnected",
            },

            timestamp: new Date().toISOString(),
        });
});

export default app;

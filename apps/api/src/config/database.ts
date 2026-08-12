import mongoose from "mongoose";

import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
    await mongoose.connect(env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });

    console.log(
        `[database] Connected to ${mongoose.connection.name}`
    );
};

export const disconnectDatabase = async (): Promise<void> => {
    await mongoose.disconnect();

    console.log("[database] Disconnected");
};

mongoose.connection.on("error", (error) => {
    console.error("[database] Connection error:", error);
});

mongoose.connection.on("disconnected", () => {
    console.warn("[database] Connection lost");
});

mongoose.connection.on("reconnected", () => {
    console.log("[database] Reconnected");
});

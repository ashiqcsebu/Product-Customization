import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

// Fix for strict Windows DNS SRV lookup ECONNREFUSED (Local Dev Only)
if (env.NODE_ENV === "development") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const buildMongoUri = (): string => {
    const username = encodeURIComponent(env.MONGODB_USERNAME);
    const password = encodeURIComponent(env.MONGODB_PASSWORD);

    return (
        `mongodb+srv://${username}:${password}` +
        `@${env.MONGODB_HOST}/${env.MONGODB_DATABASE}` +
        `?retryWrites=true` +
        `&w=majority` +
        `&authSource=admin` +
        `&appName=${encodeURIComponent(env.MONGODB_APP_NAME)}`
    );
};

export const connectDatabase = async (): Promise<void> => {
    const mongoUri = buildMongoUri();

    try {
        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            minPoolSize: 1,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(
            `[database] Connected to ${mongoose.connection.name}`
        );
    } catch (error) {
        console.error("[database] Connection failed:", error);
        throw error;
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    await mongoose.disconnect();

    console.log("[database] Disconnected");
};

mongoose.connection.on("error", (error) => {
    console.error("[database] Runtime error:", error);
});

mongoose.connection.on("disconnected", () => {
    console.warn("[database] Connection lost");
});

mongoose.connection.on("reconnected", () => {
    console.log("[database] Reconnected");
});
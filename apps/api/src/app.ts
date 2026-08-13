import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { productRoutes } from "./routes/product.routes.js";
import { configRoutes } from "./routes/config.routes.js";
import designRoutes from "./routes/design.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/config", configRoutes);
app.use("/api/v1/designs", designRoutes);

// Root path confirmation
app.get("/", (_req, res) => {
    res.send("Product Customization API is running!");
});

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

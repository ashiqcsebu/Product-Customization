import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce
        .number()
        .int()
        .positive()
        .default(5000),

    MONGODB_URI: z
        .string()
        .min(1, "MONGODB_URI is required")
        .startsWith(
            "mongodb",
            "MONGODB_URI must be a MongoDB connection string"
        ),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error(
        "Invalid environment configuration:",
        result.error.flatten().fieldErrors
    );

    throw new Error("Environment validation failed");
}

export const env = result.data;
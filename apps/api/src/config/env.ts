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

  MONGODB_USERNAME: z
    .string()
    .min(1, "MONGODB_USERNAME is required"),

  MONGODB_PASSWORD: z
    .string()
    .min(1, "MONGODB_PASSWORD is required"),

  MONGODB_HOST: z
    .string()
    .min(1, "MONGODB_HOST is required"),

  MONGODB_DATABASE: z
    .string()
    .min(1, "MONGODB_DATABASE is required"),

  MONGODB_APP_NAME: z
    .string()
    .default("product-customizer"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "[env] Invalid environment variables:",
    result.error.flatten().fieldErrors
  );

  throw new Error("Environment validation failed");
}

export const env = result.data;
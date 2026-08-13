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

  // Shopify App Config
  SHOPIFY_API_KEY: z.string().default("dummy_key_for_dev"),
  SHOPIFY_API_SECRET: z.string().default("dummy_secret_for_dev"),
  SHOPIFY_APP_URL: z.string().url().default("https://your-tunnel-url.ngrok.io"),
  SCOPES: z.string().default("write_products,read_products,write_orders,read_orders,write_draft_orders,read_draft_orders"),

  SHOPIFY_STORE_DOMAIN: z
    .string()
    .min(1, "SHOPIFY_STORE_DOMAIN is required (e.g. your-store.myshopify.com)")
    .default("demo-store.myshopify.com"),

  SHOPIFY_ADMIN_ACCESS_TOKEN: z
    .string()
    .min(1, "SHOPIFY_ADMIN_ACCESS_TOKEN is required")
    .default("shpat_mock_token_123"),

  SHOPIFY_API_VERSION: z
    .string()
    .default("2024-01"),
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
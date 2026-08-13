import mongoose, { Schema, Document, Model } from "mongoose";

export type WebhookEventStatus = "pending" | "processed" | "failed";

export interface IWebhookEvent {
    storeId: mongoose.Types.ObjectId;
    topic: string; // e.g. "orders/create", "products/update"
    shopifyWebhookId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any; // Raw JSON payload directly from Shopify
    status: WebhookEventStatus;
    errorDetails?: string | null;
    processedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IWebhookEventDocument extends IWebhookEvent, Document { }

export const WebhookEventSchema = new Schema<IWebhookEventDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        topic: { type: String, required: true },
        shopifyWebhookId: { type: String, required: true, unique: true }, // Ensure idempotency
        payload: { type: Schema.Types.Mixed, required: true },
        status: {
            type: String,
            enum: ["pending", "processed", "failed"],
            default: "pending",
            index: true,
        },
        errorDetails: { type: String, default: null },
        processedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const WebhookEvent: Model<IWebhookEventDocument> =
    mongoose.models.WebhookEvent ||
    mongoose.model<IWebhookEventDocument>("WebhookEvent", WebhookEventSchema);

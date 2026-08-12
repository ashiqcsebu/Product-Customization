import mongoose, { Schema, Document, Model } from "mongoose";

export type CartSessionStatus = "active" | "checked_out" | "abandoned";

export interface ICartPricingSnapshot {
    basePrice: number;
    customizationPrice: number;
    total: number;
}

export interface ICartLine {
    shopifyCartLineId: string;
    productId: mongoose.Types.ObjectId;
    variantId: mongoose.Types.ObjectId;
    designId: mongoose.Types.ObjectId;
    designVersionId: mongoose.Types.ObjectId;
    quantity: number;
    pricingSnapshot: ICartPricingSnapshot;
}

export interface ICartSession {
    storeId: mongoose.Types.ObjectId;
    customerId?: mongoose.Types.ObjectId | null;
    guestSessionId?: string | null;
    shopifyCartId: string;
    status: CartSessionStatus;
    lines: ICartLine[];
    checkoutUrl?: string | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartSessionDocument extends ICartSession, Document { }

const CartPricingSnapshotSchema = new Schema<ICartPricingSnapshot>(
    {
        basePrice: { type: Number, required: true },
        customizationPrice: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    { _id: false }
);

const CartLineSchema = new Schema<ICartLine>(
    {
        shopifyCartLineId: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: {
            type: Schema.Types.ObjectId,
            ref: "ProductVariant",
            required: true,
        },
        designId: { type: Schema.Types.ObjectId, ref: "Design", required: true },
        designVersionId: {
            type: Schema.Types.ObjectId,
            ref: "DesignVersion",
            required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        pricingSnapshot: { type: CartPricingSnapshotSchema, required: true },
    },
    { _id: false }
);

export const CartSessionSchema = new Schema<ICartSessionDocument>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer", // To be created in later phases
            default: null,
            index: true,
        },
        guestSessionId: { type: String, default: null, index: true },
        shopifyCartId: { type: String, required: true, index: true },
        status: {
            type: String,
            enum: ["active", "checked_out", "abandoned"],
            default: "active",
            index: true,
        },
        lines: { type: [CartLineSchema], default: [] },
        checkoutUrl: { type: String, default: null },
        expiresAt: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const CartSession: Model<ICartSessionDocument> =
    mongoose.models.CartSession ||
    mongoose.model<ICartSessionDocument>("CartSession", CartSessionSchema);

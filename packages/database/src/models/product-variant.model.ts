import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductVariantStatus = "active" | "inactive";

export interface IProductVariant {
    storeId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    shopifyVariantId: string;
    title: string;
    sku?: string | null;
    barcode?: string | null;
    selectedOptions: Record<string, string>; // e.g., { Color: "Black", Size: "XL" }
    price: number;
    compareAtPrice?: number | null;
    currency: string;
    inventoryQuantity: number;
    availableForSale: boolean;
    imageUrl?: string | null;
    status: ProductVariantStatus;
    lastSyncedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductVariantDocument extends IProductVariant, Document { }

export const ProductVariantSchema = new Schema<IProductVariantDocument>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        shopifyVariantId: { type: String, required: true },
        title: { type: String, required: true },
        sku: { type: String, default: null },
        barcode: { type: String, default: null },
        selectedOptions: {
            type: Map,
            of: String,
            default: {},
        },
        price: { type: Number, required: true },
        compareAtPrice: { type: Number, default: null },
        currency: { type: String, required: true, default: "USD" },
        inventoryQuantity: { type: Number, default: 0 },
        availableForSale: { type: Boolean, default: false },
        imageUrl: { type: String, default: null },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            index: true,
        },
        lastSyncedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// Guarantee that we don't duplicate a Shopify variant in the same store
ProductVariantSchema.index({ storeId: 1, shopifyVariantId: 1 }, { unique: true });

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const ProductVariant: Model<IProductVariantDocument> =
    mongoose.models.ProductVariant ||
    mongoose.model<IProductVariantDocument>("ProductVariant", ProductVariantSchema);

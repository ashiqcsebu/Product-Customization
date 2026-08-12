import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductStatus = "active" | "draft" | "archived";

export interface IProductOption {
    name: string;
    position: number;
    values: string[];
}

export interface IProductImage {
    shopifyImageId: string;
    url: string;
    alt?: string | null;
}

export interface IProduct {
    storeId: mongoose.Types.ObjectId;
    shopifyProductId: string;
    handle: string;
    title: string;
    description?: string | null;
    vendor?: string | null;
    productType?: string | null;
    status: ProductStatus;
    options: IProductOption[];
    images: IProductImage[];
    tags: string[];
    customizerEnabled: boolean;
    shopifyCreatedAt?: Date | null;
    shopifyUpdatedAt?: Date | null;
    lastSyncedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document { }

const ProductOptionSchema = new Schema<IProductOption>(
    {
        name: { type: String, required: true },
        position: { type: Number, required: true },
        values: { type: [String], required: true },
    },
    { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
    {
        shopifyImageId: { type: String, required: true },
        url: { type: String, required: true },
        alt: { type: String, default: null },
    },
    { _id: false }
);

export const ProductSchema = new Schema<IProductDocument>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        shopifyProductId: { type: String, required: true },
        handle: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: null },
        vendor: { type: String, default: null },
        productType: { type: String, default: null },
        status: {
            type: String,
            enum: ["active", "draft", "archived"],
            default: "active",
            index: true,
        },
        options: { type: [ProductOptionSchema], default: [] },
        images: { type: [ProductImageSchema], default: [] },
        tags: { type: [String], default: [] },
        customizerEnabled: { type: Boolean, default: true, index: true },
        shopifyCreatedAt: { type: Date, default: null },
        shopifyUpdatedAt: { type: Date, default: null },
        lastSyncedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// Guarantee that we don't duplicate a Shopify product in the same store
ProductSchema.index({ storeId: 1, shopifyProductId: 1 }, { unique: true });

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const Product: Model<IProductDocument> =
    mongoose.models.Product ||
    mongoose.model<IProductDocument>("Product", ProductSchema);

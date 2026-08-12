import mongoose, { Schema, Document, Model } from "mongoose";

export type DesignStatus =
    | "draft"
    | "saved"
    | "cart_locked"
    | "ordered"
    | "archived"
    | "expired";

export interface IDesignViewSummary {
    viewKey: string;
    objectCount: number;
    previewAssetId?: mongoose.Types.ObjectId | null;
    updatedAt: Date;
}

export interface IDesignPricing {
    productPrice: number;
    customizationPrice: number;
    discount: number;
    total: number;
    currency: string;
}

export interface IDesignService {
    key: string;
    assetId?: mongoose.Types.ObjectId | null;
    price: number;
    status: "pending" | "completed" | "failed";
}

export interface IDesign {
    storeId: mongoose.Types.ObjectId;
    customerId?: mongoose.Types.ObjectId | null;
    guestSessionId?: string | null;
    productId: mongoose.Types.ObjectId;
    variantId: mongoose.Types.ObjectId;
    customizerConfigId: mongoose.Types.ObjectId;
    title: string;
    activeViewKey: string;
    selectedOptions: Record<string, string>;
    status: DesignStatus;
    currentRevision: number;
    latestVersionId?: mongoose.Types.ObjectId | null;
    viewSummary: IDesignViewSummary[];
    pricing: IDesignPricing;
    services: IDesignService[];
    lastAutosavedAt?: Date | null;
    lastOpenedAt?: Date | null;
    expiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDesignDocument extends IDesign, Document { }

const DesignViewSummarySchema = new Schema<IDesignViewSummary>(
    {
        viewKey: { type: String, required: true },
        objectCount: { type: Number, default: 0 },
        previewAssetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const DesignPricingSchema = new Schema<IDesignPricing>(
    {
        productPrice: { type: Number, required: true, default: 0 },
        customizationPrice: { type: Number, required: true, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true, default: 0 },
        currency: { type: String, required: true, default: "USD" },
    },
    { _id: false }
);

const DesignServiceSchema = new Schema<IDesignService>(
    {
        key: { type: String, required: true },
        assetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },
        price: { type: Number, required: true, default: 0 },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    { _id: false }
);

export const DesignSchema = new Schema<IDesignDocument>(
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
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variantId: {
            type: Schema.Types.ObjectId,
            ref: "ProductVariant",
            required: true,
        },
        customizerConfigId: {
            type: Schema.Types.ObjectId,
            ref: "CustomizerConfig",
            required: true,
        },
        title: { type: String, required: true, default: "Untitled Design" },
        activeViewKey: { type: String, required: true, default: "front" },
        selectedOptions: {
            type: Map,
            of: String,
            default: {},
        },
        status: {
            type: String,
            enum: [
                "draft",
                "saved",
                "cart_locked",
                "ordered",
                "archived",
                "expired",
            ],
            default: "draft",
            index: true,
        },
        currentRevision: { type: Number, default: 1 },
        latestVersionId: {
            type: Schema.Types.ObjectId,
            ref: "DesignVersion", // To be created in later phases
            default: null,
        },
        viewSummary: { type: [DesignViewSummarySchema], default: [] },
        pricing: {
            type: DesignPricingSchema,
            default: () => ({
                productPrice: 0,
                customizationPrice: 0,
                discount: 0,
                total: 0,
                currency: "USD",
            }),
        },
        services: { type: [DesignServiceSchema], default: [] },
        lastAutosavedAt: { type: Date, default: Date.now },
        lastOpenedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, default: null, index: true },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments
export const Design: Model<IDesignDocument> =
    mongoose.models.Design ||
    mongoose.model<IDesignDocument>("Design", DesignSchema);

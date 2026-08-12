import mongoose, { Schema, Document, Model } from "mongoose";

export type AssetOwnerType = "design" | "product" | "store" | "system";
export type AssetType =
    | "customer_upload"
    | "mockup"
    | "font"
    | "clipart"
    | "preview"
    | "print_file";
export type AssetStorageProvider = "s3" | "local" | "r2";
export type AssetStatus = "active" | "deleted";

export interface IAssetMetadata {
    width?: number | null;
    height?: number | null;
    dpi?: number | null;
    fileSize: number;
    hasTransparency?: boolean | null;
    colorSpace?: string | null;
    checksum?: string | null;
}

export interface IAssetProcessing {
    status: "pending" | "processing" | "completed" | "failed";
    virusScanStatus: "pending" | "clean" | "infected";
    backgroundRemoved: boolean;
    optimizedAssetId?: mongoose.Types.ObjectId | null;
}

export interface IAsset {
    storeId: mongoose.Types.ObjectId;
    customerId?: mongoose.Types.ObjectId | null;
    designId?: mongoose.Types.ObjectId | null;
    ownerType: AssetOwnerType;
    ownerId?: mongoose.Types.ObjectId | null;
    type: AssetType;
    originalName: string;
    mimeType: string;
    extension: string;
    storageProvider: AssetStorageProvider;
    bucket: string;
    storageKey: string; // The S3 path or local path
    publicUrl?: string | null;
    metadata: IAssetMetadata;
    processing: IAssetProcessing;
    status: AssetStatus;
    expiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAssetDocument extends IAsset, Document { }

const AssetMetadataSchema = new Schema<IAssetMetadata>(
    {
        width: { type: Number, default: null },
        height: { type: Number, default: null },
        dpi: { type: Number, default: null },
        fileSize: { type: Number, required: true },
        hasTransparency: { type: Boolean, default: null },
        colorSpace: { type: String, default: null },
        checksum: { type: String, default: null },
    },
    { _id: false }
);

const AssetProcessingSchema = new Schema<IAssetProcessing>(
    {
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
        },
        virusScanStatus: {
            type: String,
            enum: ["pending", "clean", "infected"],
            default: "pending",
        },
        backgroundRemoved: { type: Boolean, default: false },
        optimizedAssetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },
    },
    { _id: false }
);

export const AssetSchema = new Schema<IAssetDocument>(
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
        },
        designId: {
            type: Schema.Types.ObjectId,
            ref: "Design", // To be created in later phases
            default: null,
        },
        ownerType: {
            type: String,
            enum: ["design", "product", "store", "system"],
            required: true,
        },
        ownerId: { type: Schema.Types.ObjectId, default: null },
        type: {
            type: String,
            enum: [
                "customer_upload",
                "mockup",
                "font",
                "clipart",
                "preview",
                "print_file",
            ],
            required: true,
            index: true,
        },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        extension: { type: String, required: true },
        storageProvider: {
            type: String,
            enum: ["s3", "local", "r2"],
            required: true,
        },
        bucket: { type: String, required: true },
        storageKey: { type: String, required: true },
        publicUrl: { type: String, default: null },
        metadata: { type: AssetMetadataSchema, required: true },
        processing: {
            type: AssetProcessingSchema,
            default: () => ({ status: "pending", virusScanStatus: "pending" }),
        },
        status: {
            type: String,
            enum: ["active", "deleted"],
            default: "active",
            index: true,
        },
        expiresAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Search optimization for cleaning up temporary files
AssetSchema.index({ type: 1, status: 1, expiresAt: 1 });

export const Asset: Model<IAssetDocument> =
    mongoose.models.Asset || mongoose.model<IAssetDocument>("Asset", AssetSchema);

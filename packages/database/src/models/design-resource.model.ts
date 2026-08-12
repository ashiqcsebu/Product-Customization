import mongoose, { Schema, Document, Model } from "mongoose";

export type DesignResourceType = "clipart" | "font" | "template";
export type DesignResourceVisibility = "store" | "public";
export type DesignResourceStatus = "active" | "inactive";

export interface IDesignResourceMetadata {
    fontFamily?: string | null;
    fontWeight?: string | null;
    fontStyle?: string | null;
    previewUrl?: string | null;
}

export interface IDesignResource {
    storeId: mongoose.Types.ObjectId;
    type: DesignResourceType;
    name: string;
    category: string;
    assetId: mongoose.Types.ObjectId;
    tags: string[];
    metadata?: IDesignResourceMetadata;
    visibility: DesignResourceVisibility;
    status: DesignResourceStatus;
    createdBy?: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDesignResourceDocument extends IDesignResource, Document { }

const DesignResourceMetadataSchema = new Schema<IDesignResourceMetadata>(
    {
        fontFamily: { type: String, default: null },
        fontWeight: { type: String, default: null },
        fontStyle: { type: String, default: null },
        previewUrl: { type: String, default: null },
    },
    { _id: false }
);

export const DesignResourceSchema = new Schema<IDesignResourceDocument>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["clipart", "font", "template"],
            required: true,
            index: true,
        },
        name: { type: String, required: true },
        category: { type: String, required: true },
        assetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            required: true,
        },
        tags: { type: [String], default: [] },
        metadata: {
            type: DesignResourceMetadataSchema,
            default: () => ({}),
        },
        visibility: {
            type: String,
            enum: ["store", "public"],
            default: "store",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            index: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments
export const DesignResource: Model<IDesignResourceDocument> =
    mongoose.models.DesignResource ||
    mongoose.model<IDesignResourceDocument>("DesignResource", DesignResourceSchema);

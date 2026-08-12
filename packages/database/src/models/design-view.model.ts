import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFabricCanvas {
    version: string;
    width: number;
    height: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objects: any[]; // Using any[] here as Fabric.js object schemas are highly variable
}

export interface IDesignValidation {
    hasLowResolutionAsset: boolean;
    hasOutOfBoundsObject: boolean;
    warnings: string[];
}

export interface IDesignView {
    storeId: mongoose.Types.ObjectId;
    designId: mongoose.Types.ObjectId;
    viewKey: string;
    revision: number;
    canvas: IFabricCanvas;
    canvasStorageAssetId?: mongoose.Types.ObjectId | null;
    objectCount: number;
    previewAssetId?: mongoose.Types.ObjectId | null;
    validation: IDesignValidation;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDesignViewDocument extends IDesignView, Document { }

const FabricCanvasSchema = new Schema<IFabricCanvas>(
    {
        version: { type: String, required: true, default: "6.0.0" },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        objects: [{ type: Schema.Types.Mixed }],
    },
    { _id: false }
);

const DesignValidationSchema = new Schema<IDesignValidation>(
    {
        hasLowResolutionAsset: { type: Boolean, default: false },
        hasOutOfBoundsObject: { type: Boolean, default: false },
        warnings: { type: [String], default: [] },
    },
    { _id: false }
);

export const DesignViewSchema = new Schema<IDesignViewDocument>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        designId: {
            type: Schema.Types.ObjectId,
            ref: "Design",
            required: true,
            index: true,
        },
        viewKey: { type: String, required: true },
        revision: { type: Number, required: true, default: 1 },
        canvas: { type: FabricCanvasSchema, required: true },
        canvasStorageAssetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            default: null, // Used if canvas JSON is too large and saved to S3 instead
        },
        objectCount: { type: Number, default: 0 },
        previewAssetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },
        validation: {
            type: DesignValidationSchema,
            default: () => ({
                hasLowResolutionAsset: false,
                hasOutOfBoundsObject: false,
                warnings: [],
            }),
        },
    },
    {
        timestamps: true,
    }
);

// We usually look up a design view by its designId and viewKey
DesignViewSchema.index({ designId: 1, viewKey: 1 }, { unique: true });

export const DesignView: Model<IDesignViewDocument> =
    mongoose.models.DesignView ||
    mongoose.model<IDesignViewDocument>("DesignView", DesignViewSchema);

import mongoose, { Schema, Document, Model } from "mongoose";

// Use IFabricCanvas and IPhysicalSize from previously created models instead of re-defining
import { IFabricCanvas } from "./design-view.model.js";
import { IPhysicalSize } from "./customizer-config.model.js";

export interface IDesignVersionView {
    storeId: mongoose.Types.ObjectId;
    designVersionId: mongoose.Types.ObjectId;
    viewKey: string;
    canvasJSON: IFabricCanvas;
    canvasStorageAssetId?: mongoose.Types.ObjectId | null;
    previewAssetId?: mongoose.Types.ObjectId | null;
    printFileAssetId?: mongoose.Types.ObjectId | null; // The high-res 300DPI export
    physicalSize: IPhysicalSize;
    checksum?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDesignVersionViewDocument
    extends IDesignVersionView,
    Document { }

// Redeclare inline local schemas to prevent circular dependency TS issues 
// or tight coupling with mutable schemas during hot-reload.
const FabricCanvasSchema = new Schema<IFabricCanvas>(
    {
        version: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        objects: [{ type: Schema.Types.Mixed }],
    },
    { _id: false }
);

const PhysicalSizeSchema = new Schema<IPhysicalSize>(
    {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        unit: { type: String, enum: ["inch", "cm", "mm"], required: true },
        dpi: { type: Number, required: true, default: 300 },
    },
    { _id: false }
);

export const DesignVersionViewSchema =
    new Schema<IDesignVersionViewDocument>(
        {
            storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
            designVersionId: {
                type: Schema.Types.ObjectId,
                ref: "DesignVersion",
                required: true,
                index: true,
            },
            viewKey: { type: String, required: true },
            canvasJSON: { type: FabricCanvasSchema, required: true },
            canvasStorageAssetId: {
                type: Schema.Types.ObjectId,
                ref: "Asset",
                default: null,
            },
            previewAssetId: {
                type: Schema.Types.ObjectId,
                ref: "Asset",
                default: null,
            },
            printFileAssetId: {
                type: Schema.Types.ObjectId,
                ref: "Asset",
                default: null,
            },
            physicalSize: { type: PhysicalSizeSchema, required: true },
            checksum: { type: String, default: null },
        },
        {
            timestamps: true,
        }
    );

export const DesignVersionView: Model<IDesignVersionViewDocument> =
    mongoose.models.DesignVersionView ||
    mongoose.model<IDesignVersionViewDocument>(
        "DesignVersionView",
        DesignVersionViewSchema
    );

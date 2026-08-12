import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICanvasDimensions {
    logicalWidth: number;
    logicalHeight: number;
    backgroundColor: string;
}

export interface IPrintArea {
    x: number; // Percentage based 0-1
    y: number;
    width: number;
    height: number;
}

export interface ISafeArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IBleedArea {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface IPhysicalSize {
    width: number;
    height: number;
    unit: "inch" | "cm" | "mm";
    dpi: number;
}

export interface ICustomizerView {
    key: string;
    label: string;
    sortOrder: number;
    mockupAssetId?: mongoose.Types.ObjectId | null;
    printArea: IPrintArea;
    safeArea?: ISafeArea;
    bleed?: IBleedArea;
    physicalSize: IPhysicalSize;
    enabled: boolean;
}

export interface IAllowedTools {
    uploadImage: boolean;
    text: boolean;
    shapes: boolean;
    clipart: boolean;
    qrCode: boolean;
    curvedText: boolean;
    backgroundRemoval: boolean;
    imageFilters: boolean;
}

export interface IUploadRules {
    allowedMimeTypes: string[];
    maxFileSizeMb: number;
    minimumWidth?: number | null;
    minimumHeight?: number | null;
    minimumDpi?: number | null;
}

export interface IExportSettings {
    format: "png" | "jpeg" | "webp";
    dpi: number;
    transparentBackground: boolean;
    generateSvg: boolean;
    generatePdf: boolean;
}

export interface ICustomizerConfig {
    storeId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    name: string;
    version: number;
    enabled: boolean;
    canvas: ICanvasDimensions;
    views: ICustomizerView[];
    allowedTools: IAllowedTools;
    uploadRules: IUploadRules;
    fontResourceIds: mongoose.Types.ObjectId[];
    clipartResourceIds: mongoose.Types.ObjectId[];
    pricingRuleSetId?: mongoose.Types.ObjectId | null;
    defaultTemplateId?: mongoose.Types.ObjectId | null;
    exportSettings: IExportSettings;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICustomizerConfigDocument extends ICustomizerConfig, Document { }

const CanvasDimensionsSchema = new Schema<ICanvasDimensions>(
    {
        logicalWidth: { type: Number, required: true },
        logicalHeight: { type: Number, required: true },
        backgroundColor: { type: String, default: "#ffffff" },
    },
    { _id: false }
);

const PrintAreaSchema = new Schema<IPrintArea>(
    {
        x: { type: Number, required: true, min: 0, max: 1 },
        y: { type: Number, required: true, min: 0, max: 1 },
        width: { type: Number, required: true, min: 0, max: 1 },
        height: { type: Number, required: true, min: 0, max: 1 },
    },
    { _id: false }
);

const SafeAreaSchema = new Schema<ISafeArea>(
    {
        x: { type: Number, required: true, min: 0, max: 1 },
        y: { type: Number, required: true, min: 0, max: 1 },
        width: { type: Number, required: true, min: 0, max: 1 },
        height: { type: Number, required: true, min: 0, max: 1 },
    },
    { _id: false }
);

const BleedAreaSchema = new Schema<IBleedArea>(
    {
        top: { type: Number, required: true, default: 0 },
        right: { type: Number, required: true, default: 0 },
        bottom: { type: Number, required: true, default: 0 },
        left: { type: Number, required: true, default: 0 },
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

const CustomizerViewSchema = new Schema<ICustomizerView>(
    {
        key: { type: String, required: true },
        label: { type: String, required: true },
        sortOrder: { type: Number, required: true, default: 1 },
        mockupAssetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },
        printArea: { type: PrintAreaSchema, required: true },
        safeArea: { type: SafeAreaSchema },
        bleed: { type: BleedAreaSchema },
        physicalSize: { type: PhysicalSizeSchema, required: true },
        enabled: { type: Boolean, default: true },
    },
    { _id: false }
);

const AllowedToolsSchema = new Schema<IAllowedTools>(
    {
        uploadImage: { type: Boolean, default: true },
        text: { type: Boolean, default: true },
        shapes: { type: Boolean, default: true },
        clipart: { type: Boolean, default: true },
        qrCode: { type: Boolean, default: true },
        curvedText: { type: Boolean, default: false },
        backgroundRemoval: { type: Boolean, default: true },
        imageFilters: { type: Boolean, default: true },
    },
    { _id: false }
);

const UploadRulesSchema = new Schema<IUploadRules>(
    {
        allowedMimeTypes: {
            type: [String],
            default: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
        },
        maxFileSizeMb: { type: Number, default: 25 },
        minimumWidth: { type: Number, default: 800 },
        minimumHeight: { type: Number, default: 800 },
        minimumDpi: { type: Number, default: 150 },
    },
    { _id: false }
);

const ExportSettingsSchema = new Schema<IExportSettings>(
    {
        format: { type: String, enum: ["png", "jpeg", "webp"], default: "png" },
        dpi: { type: Number, default: 300 },
        transparentBackground: { type: Boolean, default: true },
        generateSvg: { type: Boolean, default: true },
        generatePdf: { type: Boolean, default: false },
    },
    { _id: false }
);

export const CustomizerConfigSchema = new Schema<ICustomizerConfigDocument>(
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
            unique: true, // Only one active config per product
        },
        name: { type: String, required: true },
        version: { type: Number, default: 1 },
        enabled: { type: Boolean, default: true, index: true },
        canvas: { type: CanvasDimensionsSchema, required: true },
        views: { type: [CustomizerViewSchema], required: true },
        allowedTools: {
            type: AllowedToolsSchema,
            default: () => ({}),
        },
        uploadRules: {
            type: UploadRulesSchema,
            default: () => ({}),
        },
        fontResourceIds: [{ type: Schema.Types.ObjectId, ref: "DesignResource" }],
        clipartResourceIds: [{ type: Schema.Types.ObjectId, ref: "DesignResource" }],
        pricingRuleSetId: {
            type: Schema.Types.ObjectId,
            ref: "PricingRuleSet", // To be created in later phases
            default: null,
        },
        defaultTemplateId: {
            type: Schema.Types.ObjectId,
            ref: "DesignResource",
            default: null,
        },
        exportSettings: {
            type: ExportSettingsSchema,
            default: () => ({}),
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const CustomizerConfig: Model<ICustomizerConfigDocument> =
    mongoose.models.CustomizerConfig ||
    mongoose.model<ICustomizerConfigDocument>(
        "CustomizerConfig",
        CustomizerConfigSchema
    );

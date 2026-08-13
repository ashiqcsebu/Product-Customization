import mongoose, { Schema, Document, Model } from "mongoose";

export type ExportJobType = "print_file" | "preview";
export type ExportJobStatus = "pending" | "processing" | "completed" | "failed";

export interface IExportJob {
    storeId: mongoose.Types.ObjectId;
    orderItemId?: mongoose.Types.ObjectId | null;
    designVersionId: mongoose.Types.ObjectId;
    type: ExportJobType;
    status: ExportJobStatus;
    progress: number; // 0 to 100
    resultAssetIds: mongoose.Types.ObjectId[];
    errorDetails?: string | null;
    workerId?: string | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExportJobDocument extends IExportJob, Document { }

export const ExportJobSchema = new Schema<IExportJobDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        orderItemId: {
            type: Schema.Types.ObjectId,
            ref: "OrderItem",
            default: null,
            index: true,
        },
        designVersionId: {
            type: Schema.Types.ObjectId,
            ref: "DesignVersion",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["print_file", "preview"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
            index: true, // Crucial index for BullMQ workers to query pending jobs
        },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        resultAssetIds: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        errorDetails: { type: String, default: null },
        workerId: { type: String, default: null },
        startedAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const ExportJob: Model<IExportJobDocument> =
    mongoose.models.ExportJob ||
    mongoose.model<IExportJobDocument>("ExportJob", ExportJobSchema);

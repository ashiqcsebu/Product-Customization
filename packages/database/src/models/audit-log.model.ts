import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLogChanges {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    before?: Record<string, any> | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    after?: Record<string, any> | null;
}

export interface IAuditLog {
    storeId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId | null; // Nullable if action performed by system
    action: string; // e.g. "updated_customizer_config", "deleted_design", "processed_order"
    targetType: string; // e.g. "CustomizerConfig", "Design", "Order"
    targetId?: mongoose.Types.ObjectId | null;
    changes?: IAuditLogChanges | null;
    ipAddress?: string | null;
    createdAt: Date;
}

export interface IAuditLogDocument extends IAuditLog, Document { }

export const AuditLogSchema = new Schema<IAuditLogDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
        action: { type: String, required: true },
        targetType: { type: String, required: true, index: true },
        targetId: { type: Schema.Types.ObjectId, default: null, index: true },
        changes: {
            type: Schema.Types.Mixed,
            default: null,
        },
        ipAddress: { type: String, default: null },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Audit logs are immutable, no need for updatedAt
    }
);

// Optimize time-series queries for dashboards
AuditLogSchema.index({ storeId: 1, createdAt: -1 });

// Prevent duplicate model compilation in hot reload environments
export const AuditLog: Model<IAuditLogDocument> =
    mongoose.models.AuditLog ||
    mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema);

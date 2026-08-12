import mongoose, { Schema, Document, Model } from "mongoose";

export type StoreMemberRole = "owner" | "admin" | "manager" | "staff";
export type StoreMemberStatus = "active" | "inactive";

export interface IStoreMember {
    storeId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: StoreMemberRole;
    permissions: string[];
    status: StoreMemberStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStoreMemberDocument extends IStoreMember, Document { }

export const StoreMemberSchema = new Schema<IStoreMemberDocument>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["owner", "admin", "manager", "staff"],
            default: "staff",
        },
        permissions: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a user can only be added to a store once
StoreMemberSchema.index({ storeId: 1, userId: 1 }, { unique: true });

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const StoreMember: Model<IStoreMemberDocument> =
    mongoose.models.StoreMember ||
    mongoose.model<IStoreMemberDocument>("StoreMember", StoreMemberSchema);

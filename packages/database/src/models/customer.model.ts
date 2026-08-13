import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer {
    storeId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId | null; // Nullable if guest, or linked to User system
    shopifyCustomerId: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    phone?: string | null;
    ordersCount: number;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICustomerDocument extends ICustomer, Document { }

export const CustomerSchema = new Schema<ICustomerDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
        shopifyCustomerId: { type: String, required: true },
        firstName: { type: String, default: null },
        lastName: { type: String, default: null },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, default: null },
        ordersCount: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate customers from Shopify
CustomerSchema.index({ storeId: 1, shopifyCustomerId: 1 }, { unique: true });

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const Customer: Model<ICustomerDocument> =
    mongoose.models.Customer ||
    mongoose.model<ICustomerDocument>("Customer", CustomerSchema);

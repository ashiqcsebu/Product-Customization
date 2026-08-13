import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductionStatus =
    | "pending"
    | "design_validation"
    | "file_preparation"
    | "ready_for_production"
    | "in_production"
    | "quality_check"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";

export interface IShippingAddress {
    firstName?: string | null;
    lastName?: string | null;
    address1?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
}

export interface IOrder {
    storeId: mongoose.Types.ObjectId;
    customerId?: mongoose.Types.ObjectId | null;
    shopifyOrderId: string;
    shopifyOrderNumber: string;
    email: string;
    financialStatus: string; // e.g. "paid", "pending"
    fulfillmentStatus: string; // e.g. "unfulfilled", "fulfilled"
    currency: string;
    subtotalPrice: number;
    totalDiscount: number;
    totalTax: number;
    totalPrice: number;
    shippingAddress: IShippingAddress;
    productionStatus: ProductionStatus;
    placedAt: Date;
    cancelledAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document { }

const ShippingAddressSchema = new Schema<IShippingAddress>(
    {
        firstName: { type: String, default: null },
        lastName: { type: String, default: null },
        address1: { type: String, default: null },
        city: { type: String, default: null },
        province: { type: String, default: null },
        postalCode: { type: String, default: null },
        country: { type: String, default: null },
    },
    { _id: false }
);

export const OrderSchema = new Schema<IOrderDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            default: null,
            index: true,
        },
        shopifyOrderId: { type: String, required: true, unique: true },
        shopifyOrderNumber: { type: String, required: true },
        email: { type: String, required: true },
        financialStatus: { type: String, required: true, default: "pending" },
        fulfillmentStatus: { type: String, required: true, default: "unfulfilled" },
        currency: { type: String, required: true, default: "USD" },
        subtotalPrice: { type: Number, required: true },
        totalDiscount: { type: Number, required: true, default: 0 },
        totalTax: { type: Number, required: true, default: 0 },
        totalPrice: { type: Number, required: true },
        shippingAddress: { type: ShippingAddressSchema, default: () => ({}) },
        productionStatus: {
            type: String,
            enum: [
                "pending",
                "design_validation",
                "file_preparation",
                "ready_for_production",
                "in_production",
                "quality_check",
                "packed",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
            index: true,
        },
        placedAt: { type: Date, required: true },
        cancelledAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const Order: Model<IOrderDocument> =
    mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

import mongoose, { Schema, Document, Model } from "mongoose";
import { ProductionStatus } from "./order.model.js";
import { IPricingChargeSnapshot } from "./design-version.model.js";

// Redeclare sub schema inline to avoid circular dependency / hot-reload edge case
const PricingChargeSnapshotSchema = new Schema<IPricingChargeSnapshot>(
    {
        key: { type: String, required: true },
        label: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    { _id: false }
);

export interface IOrderItemPriceSnapshot {
    basePrice: number;
    customizationCharges: IPricingChargeSnapshot[];
    unitPrice: number;
    lineTotal: number;
    currency: string;
}

export interface IProductionHistoryEvent {
    status: ProductionStatus;
    changedBy?: mongoose.Types.ObjectId | null;
    changedAt: Date;
}

export interface IOrderItemProduction {
    status: ProductionStatus;
    assignedTo?: mongoose.Types.ObjectId | null;
    history: IProductionHistoryEvent[];
}

export interface IOrderItem {
    storeId: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    shopifyLineItemId: string;
    productId: mongoose.Types.ObjectId;
    variantId: mongoose.Types.ObjectId;
    designId: mongoose.Types.ObjectId;
    designVersionId: mongoose.Types.ObjectId;
    title: string;
    variantTitle: string;
    sku: string;
    quantity: number;
    priceSnapshot: IOrderItemPriceSnapshot;
    previewAssetIds: mongoose.Types.ObjectId[];
    printFileAssetIds: mongoose.Types.ObjectId[]; // The high-res 300DPI output files
    production: IOrderItemProduction;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItemDocument extends IOrderItem, Document { }

const OrderItemPriceSnapshotSchema = new Schema<IOrderItemPriceSnapshot>(
    {
        basePrice: { type: Number, required: true },
        customizationCharges: { type: [PricingChargeSnapshotSchema], default: [] },
        unitPrice: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
        currency: { type: String, required: true, default: "USD" },
    },
    { _id: false }
);

const ProductionHistoryEventSchema = new Schema<IProductionHistoryEvent>(
    {
        status: { type: String, required: true }, // Verified by the parent schema enum
        changedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
        changedAt: { type: Date, required: true, default: Date.now },
    },
    { _id: false }
);

const OrderItemProductionSchema = new Schema<IOrderItemProduction>(
    {
        status: {
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
        },
        assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
        history: { type: [ProductionHistoryEventSchema], default: [] },
    },
    { _id: false }
);

export const OrderItemSchema = new Schema<IOrderItemDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
        shopifyLineItemId: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: { type: Schema.Types.ObjectId, ref: "ProductVariant", required: true },
        designId: { type: Schema.Types.ObjectId, ref: "Design", required: true },
        designVersionId: { type: Schema.Types.ObjectId, ref: "DesignVersion", required: true },
        title: { type: String, required: true },
        variantTitle: { type: String, required: true },
        sku: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        priceSnapshot: { type: OrderItemPriceSnapshotSchema, required: true },
        previewAssetIds: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        printFileAssetIds: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        production: {
            type: OrderItemProductionSchema,
            default: () => ({ status: "pending", history: [] }),
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const OrderItem: Model<IOrderItemDocument> =
    mongoose.models.OrderItem ||
    mongoose.model<IOrderItemDocument>("OrderItem", OrderItemSchema);

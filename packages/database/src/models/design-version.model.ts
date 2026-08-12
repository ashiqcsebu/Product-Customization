import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductSnapshot {
    productId: mongoose.Types.ObjectId;
    shopifyProductId: string;
    title: string;
}

export interface IVariantSnapshot {
    variantId: mongoose.Types.ObjectId;
    shopifyVariantId: string;
    title: string;
    sku?: string | null;
    options: Record<string, string>;
}

export interface IPricingChargeSnapshot {
    key: string;
    label: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface IPricingSnapshot {
    basePrice: number;
    charges: IPricingChargeSnapshot[];
    discount: number;
    total: number;
    currency: string;
}

export interface IDesignVersion {
    storeId: mongoose.Types.ObjectId;
    designId: mongoose.Types.ObjectId;
    versionNumber: number;
    source: "add_to_cart" | "admin_export" | "manual_save";
    label?: string | null;
    productSnapshot: IProductSnapshot;
    variantSnapshot: IVariantSnapshot;
    pricingSnapshot: IPricingSnapshot;
    previewAssetIds: mongoose.Types.ObjectId[];
    locked: boolean;
    lockedAt?: Date | null;
    createdBy?: mongoose.Types.ObjectId | null; // Nullable if created by guest customer
    createdAt: Date;
    updatedAt: Date;
}

export interface IDesignVersionDocument extends IDesignVersion, Document { }

const ProductSnapshotSchema = new Schema<IProductSnapshot>(
    {
        productId: { type: Schema.Types.ObjectId, required: true },
        shopifyProductId: { type: String, required: true },
        title: { type: String, required: true },
    },
    { _id: false }
);

const VariantSnapshotSchema = new Schema<IVariantSnapshot>(
    {
        variantId: { type: Schema.Types.ObjectId, required: true },
        shopifyVariantId: { type: String, required: true },
        title: { type: String, required: true },
        sku: { type: String, default: null },
        options: { type: Map, of: String, default: {} },
    },
    { _id: false }
);

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

const PricingSnapshotSchema = new Schema<IPricingSnapshot>(
    {
        basePrice: { type: Number, required: true },
        charges: { type: [PricingChargeSnapshotSchema], default: [] },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        currency: { type: String, required: true, default: "USD" },
    },
    { _id: false }
);

export const DesignVersionSchema = new Schema<IDesignVersionDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        designId: { type: Schema.Types.ObjectId, ref: "Design", required: true, index: true },
        versionNumber: { type: Number, required: true },
        source: {
            type: String,
            enum: ["add_to_cart", "admin_export", "manual_save"],
            required: true,
        },
        label: { type: String, default: "Cart Version" },
        productSnapshot: { type: ProductSnapshotSchema, required: true },
        variantSnapshot: { type: VariantSnapshotSchema, required: true },
        pricingSnapshot: { type: PricingSnapshotSchema, required: true },
        previewAssetIds: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        locked: { type: Boolean, default: true },
        lockedAt: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    {
        timestamps: true,
    }
);

export const DesignVersion: Model<IDesignVersionDocument> =
    mongoose.models.DesignVersion ||
    mongoose.model<IDesignVersionDocument>("DesignVersion", DesignVersionSchema);

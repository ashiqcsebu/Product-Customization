import mongoose, { Schema, Document, Model } from "mongoose";

export type StoreStatus = "active" | "inactive" | "uninstalled";

export interface IStoreSettings {
    autosaveInterval: number;
    defaultDpi: number;
    maxUploadSizeMb: number;
    allowGuestDesigns: boolean;
    designExpirationDays: number;
}

export interface IStore {
    name: string;
    shopDomain: string;
    shopifyShopId?: string | null;
    currency: string;
    timezone?: string | null;
    status: StoreStatus;
    settings: IStoreSettings;
    installedAt?: Date | null;
    uninstalledAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStoreDocument extends IStore, Document { }

const StoreSettingsSchema = new Schema<IStoreSettings>(
    {
        autosaveInterval: { type: Number, default: 4000 },
        defaultDpi: { type: Number, default: 300 },
        maxUploadSizeMb: { type: Number, default: 25 },
        allowGuestDesigns: { type: Boolean, default: true },
        designExpirationDays: { type: Number, default: 30 },
    },
    { _id: false }
);

export const StoreSchema = new Schema<IStoreDocument>(
    {
        name: { type: String, required: true },
        shopDomain: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        shopifyShopId: {
            type: String,
            sparse: true,
            unique: true,
            default: null,
        },
        currency: { type: String, required: true, default: "USD" },
        timezone: { type: String, default: null },
        status: {
            type: String,
            enum: ["active", "inactive", "uninstalled"],
            default: "active",
            index: true,
        },
        settings: {
            type: StoreSettingsSchema,
            default: () => ({}),
        },
        installedAt: { type: Date, default: null },
        uninstalledAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments
export const Store: Model<IStoreDocument> =
    mongoose.models.Store || mongoose.model<IStoreDocument>("Store", StoreSchema);

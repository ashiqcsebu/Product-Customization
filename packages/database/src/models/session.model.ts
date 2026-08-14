import mongoose, { Schema, Document, Model } from "mongoose";
export interface ISessionParams {
    id: string;
    shop: string;
    state: string;
    isOnline: boolean;
    scope?: string;
    expires?: Date;
    accessToken?: string;
    onlineAccessInfo?: any;
}

export interface ISessionDocument extends Document, ISessionParams { }

export const SessionSchema = new Schema<ISessionDocument>(
    {
        id: { type: String, required: true, unique: true },
        shop: { type: String, required: true, index: true },
        state: { type: String, required: true },
        isOnline: { type: Boolean, required: true },
        scope: { type: String, default: null },
        expires: { type: Date, default: null },
        accessToken: { type: String, default: "" },
        onlineAccessInfo: { type: Schema.Types.Mixed, default: null }
    },
    { timestamps: true }
);

export const ShopifySession: Model<ISessionDocument> =
    mongoose.models.ShopifySession || mongoose.model<ISessionDocument>("ShopifySession", SessionSchema);

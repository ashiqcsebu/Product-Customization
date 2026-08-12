import mongoose, { Schema, Document, Model } from "mongoose";

export type UserStatus = "active" | "inactive" | "suspended";
export type AuthProvider = "credentials" | "google" | "shopify";

export interface IUser {
    name: string;
    email: string;
    passwordHash?: string | null;
    authProvider: AuthProvider;
    providerUserId?: string | null;
    avatarUrl?: string | null;
    emailVerifiedAt?: Date | null;
    status: UserStatus;
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, Document { }

export const UserSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: { type: String, default: null }, // Nullable for OAuth
        authProvider: {
            type: String,
            enum: ["credentials", "google", "shopify"],
            default: "credentials",
        },
        providerUserId: {
            type: String,
            default: null,
            sparse: true,
        },
        avatarUrl: { type: String, default: null },
        emailVerifiedAt: { type: Date, default: null },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
            index: true,
        },
        lastLoginAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

import mongoose, { Schema, Document, Model } from "mongoose";

export type PricingRuleType = "view_used" | "service" | "quantity" | "object_count";
export type PricingCalculationMethod = "fixed" | "percentage" | "per_unit";

export interface IPricingRuleCondition {
    viewKey?: string;
    minimumObjectCount?: number;
    serviceKey?: string;
}

export interface IPricingRuleCalculation {
    method: PricingCalculationMethod;
    amount: number;
}

export interface IPricingRuleTier {
    min: number;
    max?: number | null;
    discountPercent: number;
}

export interface IPricingRule {
    id: string; // unique identifier for the rule (e.g. 'front_print')
    name: string;
    type: PricingRuleType;
    condition?: IPricingRuleCondition;
    calculation?: IPricingRuleCalculation;
    tiers?: IPricingRuleTier[];
}

export interface IPricingRuleSet {
    storeId: mongoose.Types.ObjectId;
    name: string;
    currency: string;
    rules: IPricingRule[];
    status: "active" | "inactive";
    createdAt: Date;
    updatedAt: Date;
}

export interface IPricingRuleSetDocument extends IPricingRuleSet, Document { }

const PricingRuleConditionSchema = new Schema<IPricingRuleCondition>(
    {
        viewKey: { type: String },
        minimumObjectCount: { type: Number },
        serviceKey: { type: String },
    },
    { _id: false }
);

const PricingRuleCalculationSchema = new Schema<IPricingRuleCalculation>(
    {
        method: {
            type: String,
            enum: ["fixed", "percentage", "per_unit"],
            required: true,
        },
        amount: { type: Number, required: true },
    },
    { _id: false }
);

const PricingRuleTierSchema = new Schema<IPricingRuleTier>(
    {
        min: { type: Number, required: true },
        max: { type: Number, default: null },
        discountPercent: { type: Number, required: true },
    },
    { _id: false }
);

const PricingRuleSchema = new Schema<IPricingRule>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["view_used", "service", "quantity", "object_count"],
            required: true,
        },
        condition: { type: PricingRuleConditionSchema },
        calculation: { type: PricingRuleCalculationSchema },
        tiers: { type: [PricingRuleTierSchema] },
    },
    { _id: false }
);

export const PricingRuleSetSchema = new Schema<IPricingRuleSetDocument>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        name: { type: String, required: true },
        currency: { type: String, required: true, default: "USD" },
        rules: { type: [PricingRuleSchema], default: [] },
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

// Prevent duplicate model compilation in hot reload environments (Next.js/tsx)
export const PricingRuleSet: Model<IPricingRuleSetDocument> =
    mongoose.models.PricingRuleSet ||
    mongoose.model<IPricingRuleSetDocument>("PricingRuleSet", PricingRuleSetSchema);
